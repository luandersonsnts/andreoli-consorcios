import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

async function ensureConfigTable() {
  await sql`CREATE TABLE IF NOT EXISTS global_config (
    id INTEGER PRIMARY KEY,
    premiacao_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    campaign_label TEXT NOT NULL DEFAULT 'dezembro',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`INSERT INTO global_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    await ensureConfigTable();
    const result = await sql`SELECT premiacao_enabled, campaign_label FROM global_config WHERE id = 1`;
    const row = result.rows[0] || { premiacao_enabled: false, campaign_label: 'dezembro' };
    res.status(200).json({ premiacaoEnabled: row.premiacao_enabled, campaignLabel: row.campaign_label });
  } catch (err) {
    console.error('public config error', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}