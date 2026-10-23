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
const tarFile = path.resolve(__dirname, '../frontend_update.tar.gz');

async function main() {
  // 1. Create fresh tarball from out/ directory
  console.log('Packaging build output...');
  if (!fs.existsSync(outDir)) {
    throw new Error('out/ directory not found. Run npm run build first.');
  }

  // Change into out/ dir so tar paths are relative, then back out
  const originalDir = process.cwd();
  process.chdir(outDir);
  execSync(`tar -czf "${tarFile}" .`, { stdio: 'inherit' });
  process.chdir(originalDir);

  const stat = fs.statSync(tarFile);
  console.log(`✓ Tarball created: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);

  // 2. Upload and extract on live server
  console.log('Connecting to live server...');
  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connection established.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  console.log('Uploading tarball...');
  await new Promise((resolve, reject) => {
    sftp.fastPut(tarFile, `${REMOTE_BASE}/frontend_update.tar.gz`, {}, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ Tarball uploaded.');

  // 3. Extract on server
  await new Promise((resolve, reject) => {
    conn.exec([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../frontend_update.tar.gz`,
      `rm -f ../frontend_update.tar.gz`,
      `echo "=== DEPLOY COMPLETE ==="`,
      `echo "HTML pages:"`,
      `ls -lh index.html catalog/index.html 2>/dev/null || echo "index files updated"`,
      `echo "JS chunks:"`,
      `ls -lh _next/static/chunks/*.js | wc -l`
    ].join(' && '), (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`SSH command failed with code ${code}`)));
    });
  });

  conn.end();
  console.log('\n✓ Live site fully synchronized at cmsportswear.pk!');
}

main().catch(err => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
