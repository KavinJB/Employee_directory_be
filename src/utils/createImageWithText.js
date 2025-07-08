// utils/createImageWithText.js
import sharp from 'sharp';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createWelcomeImage(passwordText) {
  const baseImage = path.join(__dirname, '../../public/welcome-template.png');
  const outputImage = path.join(__dirname, '../../temp/welcome-final.png');

  const { width, height } = await sharp(baseImage).metadata();

  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .text { fill:rgb(254, 254, 254); font-size: 24px; font-family: Arial, sans-serif; font-weight: bold; }
      </style>
      <text x="${width * 0.5}" y="${height * 0.725}" text-anchor="middle" class="text">${passwordText}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  await sharp(baseImage)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .sharpen()
    .modulate({ brightness: 1.05, contrast: 1.1 })
    .toFile(outputImage);

  return outputImage;
}
