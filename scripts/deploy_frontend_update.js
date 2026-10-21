const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BASE = '/home/u382928869/domains/cmsportswear.pk';

async function main() {
  console.log('Deploying updated frontend bundles to cmsportswear.pk/public_html...');
  const tarFile = path.resolve(__dirname, '../frontend_update.tar.gz');

  if (!fs.existsSync(tarFile)) {
    throw new Error('frontend_update.tar.gz not found');
  }

  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connection established.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  await new Promise((resolve, reject) => {
    sftp.fastPut(tarFile, `${REMOTE_BASE}/frontend_update.tar.gz`, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ Tarball uploaded to remote.');

  await new Promise((resolve, reject) => {
    conn.exec([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../frontend_update.tar.gz`,
      `rm -f ../frontend_update.tar.gz`,
      `echo "=== EXTRACTED CHUNKS ON LIVE ==="`,
      `ls -lh _next/static/chunks/*.js | head -n 5`
    ].join(' && '), (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed with ${code}`)));
    });
  });

  conn.end();
  console.log('\n✓ Frontend successfully synchronized on live cmsportswear.pk!');
}

main().catch(console.error);
