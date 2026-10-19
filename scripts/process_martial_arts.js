const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../public/martial-arts');
const FRONT_SRC = path.join(DIR, 'front.png');
const BACK_SRC = path.join(DIR, 'back.png');

// Helper: point in polygon
function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

async function processMartialArts() {
  console.log('Processing Martial Arts Uniform Mockups (Photorealistic Cut Parts)...');

  // 1. Process FRONT
  const frontImg = sharp(FRONT_SRC);
  const frontMeta = await frontImg.metadata();
  const W = frontMeta.width;  // 1254
  const H = frontMeta.height; // 1254

  const { data: frontData } = await frontImg.raw().toBuffer({ resolveWithObject: true });

  // Save 100% original full photo as front_base.png
  await sharp(frontData, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(path.join(DIR, 'front_base.png'));
  console.log('Created front_base.png (Full original photo)');

  // Belt strap polygons in original 1254x1254 coordinates:
  // Strap 1 (outer left strap):
  const strap1 = [
    [472, 440],
    [530, 435],
    [504, 625],
    [450, 620]
  ];

  // Strap 2 (middle left strap, hanging down from knot):
  const strap2 = [
    [572, 445],
    [628, 445],
    [565, 610],
    [544, 700],
    [490, 692],
    [518, 600]
  ];

  // Strap 3 (right strap, hanging down from knot):
  const strap3 = [
    [642, 445],
    [698, 445],
    [735, 580],
    [762, 700],
    [712, 708],
    [678, 580]
  ];

  function isMABeltFront(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return false;

    // Sleeves boundary
    if (x < 445 && y < 520) return false;
    if (x > 805 && y < 520) return false;

    // 1. Horizontal waist belt wrap:
    if (y >= 368 && y <= 445 && x >= 450 && x <= 805) {
      return true;
    }

    // 2. Center knot:
    if (y >= 390 && y <= 480 && x >= 580 && x <= 680) {
      return true;
    }

    // 3. Hanging belt straps:
    if (pointInPoly(x, y, strap1)) return true;
    if (pointInPoly(x, y, strap2)) return true;
    if (pointInPoly(x, y, strap3)) return true;

    return false;
  }

  function isMASleeveFront(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return false;

    // Left sleeve (viewer's left):
    const leftArmholeX = 415 + ((y - 160) / 330) * 30; // 415 to 445
    if (y <= 490 && x < leftArmholeX) return true;
    if (y > 490 && y <= 550 && x < 445) return true;

    // Right sleeve (viewer's right):
    const rightArmholeX = 840 - ((y - 160) / 330) * 31; // 840 to 809
    if (y <= 490 && x > rightArmholeX) return true;
    if (y > 490 && y <= 550 && x > 809) return true;

    return false;
  }

  function isMAJacketFront(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return false;
    if (isMABeltFront(x, y) || isMASleeveFront(x, y)) return false;

    // Jacket hem line runs horizontally at y = 655
    return y <= 655;
  }

  function isMAPantsFront(x, y) {
    const idx = (y * W + x) * 4;
    if (frontData[idx + 3] < 20) return false;
    if (isMABeltFront(x, y) || isMASleeveFront(x, y) || isMAJacketFront(x, y)) return false;
    return y > 655;
  }

  async function saveMAPart(testFn, outFileName) {
    const partBuffer = Buffer.alloc(W * H * 4);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        if (testFn(x, y)) {
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

  await saveMAPart(isMAJacketFront, 'front_jacket.png');
  await saveMAPart(isMASleeveFront, 'front_sleeves.png');
  await saveMAPart(isMABeltFront, 'front_belt.png');
  await saveMAPart(isMAPantsFront, 'front_pants.png');

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

  function isMABeltBack(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return false;
    if (x < 450 || x > 805) return false;
    // Horizontal belt on back
    return y >= 368 && y <= 432;
  }

  function isMASleeveBack(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return false;
    const leftArmholeX = 415 + ((y - 160) / 330) * 30;
    if (y <= 490 && x < leftArmholeX) return true;
    if (y > 490 && y <= 550 && x < 445) return true;

    const rightArmholeX = 840 - ((y - 160) / 330) * 31;
    if (y <= 490 && x > rightArmholeX) return true;
    if (y > 490 && y <= 550 && x > 809) return true;

    return false;
  }

  function isMAJacketBack(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return false;
    if (isMABeltBack(x, y) || isMASleeveBack(x, y)) return false;
    // Bottom hem of jacket on back: y = 635
    return y <= 635;
  }

  function isMAPantsBack(x, y) {
    const idx = (y * BW + x) * 4;
    if (backData[idx + 3] < 20) return false;
    if (isMABeltBack(x, y) || isMASleeveBack(x, y) || isMAJacketBack(x, y)) return false;
    return y > 635;
  }

  async function saveMABackPart(testFn, outFileName) {
    const partBuffer = Buffer.alloc(BW * BH * 4);
    for (let y = 0; y < BH; y++) {
      for (let x = 0; x < BW; x++) {
        const idx = (y * BW + x) * 4;
        if (testFn(x, y)) {
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

  await saveMABackPart(isMAJacketBack, 'back_jacket.png');
  await saveMABackPart(isMASleeveBack, 'back_sleeves.png');
  await saveMABackPart(isMABeltBack, 'back_belt.png');
  await saveMABackPart(isMAPantsBack, 'back_pants.png');

  console.log('Martial Arts Uniform processing complete!');
}

processMartialArts().catch(console.error);
