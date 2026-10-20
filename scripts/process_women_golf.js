const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/women-golf-uniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processGolf() {
  console.log('Processing Women Golf Uniform (Photorealistic Cut Parts)...');

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

  function getGolfRaglanX(y) {
    if (y < 60) return 530;
    if (y <= 140) {
      const t = (y - 60) / 80;
      return 530 - t * 65; // 530 down to 465
    }
    if (y <= 240) {
      const t = (y - 140) / 100;
      return 465 - t * 45; // 465 down to 420
    }
    if (y <= 360) {
      const t = (y - 240) / 120;
      return 420 - t * 5;  // 420 down to 415
    }
    return 415;
  }

  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // Sleeves
    if (y <= 360) {
      const leftSeamX = getGolfRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 425) {
      if (x < 415) return 'sleeves';
      if (x > 839) return 'sleeves';
    }

    // Polo bottom hem: peaks at y=872 in center, curves up to ~850 at sides
    const normX = (x - 635) / 240;
    const hemY = 872 - Math.min(1.5, normX * normX) * 22;
    if (y <= hemY) return 'jersey';

    // Pleated skort
    return 'skort';
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
  await saveFrontPart('skort', 'front_skort.png');

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

    if (y <= 360) {
      const leftSeamX = getGolfRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 425) {
      if (x < 415) return 'sleeves';
      if (x > 839) return 'sleeves';
    }

    const normX = (x - 635) / 240;
    const hemY = 870 - Math.min(1.5, normX * normX) * 20;
    if (y <= hemY) return 'jersey';

    return 'skort';
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
  await saveBackPart('skort', 'back_skort.png');

  // Clean temp crops
  ['crop_hem.png', 'crop_top.png'].forEach(f => {
    const p = path.join(DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  console.log('Women Golf Uniform Processing Complete!');
}

processGolf().catch(err => {
  console.error(err);
  process.exit(1);
});
