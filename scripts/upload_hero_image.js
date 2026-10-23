const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const REMOTE_BASE = '/home/u382928869/domains/cmsportswear.pk/public_html';
const localFile = path.resolve(__dirname, '../out/HERO/Multi-Sport Ice Arena Showdown.webp');
const remoteFile = `${REMOTE_BASE}/HERO/Multi-Sport Ice Arena Showdown.webp`;

async function main() {
  if (!fs.existsSync(localFile)) {
    throw new Error('Local file not found: ' + localFile);
  }
  console.log('Uploading HERO image to live server...');

  const conn = new Client();
  await new Promise((res, rej) => conn.on('ready', res).on('error', rej).connect(config));
  console.log('✓ SSH connected.');

  const sftp = await new Promise((res, rej) => conn.sftp((err, s) => err ? rej(err) : res(s)));

  // Ensure remote HERO directory exists
  await new Promise((resolve) => {
    conn.exec(`mkdir -p ${REMOTE_BASE}/HERO`, (err, stream) => {
      stream.on('close', resolve);
      stream.on('data', () => {});
      stream.stderr.on('data', () => {});
    });
  });

  await new Promise((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err) => err ? reject(err) : resolve());
  });

  console.log('✓ Image uploaded: Multi-Sport Ice Arena Showdown.webp');
  conn.end();
}

main().catch(console.error);
