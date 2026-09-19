/**
 * Generates sample target points (x, y normalized in [-1, 1])
 * that follow the organic circular boundary and interior botanical curves of the user's logo.
 */
export function getBotanicalLogoTargetPoints(count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];

  // 1. Outer circular constellation boundary (approx 35% of points)
  const circlePointsCount = Math.round(count * 0.35);
  for (let i = 0; i < circlePointsCount; i++) {
    // Leave a small top-right gap like in the logo
    const angle = (i / circlePointsCount) * Math.PI * 1.92 - 0.2;
    const r = 0.88 + (Math.random() - 0.5) * 0.02;
    points.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
    });
  }

  // 2. Top-center tri-leaf bloom & curves (approx 20% of points)
  const topLeafCount = Math.round(count * 0.20);
  for (let i = 0; i < topLeafCount; i++) {
    const t = i / topLeafCount;
    // central petals
    const px = -0.05 + Math.sin(t * Math.PI * 2) * 0.25 * (1 - t * 0.5);
    const py = -0.55 + Math.cos(t * Math.PI * 2) * 0.35 * (1 - t * 0.4);
    points.push({ x: px, y: py });
  }

  // 3. Lower left flower/leaf bloom cluster (approx 22% of points)
  const leftBloomCount = Math.round(count * 0.22);
  for (let i = 0; i < leftBloomCount; i++) {
    const t = i / leftBloomCount;
    const angle = t * Math.PI * 2;
    // 3 small intersecting petal lobes
    const lobeAngle = (Math.floor(t * 3) * (Math.PI * 2 / 3));
    const localR = 0.18 + Math.sin(angle * 3) * 0.08;
    const cx = -0.32;
    const cy = 0.32;
    points.push({
      x: cx + Math.cos(angle) * localR,
      y: cy + Math.sin(angle) * localR,
    });
  }

  // 4. Right side leaves and climbing stem garland (remaining points)
  const remaining = count - points.length;
  for (let i = 0; i < remaining; i++) {
    const t = i / remaining;
    // Arc along the right inner quadrant
    const angle = -Math.PI * 0.35 + t * Math.PI * 0.95;
    const r = 0.52 + Math.sin(t * Math.PI * 3) * 0.12;
    points.push({
      x: Math.cos(angle) * r + 0.05,
      y: Math.sin(angle) * r + 0.05,
    });
  }

  return points;
}

/**
 * Extracts target point positions from any user-uploaded Image element (PNG/JPG)
 * by sampling non-transparent or contrastive pixels on a virtual canvas.
 */
export function extractLogoPointsFromImage(
  img: HTMLImageElement,
  count: number
): { x: number; y: number }[] {
  const canvas = document.createElement('canvas');
  const size = 180;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return getBotanicalLogoTargetPoints(count);

  ctx.drawImage(img, 0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size).data;

  const validPixels: { x: number; y: number }[] = [];

  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const idx = (y * size + x) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const a = imgData[idx + 3];

      // Check if pixel is part of the logo stroke
      // Either non-transparent (if PNG with alpha) or darker/colored than white background
      const isColoredOrDark = (r < 225 || g < 225 || b < 225) && a > 40;
      const isNonWhite = (255 - (r + g + b) / 3) > 30 && a > 40;

      if (isColoredOrDark && isNonWhite) {
        validPixels.push({
          x: (x / size) * 2 - 1,
          y: (y / size) * 2 - 1,
        });
      }
    }
  }

  if (validPixels.length < 10) {
    return getBotanicalLogoTargetPoints(count);
  }

  // Sample uniformly from valid pixels
  const result: { x: number; y: number }[] = [];
  const step = validPixels.length / count;
  for (let i = 0; i < count; i++) {
    const pIdx = Math.floor((i * step) % validPixels.length);
    result.push(validPixels[pIdx]);
  }

  return result;
}
