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
  console.log('Packaging optimized build output (excluding static media)...');
  if (!fs.existsSync(outDir)) {
    throw new Error('out/ directory not found. Run npm run build first.');
  }

  if (fs.existsSync(tarFile)) {
    fs.unlinkSync(tarFile);
  }

  const originalDir = process.cwd();
  process.chdir(outDir);
  // Exclude huge static asset folders that already reside on server
  execSync(`tar --exclude="images" --exclude="videos" --exclude="HERO" --exclude="placeholder.jpg" -czf "${tarFile}" .`, { stdio: 'inherit' });
  process.chdir(originalDir);

  const stat = fs.statSync(tarFile);
  console.log(`✓ Optimized tarball created: ${(stat.size / 1024 / 1024).toFixed(1)} MB`);

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

  console.log('Extracting on live server...');
  await new Promise((resolve, reject) => {
    conn.exec([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../frontend_update.tar.gz`,
      `rm -f ../frontend_update.tar.gz`,
      `echo "=== DEPLOY COMPLETE ==="`,
      `ls -lh index.html catalog/index.html 2>/dev/null || echo "catalog updated"`
    ].join(' && '), (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed with ${code}`)));
    });
  });

  conn.end();
  if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);
  console.log('\n✓ Frontend successfully updated on cmsportswear.pk!');
}

main().catch(console.error);
