import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Uso: node scripts/hashPassword.js "sua-senha-segura"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log('\nAdicione esta linha ao seu server/.env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
