const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  './public/categories',
  './public/HERO',
  './public/cm_logo',
  './public/images/fabrics',
  './public/images/background'
];

async function optimizeDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();
    if (ext === '.png' && stat.size > 400 * 1024) {
      console.log(`Optimizing: ${fullPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
      try {
        const meta = await sharp(fullPath).metadata();
        const maxW = dir.includes('HERO') ? 1920 : 1200;
        const tempPath = fullPath + '.tmp.png';
        
        await sharp(fullPath)
          .resize({ width: Math.min(meta.width || 1200, maxW), withoutEnlargement: true })
          .png({ quality: 85, compressionLevel: 9, palette: true })
          .toFile(tempPath);
        
        const newStat = fs.statSync(tempPath);
        if (newStat.size < stat.size && newStat.size > 1000) {
          fs.renameSync(tempPath, fullPath);
          console.log(`  -> Shrunk to ${(newStat.size / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - newStat.size / stat.size) * 100)}% savings)`);
        } else {
          fs.unlinkSync(tempPath);
          console.log(`  -> Kept original (no significant reduction)`);
        }
      } catch (err) {
        console.error(`  Error optimizing ${file}:`, err.message);
      }
    }
  }
}

async function run() {
  console.log('=== STARTING HIGH-EFFICIENCY IMAGE OPTIMIZATION ===');
  let beforeTotal = 0;
  for (const d of TARGET_DIRS) {
    await optimizeDirectory(d);
  }
  console.log('=== IMAGE OPTIMIZATION COMPLETE ===');
}

run();
