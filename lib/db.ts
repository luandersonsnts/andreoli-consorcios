import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { 
  users,
  simulations,
  complaints,
  jobApplications,
  consortiumSimulations
} from '../shared/schema';

// Create the database connection
export const db = drizzle(sql, {
  schema: {
    users,
    simulations,
    complaints,
    jobApplications,
    consortiumSimulations
  }
});

export * from '../shared/schema';