const { Client } = require('ssh2');
const path = require('path');
const fs = require('fs');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

async function main() {
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH Connected.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));
  const localScript = path.resolve(__dirname, '../backend/scripts/clean_meta_descriptions.php');

  await new Promise((resolve, reject) => {
    sftp.fastPut(localScript, `${REMOTE_BACKEND}/clean_meta.php`, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ clean_meta.php uploaded to live.');

  await new Promise((resolve, reject) => {
    conn.exec(`cd ${REMOTE_BACKEND} && php clean_meta.php && rm -f clean_meta.php`, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Exit ${code}`)));
    });
  });

  // Verify Product #686
  await new Promise((resolve, reject) => {
    conn.exec(`cd ${REMOTE_BACKEND} && php artisan tinker --execute="\\$p = App\\Models\\Product::find(686); echo 'Product 686 cleaned meta: ' . json_encode(\\$p ? \\$p->meta_description : 'none');"`, (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', () => resolve());
    });
  });

  conn.end();
}

main().catch(console.error);
