const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BACKEND = '/home/u382928869/domains/cmsportswear.pk/backend';

async function main() {
  console.log('Syncing fresh backend code to cmsportswear.pk/backend...');
  const backendDir = path.resolve(__dirname, '../backend');
  const tarFile = path.resolve(__dirname, '../backend_updates.tar.gz');

  if (fs.existsSync(tarFile)) fs.unlinkSync(tarFile);

  // Tar routes, config, app, resources (excluding vendor, storage)
  execSync(`tar -czf "${tarFile}" -C "${backendDir}" routes config app resources`, { stdio: 'inherit' });
  console.log('✓ Tarball created.');

  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connection established.');
  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  await new Promise((resolve, reject) => {
    sftp.fastPut(tarFile, `${REMOTE_BACKEND}/backend_updates.tar.gz`, (err) => err ? reject(err) : resolve());
  });
  console.log('✓ Updates uploaded.');

  await new Promise((resolve, reject) => {
    conn.exec([
      `cd ${REMOTE_BACKEND}`,
      `tar -xzf backend_updates.tar.gz`,
      `rm -f backend_updates.tar.gz`,
      `php artisan route:clear`,
      `php artisan config:clear`,
      `php artisan cache:clear`,
      `php artisan view:clear`,
      `echo "=== VERIFY ROUTE ON LIVE ==="`,
      `php artisan route:list --name=products.images`
    ].join(' && '), (err, stream) => {
      if (err) return reject(err);
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed with ${code}`)));
    });
  });

  conn.end();
  console.log('\n✓ Backend code fully synchronized on cmsportswear.pk!');
}

main().catch(console.error);
