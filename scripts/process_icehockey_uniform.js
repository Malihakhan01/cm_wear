const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/icehockey-uniform');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

async function processHockey() {
  console.log('Processing Ice Hockey Uniform Mockups (Photorealistic Cut Parts)...');

  // 1. Process FRONT
  const frontImg = sharp(FRONT_SRC);
  const frontMeta = await frontImg.metadata();
  const W = frontMeta.width;  // 1254
  const H = frontMeta.height; // 1254

  const { data: frontData } = await frontImg.raw().toBuffer({ resolveWithObject: true });

  // Save clean front_base.png keeping the 100% full original photographic mockup
  await sharp(frontData, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(DIR, 'front_base.png'));
  console.log('Created front_base.png (Full original photo)');

  // Classification function for FRONT:
  // Parts: 'jersey', 'sleeves', 'pants', 'socks'
  // Coordinates in 1254x1254 space:
  function getFrontPart(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return null;

    // 1. Sleeves:
    // Upper sleeve seam connects collar (x ~ 515, y ~ 65) down to armpit (x ~ 460, y ~ 450) on left
    // and collar (x ~ 740, y ~ 65) down to armpit (x ~ 795, y ~ 450) on right
    // Below armpit (y > 450), the hanging sleeve is at x < 420 on left, and x > 830 on right, down to cuff at y ~ 560
    if (y <= 450) {
      const leftArmX = 515 - ((y - 65) / 385) * 55; // 515 down to 460
      if (x < leftArmX) return 'sleeves';
      const rightArmX = 740 + ((y - 65) / 385) * 55; // 740 down to 795
      if (x > rightArmX) return 'sleeves';
    } else if (y <= 570) {
      if (x < 458) return 'sleeves';
      if (x > 795) return 'sleeves';
    }

    // 2. Jersey:
    // Bottom hem binding of jersey: y is ~605 at flanks, curves slightly to ~610 in center (x ~ 627)
    const centerDist = Math.abs(x - 627) / 170;
    const hemY = 610 - centerDist * 8;
    if (y <= hemY) return 'jersey';

    // 3. Breezer Pants:
    // Extends down from jersey hem to bottom seam of padded thigh cuff (y ~ 852)
    if (y <= 852) {
      return 'pants';
    }

    // 4. Match Socks:
    // Everything below breezer pants cuff (y > 855)
    return 'socks';
  }

  // Helper to extract a real photographic part buffer
  async function savePart(classifyFn, partName, outFileName) {
    const partBuffer = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        if (classifyFn(x, y) === partName) {
          // Copy EXACT photographic pixels (R, G, B, A)
          partBuffer[idx] = frontData[idx];
          partBuffer[idx + 1] = frontData[idx + 1];
          partBuffer[idx + 2] = frontData[idx + 2];
          partBuffer[idx + 3] = frontData[idx + 3];
        } else {
          partBuffer[idx] = 0;
          partBuffer[idx + 1] = 0;
          partBuffer[idx + 2] = 0;
          partBuffer[idx + 3] = 0;
        }
      }
    }

    await sharp(partBuffer, { raw: { width: W, height: H, channels: 4 } })
      .png()
      .toFile(path.join(DIR, outFileName));
    console.log(`Created ${outFileName} (Real photographic cut part)`);
  }

  await savePart(getFrontPart, 'jersey', 'front_jersey.png');
  await savePart(getFrontPart, 'sleeves', 'front_sleeves.png');
  await savePart(getFrontPart, 'pants', 'front_pants.png');
  await savePart(getFrontPart, 'socks', 'front_socks.png');

  // 2. Process BACK
  const backImg = sharp(BACK_SRC);
  const backMeta = await backImg.metadata();
  const BW = backMeta.width;
  const BH = backMeta.height;

  const { data: backData } = await backImg.raw().toBuffer({ resolveWithObject: true });

  await sharp(backData, { raw: { width: BW, height: BH, channels: 4 } })
    .png()
    .toFile(path.join(DIR, 'back_base.png'));
  console.log('Created back_base.png (Full original photo)');

  function getBackPart(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return null;

    // 1. Sleeves:
    if (y <= 460) {
      const leftArmX = 505 - ((y - 65) / 395) * 55;
      if (x < leftArmX) return 'sleeves';
      const rightArmX = 750 + ((y - 65) / 395) * 55;
      if (x > rightArmX) return 'sleeves';
    } else if (y <= 585) {
      if (x < 455) return 'sleeves';
      if (x > 805) return 'sleeves';
    }

    // 2. Jersey:
    const centerDist = Math.abs(x - 627) / 170;
    const hemY = 630 - centerDist * 8;
    if (y <= hemY) return 'jersey';

    // 3. Breezer Pants:
    if (y <= 873) {
      return 'pants';
    }

    // 4. Match Socks:
    return 'socks';
  }

  async function saveBackPart(classifyFn, partName, outFileName) {
    const partBuffer = Buffer.alloc(BW * BH * 4);
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const idx = (y * BW + x) * 4;
        if (classifyFn(x, y) === partName) {
          partBuffer[idx] = backData[idx];
          partBuffer[idx + 1] = backData[idx + 1];
          partBuffer[idx + 2] = backData[idx + 2];
          partBuffer[idx + 3] = backData[idx + 3];
        } else {
          partBuffer[idx] = 0;
          partBuffer[idx + 1] = 0;
          partBuffer[idx + 2] = 0;
          partBuffer[idx + 3] = 0;
        }
      }
    }

    await sharp(partBuffer, { raw: { width: BW, height: BH, channels: 4 } })
      .png()
      .toFile(path.join(DIR, outFileName));
    console.log(`Created ${outFileName} (Real photographic cut part)`);
  }

  await saveBackPart(getBackPart, 'jersey', 'back_jersey.png');
  await saveBackPart(getBackPart, 'sleeves', 'back_sleeves.png');
  await saveBackPart(getBackPart, 'pants', 'back_pants.png');
  await saveBackPart(getBackPart, 'socks', 'back_socks.png');

  console.log('Ice Hockey Uniform processing complete!');
}

processHockey().catch(console.error);
