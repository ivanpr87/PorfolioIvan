/* global React, window, AudioCtx, SectionTitle, useLang */

/* ============================================================
   BUG INVADERS — Galaxiga-style mini-game
   ============================================================ */
function MiniGame() {
  const { t } = useLang();
  const canvasRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const [state, setState] = React.useState('idle'); // idle | ready | play | over | win
  const [score, setScore] = React.useState(0);
  const [hi, setHi] = React.useState(() => {
    try { return parseInt(localStorage.getItem('bugInvadersHi')) || 0; } catch (_) { return 0; }
  });
  const [lives, setLives] = React.useState(3);
  const [wave, setWave] = React.useState(1);

  const game = React.useRef({
    W: 480, H: 360,
    player: { x: 240, y: 320, w: 22, h: 14, cool: 0 },
    bullets: [],
    enemies: [],
    efire: [],
    particles: [],
    stars: [],
    keys: {},
    touch: null,
    dir: 1,
    step: 0,
    diveTimer: 2,
    running: false,
    t: 0,
    winTimer: null,
  });

  // Init stars once
  React.useEffect(() => {
    const g = game.current;
    g.stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * g.W, y: Math.random() * g.H,
      s: 1 + Math.floor(Math.random() * 2),
      sp: 0.3 + Math.random() * 1.2,
    }));
  }, []);

  const spawnWave = (w) => {
    const g = game.current;
    g.enemies = [];
    const cols = 8, rows = Math.min(3 + Math.floor(w / 2), 5);
    const margin = 60, gap = 38;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        g.enemies.push({
          x: margin + c * gap,
          y: 60 + r * 28,
          w: 18, h: 14,
          type: r === 0 ? 'boss' : r === 1 ? 'mid' : 'grunt',
          alive: true,
          homeX: margin + c * gap,
          homeY: 60 + r * 28,
          state: 'formation',
          divePath: null,
          diveT: 0,
        });
      }
    }
    g.dir = 1;
    g.step = 0;
    g.diveTimer = 2.5;
  };

  const start = () => {
    AudioCtx.coin();
    setScore(0); setLives(3); setWave(1);
    const g = game.current;
    g.player = { x: g.W / 2, y: 320, w: 22, h: 14, cool: 0 };
    g.bullets = []; g.efire = []; g.particles = [];
    spawnWave(1);
    setState('ready');
    setTimeout(() => { setState('play'); g.running = true; }, 800);
  };

  // Main loop
  React.useEffect(() => {
    const g = game.current;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let last = performance.now();
    let raf;

    const shoot = () => {
      if (g.player.cool > 0) return;
      g.bullets.push({ x: g.player.x, y: g.player.y - 8, w: 3, h: 8, vy: -360 });
      g.player.cool = 0.22;
      AudioCtx.blip(1200, 0.04, 'square', 0.03);
    };

    const explode = (x, y, color, n = 6) => {
      for (let i = 0; i < n; i++) {
        g.particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 160,
          vy: (Math.random() - 0.5) * 160,
          life: 0.4 + Math.random() * 0.3,
          color,
        });
      }
    };

    const update = (dt) => {
      if (!g.running) return;
      g.t += dt;

      // Stars
      g.stars.forEach(s => { s.y += s.sp * 30 * dt; if (s.y > g.H) { s.y = 0; s.x = Math.random() * g.W; } });

      // Player input
      const speed = 200;
      if (g.keys['ArrowLeft'] || g.keys['a'] || g.keys['A']) g.player.x -= speed * dt;
      if (g.keys['ArrowRight'] || g.keys['d'] || g.keys['D']) g.player.x += speed * dt;
      if (g.touch != null) g.player.x = g.touch;
      g.player.x = Math.max(14, Math.min(g.W - 14, g.player.x));
      g.player.cool = Math.max(0, g.player.cool - dt);
      if (g.keys[' ']) shoot();

      // Bullets
      g.bullets.forEach(b => b.y += b.vy * dt);
      g.bullets = g.bullets.filter(b => b.y > -10);

      // Enemy formation marching
      const alive = g.enemies.filter(e => e.alive);
      if (alive.length) {
        g.step += dt;
        const marchDist = 18 * dt * (1 + (1 - alive.length / 40));
        let hitEdge = false;
        alive.forEach(e => {
          if (e.state === 'formation') {
            e.homeX += g.dir * marchDist;
            e.x = e.homeX;
            if (e.homeX < 20 || e.homeX > g.W - 20) hitEdge = true;
          }
        });
        if (hitEdge) {
          g.dir *= -1;
          alive.forEach(e => { if (e.state === 'formation') e.homeY += 10; e.y = e.homeY; });
        }

        // Dive bomber
        g.diveTimer -= dt;
        if (g.diveTimer <= 0) {
          const candidates = alive.filter(e => e.state === 'formation');
          if (candidates.length) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            pick.state = 'dive';
            pick.diveT = 0;
            pick.diveStart = { x: pick.x, y: pick.y };
          }
          g.diveTimer = 2.2 + Math.random() * 1.5;
        }

        // Diving enemies
        alive.forEach(e => {
          if (e.state === 'dive') {
            e.diveT += dt;
            // Swoop curve
            const targetX = g.player.x + Math.sin(e.diveT * 3) * 60;
            e.x += (targetX - e.x) * dt * 2;
            e.y += 130 * dt;
            // Fire bullets
            if (Math.random() < dt * 2.5) {
              g.efire.push({ x: e.x, y: e.y + 6, w: 3, h: 6, vy: 160 });
            }
            if (e.y > g.H + 20) {
              e.state = 'formation';
              e.y = e.homeY;
              e.x = e.homeX;
            }
          } else if (e.state === 'formation' && Math.random() < dt * 0.08) {
            g.efire.push({ x: e.x, y: e.y + 6, w: 3, h: 6, vy: 140 });
          }
        });
      } else {
        // Wave cleared
        g.running = false;
        setState('win');
        setWave(w => w + 1);
        AudioCtx.coin();
        if (g.winTimer) clearTimeout(g.winTimer);
        g.winTimer = setTimeout(() => {
          spawnWave(g.enemies.length === 0 ? (wave + 1) : 1);
          setState('play');
          g.running = true;
          g.winTimer = null;
        }, 1500);
      }

      // Enemy bullets
      g.efire.forEach(b => b.y += b.vy * dt);
      g.efire = g.efire.filter(b => b.y < g.H + 10);

      // Collisions: player bullets vs enemies
      g.bullets.forEach(b => {
        g.enemies.forEach(e => {
          if (e.alive && Math.abs(b.x - e.x) < e.w / 2 && Math.abs(b.y - e.y) < e.h / 2) {
            e.alive = false;
            b.y = -100;
            const pts = e.type === 'boss' ? 300 : e.type === 'mid' ? 150 : 80;
            setScore(s => {
              const ns = s + pts;
              setHi(h => {
                if (ns > h) { try { localStorage.setItem('bugInvadersHi', ns); } catch(_) {} return ns; }
                return h;
              });
              return ns;
            });
            explode(e.x, e.y, e.type === 'boss' ? '#ff2fb6' : e.type === 'mid' ? '#ffe74c' : '#1cf2ff');
            AudioCtx.blip(200 + Math.random() * 200, 0.06, 'square', 0.03);
          }
        });
      });

      // Enemy bullets vs player
      g.efire.forEach(b => {
        if (Math.abs(b.x - g.player.x) < g.player.w / 2 && Math.abs(b.y - g.player.y) < g.player.h / 2) {
          b.y = g.H + 50;
          explode(g.player.x, g.player.y, '#ff3860', 12);
          AudioCtx.blip(120, 0.2, 'sawtooth', 0.04);
          setLives(L => {
            const nl = L - 1;
            if (nl <= 0) {
              g.running = false;
              if (g.winTimer) clearTimeout(g.winTimer);
              setState('over');
            }
            return nl;
          });
          g.player.x = g.W / 2;
        }
      });

      // Diving enemy vs player
      g.enemies.forEach(e => {
        if (e.alive && e.state === 'dive' &&
            Math.abs(e.x - g.player.x) < (e.w + g.player.w) / 2 &&
            Math.abs(e.y - g.player.y) < (e.h + g.player.h) / 2) {
          e.alive = false;
          explode(e.x, e.y, '#ff3860', 14);
          explode(g.player.x, g.player.y, '#ff3860', 12);
          AudioCtx.blip(100, 0.25, 'sawtooth', 0.05);
          setLives(L => {
            const nl = L - 1;
            if (nl <= 0) {
              g.running = false;
              if (g.winTimer) clearTimeout(g.winTimer);
              setState('over');
            }
            return nl;
          });
          g.player.x = g.W / 2;
        }
      });

      // Particles
      g.particles.forEach(p => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      });
      g.particles = g.particles.filter(p => p.life > 0);
    };

    const gameWave = () => wave;

    const draw = () => {
      ctx.fillStyle = '#07060f';
      ctx.fillRect(0, 0, g.W, g.H);
      // Grid
      ctx.strokeStyle = 'rgba(58, 107, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < g.W; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, g.H); ctx.stroke(); }
      for (let y = 0; y < g.H; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(g.W, y); ctx.stroke(); }
      // Stars
      g.stars.forEach(s => { ctx.fillStyle = s.s === 1 ? '#f2f0ff' : '#1cf2ff'; ctx.fillRect(s.x, s.y, s.s, s.s); });

      // Player
      drawPlayer(ctx, g.player.x, g.player.y);

      // Bullets
      ctx.fillStyle = '#ffe74c';
      g.bullets.forEach(b => ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h));
      ctx.fillStyle = '#ff3860';
      g.efire.forEach(b => ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h));

      // Enemies
      g.enemies.forEach(e => {
        if (!e.alive) return;
        drawBug(ctx, e.x, e.y, e.type, g.t);
      });

      // Particles
      g.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
      });
      ctx.globalAlpha = 1;

      // Scanlines overlay
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#000';
      for (let y = 0; y < g.H; y += 3) ctx.fillRect(0, y, g.W, 1);
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKeyDown = (e) => {
      g.keys[e.key] = true;
      if (e.key === ' ') e.preventDefault();
    };
    const onKeyUp = (e) => { g.keys[e.key] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Touch
    const rect = () => cvs.getBoundingClientRect();
    const onTouch = (e) => {
      const r = rect();
      const touch = e.touches ? e.touches[0] : e;
      if (!touch) return;
      const x = (touch.clientX - r.left) * (g.W / r.width);
      g.touch = x;
      if (e.type === 'touchstart' || e.type === 'mousedown') shoot();
    };
    const onLeave = () => { g.touch = null; };
    cvs.addEventListener('touchstart', onTouch, { passive: true });
    cvs.addEventListener('touchmove', onTouch, { passive: true });
    cvs.addEventListener('touchend', onLeave);
    cvs.addEventListener('mousedown', onTouch);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (g.winTimer) clearTimeout(g.winTimer);
    };
  }, []);

  return (
    <section id="game" data-screen-label="05 Mini Game" translate="no">
      <SectionTitle stage={t('game_stage')} title={t('game_title')} sub={t('game_sub')} accent="var(--neon-green)"/>

      <div ref={wrapperRef} style={{
        background: 'var(--bg-panel)',
        border: '3px solid var(--neon-green)',
        boxShadow: 'inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 6px 6px 0 0 var(--bg-void)',
        padding: 16,
        maxWidth: 600, margin: '0 auto',
      }}>
        {/* Scoreboard */}
        <div className="font-pixel" translate="no" style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 10, marginBottom: 12, letterSpacing: '0.1em', flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ color: 'var(--neon-yellow)' }}>{t('game_score')} {String(score).padStart(6, '0')}</span>
          <span style={{ color: 'var(--neon-magenta)' }}>{t('game_hi')} {String(hi).padStart(6, '0')}</span>
          <span style={{ color: 'var(--neon-cyan)' }}>{t('game_wave')} {String(wave).padStart(2, '0')}</span>
          <span style={{ color: 'var(--neon-green)' }}>{t('game_lives')} {'▲'.repeat(Math.max(lives,0))}</span>
        </div>

        <div style={{ position: 'relative', aspectRatio: '4 / 3', background: '#07060f', border: '2px solid var(--ink-white)' }}>
          <canvas ref={canvasRef} width={480} height={360} style={{
            width: '100%', height: '100%', display: 'block',
            imageRendering: 'pixelated',
          }}/>

          {/* Overlay states */}
          {(state === 'idle' || state === 'over' || state === 'ready' || state === 'win') && (
            <div key={`overlay-${state}`} style={{
              position: 'absolute', inset: 0,
              background: 'rgba(7,6,15,0.7)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 14, textAlign: 'center', padding: 20,
            }}>
              {state === 'idle' && (
                <>
                  <div className="font-pixel" style={{ fontSize: 18, color: 'var(--neon-green)', textShadow: '3px 3px 0 var(--bg-void)' }}>
                    BUG INVADERS
                  </div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: 'var(--ink-dim)', maxWidth: 320 }}>
                    {t('game_tip')}
                  </div>
                  <button className="pixel-btn blink" onClick={start} onMouseEnter={() => AudioCtx.hover()}>{t('game_start')}</button>
                </>
              )}
              {state === 'ready' && (
                <div className="font-pixel blink" style={{ fontSize: 24, color: 'var(--neon-yellow)' }}>{t('game_ready')}</div>
              )}
              {state === 'win' && (
                <div className="font-pixel" style={{ fontSize: 20, color: 'var(--neon-cyan)' }}>{t('game_win')}</div>
              )}
              {state === 'over' && (
                <>
                  <div className="font-pixel" style={{ fontSize: 22, color: 'var(--neon-red, #ff3860)', textShadow: '3px 3px 0 var(--bg-void)' }}>
                    {t('game_over')}
                  </div>
                  <div className="font-pixel" style={{ fontSize: 10, color: 'var(--ink-dim)' }}>
                    {t('game_score')} {String(score).padStart(6, '0')}
                  </div>
                  <button className="pixel-btn" onClick={start} onMouseEnter={() => AudioCtx.hover()}>{t('game_restart')}</button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="font-pixel" style={{ fontSize: 8, color: 'var(--ink-ghost)', marginTop: 10, textAlign: 'center', letterSpacing: '0.1em' }}>
          {t('game_tip')}
        </div>
      </div>
    </section>
  );
}

