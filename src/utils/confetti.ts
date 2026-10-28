import confetti from 'canvas-confetti';

export function fireWinnerCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
    zIndex: 9999,
    colors: ['#E1306C', '#FD1D1D', '#FCB045', '#833AB4', '#405DE6', '#FFDF00', '#FFFFFF']
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Left and right synchronized cannon fire
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // Secondary celebratory stars burst after 300ms
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#E1306C', '#FCB045', '#833AB4']
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FD1D1D', '#FCB045', '#405DE6']
    });
  }, 250);
}
