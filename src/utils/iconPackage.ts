/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import JSZip from 'jszip';

export const generateIconPackage = async (svgContent: string, prompt: string): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add original SVG
  zip.file('icon.svg', svgContent);
  
  // Generate different sized PNGs
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  return new Promise((resolve) => {
    img.onload = async () => {
      // Generate favicon.ico (16x16)
      canvas.width = canvas.height = 16;
      ctx.drawImage(img, 0, 0, 16, 16);
      const favicon = await new Promise<Blob>((r) => canvas.toBlob(r!, 'image/png'));
      zip.file('favicon.ico', favicon!);
      
      // Generate apple-touch-icon.png (180x180)
      canvas.width = canvas.height = 180;
      ctx.clearRect(0, 0, 180, 180);
      ctx.drawImage(img, 0, 0, 180, 180);
      const appleTouchIcon = await new Promise<Blob>((r) => canvas.toBlob(r!, 'image/png'));
      zip.file('apple-touch-icon.png', appleTouchIcon!);
      
      // Generate icon-192.png
      canvas.width = canvas.height = 192;
      ctx.clearRect(0, 0, 192, 192);
      ctx.drawImage(img, 0, 0, 192, 192);
      const icon192 = await new Promise<Blob>((r) => canvas.toBlob(r!, 'image/png'));
      zip.file('icon-192.png', icon192!);
      
      // Generate icon-512.png
      canvas.width = canvas.height = 512;
      ctx.clearRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const icon512 = await new Promise<Blob>((r) => canvas.toBlob(r!, 'image/png'));
      zip.file('icon-512.png', icon512!);
      
      // Add README with meta tags
      const readme = `Icon Package Generated from: "${prompt}"

HTML Meta Tags:
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">

Web App Manifest:
{
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`;
      
      zip.file('README.txt', readme);
      
      URL.revokeObjectURL(svgUrl);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      resolve(zipBlob);
    };
    
    img.src = svgUrl;
  });
};
