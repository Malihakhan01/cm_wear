const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const localPhp = path.join(__dirname, 'run_sync_product_types.php');
const remotePhp = '/home/u382928869/domains/cmsportswear.pk/backend/run_sync_product_types.php';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection ready.');
  conn.sftp((err, sftp) => {
    if (err) throw err;
    console.log('Uploading sync script to remote backend...');
    sftp.fastPut(localPhp, remotePhp, {}, (err) => {
      if (err) throw err;
      console.log('Upload complete. Executing PHP script on remote server...');

      conn.exec(`php ${remotePhp} && rm -f ${remotePhp}`, (err, stream) => {
        if (err) throw err;
        stream.on('data', d => process.stdout.write(d.toString()));
        stream.stderr.on('data', d => process.stderr.write(d.toString()));
        stream.on('close', (code) => {
          console.log(`\nExecution finished with code: ${code}`);
          conn.end();
        });
      });
    });
  });
}).connect(config);