// Pixel-art player ship
function drawPlayer(ctx, x, y) {
  const px = Math.round(x - 11), py = Math.round(y - 7);
  const P = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(px + dx, py + dy, w, h); };
  // Body
  P(10, 0, 2, 3, '#1cf2ff');
  P(8, 2, 6, 4, '#f2f0ff');
  P(4, 5, 14, 5, '#1cf2ff');
  P(2, 8, 18, 3, '#3a6bff');
  P(9, 4, 4, 2, '#ffe74c');
  // Thruster
  P(8, 11, 2, 3, '#ffe74c');
  P(12, 11, 2, 3, '#ffe74c');
  P(9, 12, 4, 2, '#ff2fb6');
}

// Pixel-art bug enemies — small, mid, boss
function drawBug(ctx, x, y, type, t) {
  const flap = Math.floor(t * 6) % 2;
  const px = Math.round(x - 9), py = Math.round(y - 7);
  const P = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(px + dx, py + dy, w, h); };
  if (type === 'grunt') {
    // cyan moth
    P(7, 2, 4, 3, '#1cf2ff');
    P(5, 4, 8, 4, '#1cf2ff');
    P(4, 6, 10, 3, '#3a6bff');
    // wings flap
    P(flap ? 1 : 2, 5, 3, 3, '#1cf2ff');
    P(flap ? 14 : 13, 5, 3, 3, '#1cf2ff');
    P(8, 4, 2, 1, '#ffe74c'); // eyes
  } else if (type === 'mid') {
    // yellow beetle
    P(6, 2, 6, 2, '#ffe74c');
    P(4, 4, 10, 4, '#ffe74c');
    P(3, 7, 12, 2, '#c49b2a');
    P(flap ? 0 : 1, 4, 3, 3, '#ffe74c');
    P(flap ? 15 : 14, 4, 3, 3, '#ffe74c');
    P(7, 3, 1, 1, '#ff3860');
    P(10, 3, 1, 1, '#ff3860');
  } else {
    // magenta boss
    P(6, 1, 6, 2, '#ff2fb6');
    P(4, 3, 10, 5, '#ff2fb6');
    P(3, 7, 12, 3, '#8a2dff');
    P(flap ? 0 : 1, 3, 3, 4, '#ff2fb6');
    P(flap ? 15 : 14, 3, 3, 4, '#ff2fb6');
    P(6, 4, 2, 2, '#1cf2ff');
    P(10, 4, 2, 2, '#1cf2ff');
    P(8, 9, 2, 1, '#ffe74c');
  }
}

Object.assign(window, { MiniGame });
