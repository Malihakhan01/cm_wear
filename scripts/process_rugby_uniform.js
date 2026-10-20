const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/rugby-uniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processRugby() {
  console.log('Processing Rugby Uniform (Photorealistic Cut Parts)...');

  // 1. Process FRONT
  const frontImg = sharp(FRONT_SRC);
  const frontMeta = await frontImg.metadata();
  const W = frontMeta.width;  // 1254
  const H = frontMeta.height; // 1254
  const { data: frontData } = await frontImg.raw().toBuffer({ resolveWithObject: true });

  await sharp(frontData, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(DIR, 'front_base.png'));
  console.log('Created front_base.png');

  function getRaglanX(y) {
    if (y < 80) return 550;
    if (y <= 160) {
      const t = (y - 80) / 80;
      return 550 - t * 45; // 550 down to 505
    }
    if (y <= 330) {
      const t = (y - 160) / 170;
      return 505 - t * 45; // 505 down to 460
    }
    return 460;
  }

  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // Socks (lower region below gap)
    if (y > 790) return 'socks';

    // Sleeves
    if (y <= 330) {
      const leftSeamX = getRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 430) {
      if (x < 445) return 'sleeves';
      if (x > 809) return 'sleeves';
    }

    // Hem curve: peaks at y=579 around center x=635
    const normX = (x - 635) / 160;
    const hemY = 579 - Math.min(1.5, normX * normX) * 14;
    if (y <= hemY) return 'jersey';

    // Shorts
    return 'shorts';
  }

  async function saveFrontPart(partName, outFileName) {
    const partBuf = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        if (getFrontPart(x, y) === partName) {
          partBuf[idx] = frontData[idx];
          partBuf[idx + 1] = frontData[idx + 1];
          partBuf[idx + 2] = frontData[idx + 2];
          partBuf[idx + 3] = frontData[idx + 3];
        }
      }
    }
    await sharp(partBuf, { raw: { width: W, height: H, channels: 4 } }).png().toFile(path.join(DIR, outFileName));
    console.log(`Created ${outFileName}`);
  }

  await saveFrontPart('jersey', 'front_jersey.png');
  await saveFrontPart('sleeves', 'front_sleeves.png');
  await saveFrontPart('shorts', 'front_shorts.png');
  await saveFrontPart('socks', 'front_socks.png');

  // 2. Process BACK
  const backImg = sharp(BACK_SRC);
  const backMeta = await backImg.metadata();
  const BW = backMeta.width;
  const BH = backMeta.height;
  const { data: backData } = await backImg.raw().toBuffer({ resolveWithObject: true });

  await sharp(backData, { raw: { width: BW, height: BH, channels: 4 } })
    .png()
    .toFile(path.join(DIR, 'back_base.png'));
  console.log('Created back_base.png');

  function getBackPart(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return null;

    if (y > 790) return 'socks';

    if (y <= 330) {
      const leftSeamX = getRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 430) {
      if (x < 445) return 'sleeves';
      if (x > 809) return 'sleeves';
    }

    const normX = (x - 635) / 160;
    const hemY = 574 - Math.min(1.5, normX * normX) * 12;
    if (y <= hemY) return 'jersey';

    return 'shorts';
  }

  async function saveBackPart(partName, outFileName) {
    const partBuf = Buffer.alloc(BW * BH * 4);
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const idx = (y * BW + x) * 4;
        if (getBackPart(x, y) === partName) {
          partBuf[idx] = backData[idx];
          partBuf[idx + 1] = backData[idx + 1];
          partBuf[idx + 2] = backData[idx + 2];
          partBuf[idx + 3] = backData[idx + 3];
        }
      }
    }
    await sharp(partBuf, { raw: { width: BW, height: BH, channels: 4 } }).png().toFile(path.join(DIR, outFileName));
    console.log(`Created ${outFileName}`);
  }

  await saveBackPart('jersey', 'back_jersey.png');
  await saveBackPart('sleeves', 'back_sleeves.png');
  await saveBackPart('shorts', 'back_shorts.png');
  await saveBackPart('socks', 'back_socks.png');

  // Clean temp crops
  ['crop_hem.png', 'crop_shorts_socks.png', 'crop_top.png'].forEach(f => {
    const p = path.join(DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('Rugby Uniform Processing Complete!');
}

processRugby().catch(err => {
  console.error(err);
  process.exit(1);
});
