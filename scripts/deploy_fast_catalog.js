const { execSync } = require('child_process');
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
const outDir = path.resolve(__dirname, '../out');
const tarFile = path.resolve(__dirname, '../catalog_update.tar.gz');

async function main() {
  console.log('Packaging _next and catalog output...');
  if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);

  const originalDir = process.cwd();
  process.chdir(outDir);
  // Package _next, catalog, and index.html
  execSync(`tar -czf "${tarFile}" _next catalog index.html 404.html`, { stdio: 'inherit' });
  process.chdir(originalDir);

  const stat = fs.statSync(tarFile);
  console.log(`✓ Fast tarball created: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('Connecting to live server...');
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connection established.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  console.log('Uploading fast tarball...');
  await new Promise((resolve, reject) => {
    sftp.fastPut(tarFile, `${REMOTE_BASE}/catalog_update.tar.gz`, {}, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ Tarball uploaded.');

  console.log('Extracting on live server...');
  await new Promise((resolve, reject) => {
    conn.exec([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../catalog_update.tar.gz`,
      `rm -f ../catalog_update.tar.gz`,
      `echo "=== DEPLOY COMPLETE ==="`,
      `ls -lh catalog/index.html`
    ].join(' && '), (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed with ${code}`)));
    });
  });

  conn.end();
  if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
  console.log('\n✓ Fast catalog deployment completed successfully!');
}

main().catch(console.error);
