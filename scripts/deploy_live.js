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

async function runDeploy() {
  const conn = new Client();

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(config);
  });
  console.log('SSH connection established successfully to Hostinger.');

  const sftp = await new Promise((resolve, reject) => {
    conn.sftp((err, sftpSession) => err ? reject(err) : resolve(sftpSession));
  });
  console.log('SFTP session opened.');

  function uploadWithProgress(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      const stats = fs.statSync(localPath);
      const totalSize = stats.size;
      let lastPercent = -1;

      console.log(`\nUploading ${path.basename(localPath)} (${(totalSize / (1024 * 1024)).toFixed(2)} MB)...`);

      sftp.fastPut(localPath, remotePath, {
        concurrency: 64,
        chunkSize: 32768,
        step: (transferred, chunk, total) => {
          const percent = Math.floor((transferred / total) * 100);
          if (percent !== lastPercent && percent % 10 === 0) {
            lastPercent = percent;
            console.log(`  [${percent}%] ${(transferred / (1024 * 1024)).toFixed(1)} / ${(total / (1024 * 1024)).toFixed(1)} MB`);
          }
        }
      }, (err) => {
        if (err) {
          console.error(`  Upload failed for ${path.basename(localPath)}:`, err);
          return reject(err);
        }
        console.log(`  Successfully uploaded ${path.basename(localPath)}.`);
        resolve();
      });
    });
  }

  function execRemote(cmd) {
    return new Promise((resolve, reject) => {
      console.log(`\nExecuting: ${cmd}`);
      conn.exec(cmd, (err, stream) => {
        if (err) return reject(err);
        let out = '';
        stream.on('data', d => {
          process.stdout.write(d.toString());
          out += d.toString();
        });
        stream.stderr.on('data', d => {
          process.stderr.write(d.toString());
          out += d.toString();
        });
        stream.on('close', (code) => {
          if (code === 0) resolve(out);
          else reject(new Error(`Command exited with code ${code}`));
        });
      });
    });
  }

  const rootDir = path.resolve(__dirname, '..');

  // STEP 1: Backend Updates (Already seeded, but keep fresh)
  const backendTar = path.resolve(rootDir, 'backend_updates.tar.gz');
  if (fs.existsSync(backendTar)) {
    console.log('\n--- PHASE 1: BACKEND SYNCHRONIZATION ---');
    await uploadWithProgress(backendTar, `${REMOTE_BASE}/backend_updates.tar.gz`);
    await execRemote([
      `cd ${REMOTE_BASE}/backend`,
      `tar -xzf ../backend_updates.tar.gz`,
      `rm -f ../backend_updates.tar.gz`,
      `rm -f bootstrap/cache/packages.php bootstrap/cache/services.php`,
      `php artisan package:discover`,
      `php artisan config:clear`,
      `php artisan route:clear`,
      `php artisan view:clear`,
      `grep -n "Default:" resources/views/admin/auth/login.blade.php || echo "Verified: Default credentials hint successfully removed from live view!"`
    ].join(' && '));
  }

  // STEP 2: Frontend Core
  const frontendCoreTar = path.resolve(rootDir, 'frontend_core.tar.gz');
  if (fs.existsSync(frontendCoreTar)) {
    console.log('\n--- PHASE 2: UPLOADING FRONTEND CORE PAGES & ASSETS ---');
    await uploadWithProgress(frontendCoreTar, `${REMOTE_BASE}/frontend_core.tar.gz`);
    await execRemote([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../frontend_core.tar.gz`,
      `rm -f ../frontend_core.tar.gz`,
      `[ -d build ] || cp -r ../backend/public/build ./build 2>/dev/null || true`,
      `ls -lh index.html certifications/index.html about/index.html cm_logo/`
    ].join(' && '));
  }

  // STEP 3: Catalogs
  const catalogsTar = path.resolve(rootDir, 'catalogs.tar.gz');
  if (fs.existsSync(catalogsTar)) {
    console.log('\n--- PHASE 3: UPLOADING CATALOGS (PDFs) ---');
    await uploadWithProgress(catalogsTar, `${REMOTE_BASE}/catalogs.tar.gz`);
    await execRemote([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../catalogs.tar.gz`,
      `rm -f ../catalogs.tar.gz`,
      `ls -lh catalogs/*.pdf | head -n 10`
    ].join(' && '));
  }

  // STEP 4: Production Images
  const productionTar = path.resolve(rootDir, 'production.tar.gz');
  if (fs.existsSync(productionTar)) {
    console.log('\n--- PHASE 4: UPLOADING PRODUCTION MANUFACTURING IMAGES ---');
    await uploadWithProgress(productionTar, `${REMOTE_BASE}/production.tar.gz`);
    await execRemote([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../production.tar.gz`,
      `rm -f ../production.tar.gz`,
      `ls -lh production/ | head -n 10`
    ].join(' && '));
  }

  // STEP 5: Videos
  const videosTar = path.resolve(rootDir, 'videos.tar.gz');
  if (fs.existsSync(videosTar)) {
    console.log('\n--- PHASE 5: UPLOADING MANUFACTURING VIDEOS ---');
    await uploadWithProgress(videosTar, `${REMOTE_BASE}/videos.tar.gz`);
    await execRemote([
      `cd ${REMOTE_BASE}/public_html`,
      `tar -xzf ../videos.tar.gz`,
      `rm -f ../videos.tar.gz`,
      `ls -lh videos/ | head -n 10`
    ].join(' && '));
  }

  // STEP 6: Final Verification
  console.log('\n--- PHASE 6: VERIFYING DEPLOYED ENDPOINTS ---');
  await execRemote([
    `echo "=== CHECKING HOMEPAGE TITLE ==="`,
    `grep -o "<title[^>]*>[^<]*</title>" ${REMOTE_BASE}/public_html/index.html || true`,
    `echo "=== CHECKING CATALOGS PAGE TITLE ==="`,
    `grep -o "<title[^>]*>[^<]*</title>" ${REMOTE_BASE}/public_html/catalogs/index.html || true`,
    `echo "=== CHECKING CUSTOMIZER DIRECTORIES ==="`,
    `ls -ld ${REMOTE_BASE}/public_html/customize/custom-american-football-uniform ${REMOTE_BASE}/public_html/customize/custom-soccer-uniform ${REMOTE_BASE}/public_html/american-football-uniform || true`
  ].join(' && '));

  console.log('\n==========================================');
  console.log('ALL DEPLOYMENT PHASES COMPLETED SUCCESSFULLY!');
  console.log('Live domain: https://cmsportswear.pk/');
  console.log('==========================================\n');

  conn.end();
}

runDeploy().catch(err => {
  console.error('\nDEPLOYMENT ERROR:', err);
  process.exit(1);
});
