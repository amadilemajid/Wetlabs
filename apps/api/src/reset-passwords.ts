import bcrypt from 'bcryptjs';
import { db } from './config/db';

async function reset() {
  const hash = await bcrypt.hash('Wetlabs123!', 12);
  const users = [
    'admin@wetlabs.app',
    'admin@wetlabs.ug',
    'officer@nema.go.ug',
    'researcher@ngo.org',
    'admin@nema.go.ug'
  ];

  for (const email of users) {
    await db.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
    console.log(`Updated password for ${email}`);
  }
  process.exit(0);
}

reset();
