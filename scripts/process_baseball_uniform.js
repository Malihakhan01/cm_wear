const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processUniform() {
  const dir = path.resolve(__dirname, '../public/baseball-uniform');

  console.log('Loading 1.jpeg (front)...');
  const frontRaw = await sharp(path.join(dir, '1.jpeg')).raw().toBuffer({ resolveWithObject: true });
  const w = frontRaw.info.width;
  const h = frontRaw.info.height;

  console.log('Loading 2.jpeg (back)...');
  const backRaw = await sharp(path.join(dir, '2.jpeg')).raw().toBuffer({ resolveWithObject: true });

  // Helper to test if a pixel is background (white studio backdrop)
  function isBackground(data, idx) {
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    return r >= 249 && g >= 249 && b >= 249;
  }

  // Helper to test if pixel is dark piping/trim (black/dark gray stripe)
  function isDarkPiping(data, idx) {
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    // Dark trim on this uniform is very dark charcoal/black (r,g,b < 90)
    return r < 90 && g < 90 && b < 90;
  }

  // --- 1. FRONT SEGMENTATION ---
  // Create buffers for each layer:
  // Base (all garment), Jersey (torso), Sleeves, Trim, Pants, Belt
  const fBase = Buffer.alloc(w * h * 4);
  const fJersey = Buffer.alloc(w * h * 4);
  const fSleeves = Buffer.alloc(w * h * 4);
  const fTrim = Buffer.alloc(w * h * 4);
  const fPants = Buffer.alloc(w * h * 4);
  const fBelt = Buffer.alloc(w * h * 4);

  const fData = frontRaw.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const oIdx = (y * w + x) * 4;

      if (isBackground(fData, idx)) {
        continue; // transparent in all
      }

      const r = fData[idx], g = fData[idx + 1], b = fData[idx + 2];

      // Copy to full base
      fBase[oIdx] = r;
      fBase[oIdx + 1] = g;
      fBase[oIdx + 2] = b;
      fBase[oIdx + 3] = 255;

      const isPiping = isDarkPiping(fData, idx);

      // Belt region: between y=685 and y=730 in center
      const inBeltY = y >= 685 && y <= 730 && x >= 420 && x <= 835;

      // Pants region: below belt (y >= 730)
      const inPantsY = y > 730;

      // Jersey & Sleeves are above y=685
      const inUpperY = y <= 685;

      // Determine if pixel is sleeve or torso:
      // Left armhole seam line connects roughly from (365, 120) to (375, 450)
      // Right armhole seam line connects roughly from (885, 120) to (875, 450)
      // Left sleeve is x < 375 && y < 450
      // Right sleeve is x > 875 && y < 450
      const isLeftSleeve = x < 378 && y <= 450;
      const isRightSleeve = x > 872 && y <= 450;

      if (isPiping) {
        // Dark piping / buttons / cuffs
        fTrim[oIdx] = r;
        fTrim[oIdx + 1] = g;
        fTrim[oIdx + 2] = b;
        fTrim[oIdx + 3] = 255;
      } else if (inBeltY) {
        // Belt & loops
        fBelt[oIdx] = r;
        fBelt[oIdx + 1] = g;
        fBelt[oIdx + 2] = b;
        fBelt[oIdx + 3] = 255;
      } else if (inPantsY) {
        // Pants legs
        fPants[oIdx] = r;
        fPants[oIdx + 1] = g;
        fPants[oIdx + 2] = b;
        fPants[oIdx + 3] = 255;
      } else if (isLeftSleeve || isRightSleeve) {
        // Sleeves
        fSleeves[oIdx] = r;
        fSleeves[oIdx + 1] = g;
        fSleeves[oIdx + 2] = b;
        fSleeves[oIdx + 3] = 255;
      } else {
        // Jersey Torso
        fJersey[oIdx] = r;
        fJersey[oIdx + 1] = g;
        fJersey[oIdx + 2] = b;
        fJersey[oIdx + 3] = 255;
      }
    }
  }

  // --- 2. BACK SEGMENTATION ---
  const bBase = Buffer.alloc(w * h * 4);
  const bJersey = Buffer.alloc(w * h * 4);
  const bSleeves = Buffer.alloc(w * h * 4);
  const bTrim = Buffer.alloc(w * h * 4);
  const bPants = Buffer.alloc(w * h * 4);
  const bBelt = Buffer.alloc(w * h * 4);

  const bData = backRaw.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const oIdx = (y * w + x) * 4;

      if (isBackground(bData, idx)) {
        continue;
      }

      const r = bData[idx], g = bData[idx + 1], b = bData[idx + 2];

      bBase[oIdx] = r;
      bBase[oIdx + 1] = g;
      bBase[oIdx + 2] = b;
      bBase[oIdx + 3] = 255;

      const isPiping = isDarkPiping(bData, idx);
      const inBeltY = y >= 685 && y <= 730 && x >= 420 && x <= 835;
      const inPantsY = y > 730;

      const isLeftSleeve = x < 378 && y <= 450;
      const isRightSleeve = x > 872 && y <= 450;

      if (isPiping) {
        bTrim[oIdx] = r;
        bTrim[oIdx + 1] = g;
        bTrim[oIdx + 2] = b;
        bTrim[oIdx + 3] = 255;
      } else if (inBeltY) {
        bBelt[oIdx] = r;
        bBelt[oIdx + 1] = g;
        bBelt[oIdx + 2] = b;
        bBelt[oIdx + 3] = 255;
      } else if (inPantsY) {
        bPants[oIdx] = r;
        bPants[oIdx + 1] = g;
        bPants[oIdx + 2] = b;
        bPants[oIdx + 3] = 255;
      } else if (isLeftSleeve || isRightSleeve) {
        bSleeves[oIdx] = r;
        bSleeves[oIdx + 1] = g;
        bSleeves[oIdx + 2] = b;
        bSleeves[oIdx + 3] = 255;
      } else {
        bJersey[oIdx] = r;
        bJersey[oIdx + 1] = g;
        bJersey[oIdx + 2] = b;
        bJersey[oIdx + 3] = 255;
      }
    }
  }

  // Save all processed files
  async function savePNG(buffer, filename) {
    await sharp(buffer, { raw: { width: w, height: h, channels: 4 } })
      .png({ compressionLevel: 8 })
      .toFile(path.join(dir, filename));
    console.log(`Saved: ${filename}`);
  }

  await savePNG(fBase, 'front_base.png');
  await savePNG(fJersey, 'front_jersey.png');
  await savePNG(fSleeves, 'front_sleeves.png');
  await savePNG(fTrim, 'front_trim.png');
  await savePNG(fPants, 'front_pants.png');
  await savePNG(fBelt, 'front_belt.png');

  await savePNG(bBase, 'back_base.png');
  await savePNG(bJersey, 'back_jersey.png');
  await savePNG(bSleeves, 'back_sleeves.png');
  await savePNG(bTrim, 'back_trim.png');
  await savePNG(bPants, 'back_pants.png');
  await savePNG(bBelt, 'back_belt.png');

  console.log('All baseball uniform parts generated successfully!');
}

processUniform().catch(console.error);
