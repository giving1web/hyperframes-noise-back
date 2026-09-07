(() => {
  const root = document.querySelector('.hf-noise-back');
  const canvas = root?.querySelector('.hf-noise-back__canvas');
  if (!root || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Small internal buffer, scaled up by CSS for low CPU/GPU cost.
  const W = 300;
  const H = 180;
  canvas.width = W;
  canvas.height = H;

  // Deterministic PRNG: stable visual character across loads.
  let seed = 0x6d2b79f5;
  const rand = () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const image = ctx.createImageData(W, H);
  const data = image.data;
  let frame = 0;
  let raf = 0;
  let last = 0;
  const fps = reduceMotion ? 4 : 18;
  const interval = 1000 / fps;

  function draw(now) {
    raf = requestAnimationFrame(draw);
    if (now - last < interval) return;
    last = now;
    frame++;

    // Warm monochrome grain, kept translucent for text readability.
    for (let i = 0; i < data.length; i += 4) {
      const n = rand();
      const speck = n > 0.985 ? 1 : 0;
      const v = 132 + Math.floor(n * 92) + speck * 28;
      data[i] = Math.min(245, v + 4);
      data[i + 1] = Math.min(240, v);
      data[i + 2] = Math.min(230, v - 8);
      data[i + 3] = Math.floor(22 + n * 78 + speck * 72);
    }

    // Sparse short dust streaks.
    for (let s = 0; s < 18; s++) {
      const x = Math.floor(rand() * W);
      const y = Math.floor(rand() * H);
      const len = 4 + Math.floor(rand() * 22);
      for (let dx = 0; dx < len && x + dx < W; dx++) {
        const p = ((y * W + (x + dx)) * 4);
        const fade = 1 - dx / len;
        data[p] = 232;
        data[p + 1] = 225;
        data[p + 2] = 210;
        data[p + 3] = Math.max(data[p + 3], Math.floor(65 * fade));
      }
    }

    ctx.putImageData(image, 0, 0);

    // Gentle drift. Canvas pixels do the flicker; transform creates sand-like flow.
    const x = Math.sin(frame * 0.055) * 7;
    const y = Math.cos(frame * 0.031) * 2;
    canvas.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
  }

  raf = requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      last = 0;
      raf = requestAnimationFrame(draw);
    }
  });
})();
