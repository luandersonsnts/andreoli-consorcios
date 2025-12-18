import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { sql } from '@vercel/postgres';

function verifyAuth(req: VercelRequest): boolean {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

async function ensureConfigTable() {
  await sql`CREATE TABLE IF NOT EXISTS global_config (
    id INTEGER PRIMARY KEY,
    premiacao_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    campaign_label TEXT NOT NULL DEFAULT 'dezembro',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`INSERT INTO global_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'PATCH' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!verifyAuth(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await ensureConfigTable();

    if (req.method === 'GET') {
      const result = await sql`SELECT premiacao_enabled, campaign_label FROM global_config WHERE id = 1`;
      const row = result.rows[0] || { premiacao_enabled: false, campaign_label: 'dezembro' };
      res.status(200).json({ premiacaoEnabled: row.premiacao_enabled, campaignLabel: row.campaign_label });
      return;
    }

    // PATCH/POST update
    let bodyRaw: any = req.body ?? {};
    if (typeof bodyRaw === 'string') {
      try { bodyRaw = JSON.parse(bodyRaw); } catch {}
    }
    const body = (bodyRaw ?? {}) as Partial<{ premiacaoEnabled: boolean; campaignLabel: string }>;
    const hasPremiacao = typeof body.premiacaoEnabled === 'boolean';
    const hasLabel = typeof body.campaignLabel === 'string';

    const updated = await sql`
      UPDATE global_config
      SET
        premiacao_enabled = ${hasPremiacao ? body.premiacaoEnabled! : sql`premiacao_enabled`},
        campaign_label = ${hasLabel ? body.campaignLabel! : sql`campaign_label`},
        updated_at = NOW()
      WHERE id = 1
      RETURNING premiacao_enabled, campaign_label
    `;
    const row = updated.rows[0];
    res.status(200).json({ premiacaoEnabled: row.premiacao_enabled, campaignLabel: row.campaign_label });
  } catch (err) {
    console.error('admin/config error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}