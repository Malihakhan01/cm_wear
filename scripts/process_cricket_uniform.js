const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/cricket uniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processCricket() {
  console.log('Processing Cricket Uniform (Photorealistic Cut Parts)...');

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

  function getCricketRaglanX(y) {
    if (y < 80) return 525;
    if (y <= 160) {
      const t = (y - 80) / 80;
      return 525 - t * 45; // 525 down to 480
    }
    if (y <= 240) {
      const t = (y - 160) / 80;
      return 480 - t * 35; // 480 down to 445
    }
    if (y <= 340) {
      const t = (y - 240) / 100;
      return 445 + t * 5;  // 445 to 450
    }
    return 450;
  }

  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // Sleeves
    if (y <= 340) {
      const leftSeamX = getCricketRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 390) {
      if (x < 435) return 'sleeves';
      if (x > 819) return 'sleeves';
    }

    // Shirt bottom hem: peaks at y=638, curves to 617 at sides
    const normX = (x - 635) / 170;
    const hemY = 638 - Math.min(1.5, normX * normX) * 20;
    if (y <= hemY) return 'jersey';

    // Trousers
    return 'pants';
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
  await saveFrontPart('pants', 'front_pants.png');

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

    if (y <= 340) {
      const leftSeamX = getCricketRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 390) {
      if (x < 435) return 'sleeves';
      if (x > 819) return 'sleeves';
    }

    const normX = (x - 635) / 170;
    const hemY = 630 - Math.min(1.5, normX * normX) * 18;
    if (y <= hemY) return 'jersey';

    return 'pants';
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
  await saveBackPart('pants', 'back_pants.png');

  // Clean temp crops
  ['crop_hem.png', 'crop_top.png'].forEach(f => {
    const p = path.join(DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('Cricket Uniform Processing Complete!');
}

processCricket().catch(err => {
  console.error(err);
  process.exit(1);
});
