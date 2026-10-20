const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/american-football-uniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processFootball() {
  console.log('Processing American Football Uniform (Photorealistic Cut Parts)...');

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

  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // Sleeves / shoulder caps:
    // Upper shoulder line from collar down to armpit (x ~ 395, y ~ 390 on left; x ~ 859, y ~ 390 on right)
    if (y <= 390) {
      const leftSeamX = 490 - ((y - 30) / 360) * 95; // 490 down to 395
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 764 + ((y - 30) / 360) * 95; // 764 down to 859
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 430) {
      if (x < 385) return 'sleeves';
      if (x > 869) return 'sleeves';
    }

    // Jersey bottom hem: y ~ 760 at sides, curves gently to ~ 776 at center
    const centerDist = Math.abs(x - 627) / 280;
    const hemY = 776 - Math.min(1, centerDist) * 16;
    if (y <= hemY) return 'jersey';

    // Pants / breezers:
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

    if (y <= 390) {
      const leftSeamX = 490 - ((y - 30) / 360) * 95;
      if (x < leftSeamX) return 'sleeves';
      const rightSeamX = 764 + ((y - 30) / 360) * 95;
      if (x > rightSeamX) return 'sleeves';
    } else if (y <= 430) {
      if (x < 385) return 'sleeves';
      if (x > 869) return 'sleeves';
    }

    const centerDist = Math.abs(x - 627) / 280;
    const hemY = 776 - Math.min(1, centerDist) * 16;
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

  console.log('American Football Uniform processing complete!\n');
}

processFootball().catch(console.error);
