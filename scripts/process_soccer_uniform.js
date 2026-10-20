const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/socceruniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processSoccer() {
  console.log('Processing Soccer Uniform (Photorealistic Cut Parts)...');

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

  function getFrontRaglanX(y) {
    // Left raglan seam:
    // y: 70 -> 505
    // y: 140 -> 402
    // y: 200 -> 359
    // y: 230 -> 343
    // y: 290 -> 375
    // y: 350 -> 398
    if (y < 70) return 505;
    if (y <= 140) {
      const t = (y - 70) / 70;
      return 505 - t * 103;
    }
    if (y <= 230) {
      const t = (y - 140) / 90;
      return 402 - t * 59;
    }
    if (y <= 360) {
      const t = (y - 230) / 130;
      return 343 + t * 55;
    }
    return 398;
  }

  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // Sleeves
    if (y <= 360) {
      const leftSeamX = getFrontRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 440) {
      if (x < 398) return 'sleeves';
      if (x > 856) return 'sleeves';
    }

    // Hem curve: peaks at y=885 around center x=635, curves down to ~870 at x=400 and x=870
    const normX = (x - 635) / 235;
    const hemY = 885 - Math.min(1.5, normX * normX) * 15;
    if (y <= hemY) return 'jersey';

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
      const leftSeamX = getFrontRaglanX(y);
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 1254 - leftSeamX;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 440) {
      if (x < 398) return 'sleeves';
      if (x > 856) return 'sleeves';
    }

    const normX = (x - 635) / 235;
    const hemY = 887 - Math.min(1.5, normX * normX) * 16;
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

  console.log('Soccer Uniform Processing Complete!');
}

processSoccer().catch(err => {
  console.error(err);
  process.exit(1);
});
