const fs = require('fs');
const path = require('path');
const { Client } = require('ssh2');

const config = {
  host: '31.97.120.64',
  port: 65002,
  username: 'u382928869',
  password: 'Sheikh2024@'
};

const conn = new Client();

console.log('Connecting to SSH server at ' + config.host + ':' + config.port + '...');

conn.on('ready', () => {
  console.log('SSH connection established successfully.');

  conn.sftp((err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    const rootDir = path.resolve(__dirname, '..');
    const frontendZipLocal = path.resolve(rootDir, 'frontend_deploy.zip');
    const frontendZipRemote = '/home/u382928869/domains/tawfiqindustry.com/frontend_deploy.zip';

    const backendZipLocal = path.resolve(rootDir, 'backend_code.zip');
    const backendZipRemote = '/home/u382928869/domains/tawfiqindustry.com/backend_code.zip';

    function uploadFile(localPath, remotePath, callback) {
      const stats = fs.statSync(localPath);
      const totalSize = stats.size;
      let uploaded = 0;
      let lastPercent = -1;

      console.log(`Starting upload: ${path.basename(localPath)} (${(totalSize / (1024 * 1024)).toFixed(2)} MB) -> ${remotePath}`);

      const readStream = fs.createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);

      readStream.on('data', (chunk) => {
        uploaded += chunk.length;
        const percent = Math.floor((uploaded / totalSize) * 100);
        if (percent !== lastPercent && percent % 10 === 0) {
          lastPercent = percent;
          process.stdout.write(`Upload progress: ${percent}%\r`);
        }
      });

      writeStream.on('close', () => {
        console.log(`\nSuccessfully uploaded ${path.basename(localPath)} to server.`);
        callback(null);
      });

      writeStream.on('error', (err) => {
        console.error(`\nUpload failed for ${path.basename(localPath)}:`, err);
        callback(err);
      });

      readStream.pipe(writeStream);
    }

    uploadFile(frontendZipLocal, frontendZipRemote, (err) => {
      if (err) {
        conn.end();
        return;
      }

      console.log('Frontend archive uploaded successfully.');
      console.log('Extracting on remote server...');

      const backendFilesToSync = [
        {
          local: path.resolve(rootDir, 'backend/routes/web.php'),
          remote: '/home/u382928869/domains/tawfiqindustry.com/backend/routes/web.php'
        },
        {
          local: path.resolve(rootDir, 'backend/routes/api.php'),
          remote: '/home/u382928869/domains/tawfiqindustry.com/backend/routes/api.php'
        },
        {
          local: path.resolve(rootDir, 'backend/app/Http/Controllers/Api/V1/CategoryApiController.php'),
          remote: '/home/u382928869/domains/tawfiqindustry.com/backend/app/Http/Controllers/Api/V1/CategoryApiController.php'
        },
        {
          local: path.resolve(rootDir, 'backend/app/Models/Product.php'),
          remote: '/home/u382928869/domains/tawfiqindustry.com/backend/app/Models/Product.php'
        },
        {
          local: path.resolve(rootDir, 'backend/resources/views/components/sidebar.blade.php'),
          remote: '/home/u382928869/domains/tawfiqindustry.com/backend/resources/views/components/sidebar.blade.php'
        }
      ];

      function syncBackendFiles(done) {
        let idx = 0;
        function next() {
          if (idx >= backendFilesToSync.length) {
            return done();
          }
          const item = backendFilesToSync[idx++];
          if (fs.existsSync(item.local)) {
            console.log(`Syncing backend file: ${path.basename(item.local)} -> ${item.remote}`);
            sftp.fastPut(item.local, item.remote, (err) => {
              if (err) console.error(`Error uploading ${item.local}:`, err);
              next();
            });
          } else {
            next();
          }
        }
        next();
      }

      syncBackendFiles(() => {
        const deployCommands = [
          'cd /home/u382928869/domains/tawfiqindustry.com',
          'rm -rf public_html/_next/static/chunks/*',
          'unzip -o -q frontend_deploy.zip -d public_html/ || true',
          'rm -f frontend_deploy.zip',
          'cd backend && php artisan view:clear && php artisan route:clear || true',
          'cd /home/u382928869/domains/tawfiqindustry.com',
          'ls -lh public_html/categories/"Equestrian wear.png" public_html/categories/"Teamsport Wear.png" public_html/categories/"USA Hockey Player Racing Across Ice (1).png" public_html/catalog/index.html'
        ].join(' && ');

        conn.exec(deployCommands, (execErr, stream) => {
          if (execErr) {
            console.error('Execution error:', execErr);
            conn.end();
            return;
          }

          stream.on('close', (code, signal) => {
            console.log('Remote deploy command finished with code: ' + code);
            conn.end();
          }).on('data', (data) => {
            console.log('SERVER: ' + data.toString().trim());
          }).stderr.on('data', (data) => {
            console.log('SERVER ERR: ' + data.toString().trim());
          });
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('SSH connection failed:', err);
}).connect(config);
