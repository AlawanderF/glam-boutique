import argon2 from 'argon2';

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hashPassword.js "sua-senha-segura"');
  process.exit(1);
}

const hash = await argon2.hash(password, { type: argon2.argon2id });
console.log('\nAdicione esta linha ao seu server/.env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
