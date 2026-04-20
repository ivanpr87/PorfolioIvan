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
  const [emotion, setEmotion] = React.useState('neutral');
  const [isMouseControl, setIsMouseControl] = React.useState(false);
 
  React.useEffect(() => {
    if (state !== 'idle' && state !== 'over') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [state]);

  const triggerEmotion = (emo, dur = 2000) => {
    setEmotion(emo);
    setTimeout(() => setEmotion('neutral'), dur);
  };
  const game = React.useRef({
    W: 480, H: 360,
    player: { x: 240, y: 320, w: 22, h: 14, cool: 0, shield: 0 },
    bullets: [], enemies: [], efire: [], particles: [], stars: [], powerups: [],
    keys: {}, touch: null, dir: 1, step: 0, diveTimer: 2, running: false, t: 0,
    powers: { double: 0, rapid: 0 },
    playerAbilities: [], abilityAlert: null, victoryT: 0
  });

  React.useEffect(() => {
    const g = game.current;
    g.stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * g.W, y: Math.random() * g.H,
      s: 1 + Math.floor(Math.random() * 2),
      sp: 0.3 + Math.random() * 1.2,
    }));
  }, []);

  const spawnWave = (w) => {
    const g = game.current; g.enemies = []; g.isBossWave = (w % 5 === 0);
    if (g.isBossWave) {
      const bossHp = 30 + (w / 5) * 40; // Balanced HP
      g.enemies.push({
        x: g.W/2, y: 80, w: 60, h: 40, type: 'mega_boss', alive: true, hp: bossHp, maxHp: bossHp,
        state: 'boss_move', dir: 1, shootTimer: 1, pattern: 0,
        model: Math.floor((w/5 - 1) % 3)
      });
    } else {
      const cols = 8, rows = Math.min(3 + Math.floor(w/2), 5);
      const margin = 60, gap = 38;
      const enemyHp = w >= 10 ? 2 : 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          g.enemies.push({
            x: margin + c*gap, y: 60 + r*28, w: 18, h: 14,
            type: r===0?'boss':r===1?'mid':'grunt', alive: true,
            hp: enemyHp, maxHp: enemyHp,
            homeX: margin + c*gap, homeY: 60 + r*28, state: 'formation', diveT: 0
          });
        }
      }
    }
    g.diveTimer = 2.5; g.dir = 1;
  };

  // Drawing functions (attached to window for Babel compatibility)
  React.useLayoutEffect(() => {
    window.drawPlayer = (ctx, x, y) => {
      const px = Math.round(x - 11), py = Math.round(y - 7);
      const P = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(px + dx, py + dy, w, h); };
      P(10, 0, 2, 3, '#1cf2ff'); P(8, 2, 6, 4, '#f2f0ff'); P(4, 5, 14, 5, '#1cf2ff');
      P(2, 8, 18, 3, '#3a6bff'); P(9, 4, 4, 2, '#ffe74c'); P(8, 11, 2, 3, '#ffe74c');
      P(12, 11, 2, 3, '#ffe74c'); P(9, 12, 4, 2, '#ff2fb6');
    };
    window.drawBug = (ctx, x, y, type, t) => {
      const flap = Math.floor(t * 6) % 2;
      const px = Math.round(x - 9), py = Math.round(y - 7);
      const P = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(px + dx, py + dy, w, h); };
      if (type === 'grunt') {
        P(7, 2, 4, 3, '#1cf2ff'); P(5, 4, 8, 4, '#1cf2ff'); P(4, 6, 10, 3, '#3a6bff');
        P(flap ? 1 : 2, 5, 3, 3, '#1cf2ff'); P(flap ? 14 : 13, 5, 3, 3, '#1cf2ff'); P(8, 4, 2, 1, '#ffe74c');
      } else if (type === 'mid') {
        P(6, 2, 6, 2, '#ffe74c'); P(4, 4, 10, 4, '#ffe74c'); P(3, 7, 12, 2, '#c49b2a');
        P(flap ? 0 : 1, 4, 3, 3, '#ffe74c'); P(flap ? 15 : 14, 4, 3, 3, '#ffe74c');
        P(7, 3, 1, 1, '#ff3860'); P(10, 3, 1, 1, '#ff3860');
      } else {
        P(6, 1, 6, 2, '#ff2fb6'); P(4, 3, 10, 5, '#ff2fb6'); P(3, 7, 12, 3, '#8a2dff');
        P(flap ? 0 : 1, 3, 3, 4, '#ff2fb6'); P(flap ? 15 : 14, 3, 3, 4, '#ff2fb6');
        P(6, 4, 2, 2, '#1cf2ff'); P(10, 4, 2, 2, '#1cf2ff'); P(8, 9, 2, 1, '#ffe74c');
      }
    };
    window.drawMegaBoss = (ctx, x, y, hp, maxHp, t, model = 0) => {
      const px = Math.round(x - 30), py = Math.round(y - 20);
      const P = (dx, dy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(px+dx, py+dy, w, h); };
      
      if (model === 0) { // Dread Queen
        const shift = Math.sin(t*8)*5;
        P(0, 10 + shift, 10, 15, '#ff2fb6'); P(50, 10 + shift, 10, 15, '#ff2fb6');
        P(10, 5, 40, 30, '#ff9500'); P(15, 0, 30, 10, '#cc7700');
        P(25, 15, 10, 10, Math.sin(t*15)>0?'#fff':'#ff3860');
        const eyeColor = Math.sin(t*12)>0?'#1cf2ff':'#07060f';
        P(18, 12, 8, 8, eyeColor); P(34, 12, 8, 8, eyeColor);
      } else if (model === 1) { // Command Ship
        const hover = Math.sin(t*4)*4;
        ctx.fillStyle = '#444'; ctx.fillRect(px, py+10+hover, 60, 15);
        ctx.fillStyle = '#666'; ctx.fillRect(px+10, py+5+hover, 40, 25);
        // Neon lights
        const neon = `hsl(${Math.round(t*100 % 360)}, 100%, 50%)`;
        for(let i=0; i<4; i++) { P(5+i*15, 15+hover, 6, 4, neon); }
        P(25, 0+hover, 10, 10, '#12a4ff'); // Dome
      } else if (model === 2) { // Ancient Prism
        ctx.save(); ctx.translate(x, y); ctx.rotate(t);
        ctx.fillStyle = '#8a2dff'; ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(25, 20); ctx.lineTo(-25, 20); ctx.fill();
        ctx.fillStyle = '#1cf2ff'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        // Floating bits
        for(let i=0; i<4; i++) {
          const fx = x + Math.cos(t*2 + i*Math.PI/2)*40;
          const fy = y + Math.sin(t*2 + i*Math.PI/2)*40;
          ctx.fillStyle = '#fff'; ctx.fillRect(fx-2, fy-2, 4, 4);
        }
      } else if (model === 3) { // Binary Hydra
        for(let i=0; i<3; i++) {
          const sx = x + Math.sin(t*5 + i*2)*20;
          const sy = y + Math.cos(t*3 + i)*10;
          ctx.fillStyle = i===1?'#ff3860':'#8a2dff'; ctx.fillRect(sx-10, sy-10, 20, 20);
          ctx.fillStyle = '#fff'; ctx.fillRect(sx-2, sy-2, 4, 4);
        }
      } else if (model === 4) { // The Monolith
        ctx.fillStyle = '#111'; ctx.fillRect(x-20, y-30, 40, 60);
        ctx.strokeStyle = '#ff2fb6'; ctx.lineWidth = (Math.sin(t*10)+1)*2; ctx.strokeRect(x-20, y-30, 40, 60);
        P(25, 20, 10, 4, '#ff3860'); // Red line
      } else { // React Overlord (Model 5)
        ctx.fillStyle = '#61dafb'; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#61dafb'; ctx.lineWidth = 2;
        for(let i=0; i<3; i++) {
          ctx.save(); ctx.translate(x, y); ctx.rotate((i * Math.PI / 3) + t*2);
          ctx.beginPath(); ctx.ellipse(0, 0, 30, 12, 0, 0, Math.PI*2); ctx.stroke();
          ctx.restore();
        }
      }
      
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x-30, y-35, 60, 4);
      ctx.fillStyle = '#ff3860'; ctx.fillRect(x-30, y-35, (hp/maxHp)*60, 4);
    };
    window.drawPowerup = (ctx, x, y, type, t) => {
      const px = Math.round(x - 8), py = Math.round(y - 8);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.arc(x, y, 10 + Math.sin(t*10)*2, 0, Math.PI*2); ctx.fill();
      if (type === 'shield') {
        ctx.fillStyle = '#ffe74c'; // Shield Icon 🛡️
        ctx.beginPath(); ctx.moveTo(x, y-6); ctx.lineTo(x+6, y-2); ctx.lineTo(x+6, y+4);
        ctx.lineTo(x, y+8); ctx.lineTo(x-6, y+4); ctx.lineTo(x-6, y-2); ctx.closePath(); ctx.fill();
      } else if (type === 'double') {
        ctx.fillStyle = '#ff9500'; // Double Cannon 🔫🔫
        ctx.fillRect(x-5, y-7, 3, 14); ctx.fillRect(x+2, y-7, 3, 14);
        ctx.fillRect(x-6, y+4, 12, 3);
      } else if (type === 'rapid') {
        ctx.fillStyle = '#1cf2ff'; // Bolt ⚡
        ctx.beginPath(); ctx.moveTo(x+2, y-8); ctx.lineTo(x-4, y+1); ctx.lineTo(x+1, y+1);
        ctx.lineTo(x-2, y+8); ctx.lineTo(x+4, y-1); ctx.lineTo(x-1, y-1); ctx.closePath(); ctx.fill();
      }
    };
  }, []);

  const start = () => {
    AudioCtx.coin(); setScore(0); setLives(3); setWave(1);
    const g = game.current; g.wave = 1;
    g.player = { x: g.W/2, y: 320, w: 22, h: 14, cool: 0, shield: 0 };
    g.bullets = []; g.efire = []; g.particles = []; g.powerups = [];
    g.powers = { double: 0, rapid: 0 }; g.playerAbilities = []; spawnWave(1);
    setState('ready'); AudioCtx.playBgm();
    window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: 'start_game' }));
    setTimeout(() => { setState('play'); g.running = true; }, 800);
  };

  const shoot = () => {
    const g = game.current; if (g.player.cool > 0) return;
    const isRapid = g.powers.rapid > 0, isDouble = g.powers.double > 0;
    
    const addB = (x, y, vx, vy, color = '#ffe74c') => g.bullets.push({ x, y, w:3, h:8, vx:vx||0, vy:vy||-360, color });

    if (isDouble) {
      addB(g.player.x-6, g.player.y-8); addB(g.player.x+6, g.player.y-8);
    } else {
      addB(g.player.x, g.player.y-8);
    }

    // Boss Abilities
    if (g.playerAbilities.includes('spread')) {
      addB(g.player.x, g.player.y-8, -100, -320, '#ff9500');
      addB(g.player.x, g.player.y-8, 100, -320, '#ff9500');
    }
    if (g.playerAbilities.includes('homing')) {
      g.bullets.push({ x: g.player.x, y: g.player.y, w:5, h:5, vx:0, vy:-200, homing: true, color: '#1cf2ff' });
    }
    if (g.playerAbilities.includes('nova')) {
      g.particles.push({ x: g.player.x, y: g.player.y, nova: true, r: 10, maxR: 80, life: 0.5, color: '#8a2dff' });
    }
    if (g.playerAbilities.includes('barrage')) {
       addB(g.player.x - 15, g.player.y, 0, -500, '#2ecc71');
       addB(g.player.x + 15, g.player.y, 0, -500, '#2ecc71');
    }
    if (g.playerAbilities.includes('drone')) {
       const ang = g.t * 4;
       const dx = Math.cos(ang)*30, dy = Math.sin(ang)*30;
       addB(g.player.x + dx, g.player.y + dy, 0, -400, '#fff');
    }
    if (g.playerAbilities.includes('atom')) {
       // Atom ability: Bullets splash on impact (handled in update)
    }

    g.player.cool = isRapid ? 0.08 : 0.22;
    AudioCtx.blip(isRapid ? 1600 : 1200, 0.04, 'square', 0.03);
  };
  React.useEffect(() => { game.current.shoot = shoot; }, []);

  React.useEffect(() => {
    const g = game.current; const cvs = canvasRef.current; if (!cvs) return;
    const ctx = cvs.getContext('2d'); ctx.imageSmoothingEnabled = false;
    let last = performance.now(); let raf;

    const explode = (x, y, color, n = 6) => {
      for (let i = 0; i < n; i++) g.particles.push({
        x, y, vx: (Math.random()-0.5)*160, vy: (Math.random()-0.5)*160,
        life: 0.4+Math.random()*0.3, color
      });
    };
    const spawnPowerup = (x, y) => {
      if (Math.random() > 0.08) return; // Reduced drop rate
      const types = ['double', 'rapid', 'shield'];
      g.powerups.push({ x, y, type: types[Math.floor(Math.random()*types.length)], vy: 80 });
    };

    const update = (dt) => {
      if (!g.running) return; g.t += dt;
      g.stars.forEach(s => { s.y += s.sp*30*dt; if (s.y > g.H) { s.y = 0; s.x = Math.random()*g.W; } });
      if (g.powers.double > 0) g.powers.double -= dt;
      if (g.powers.rapid > 0) g.powers.rapid -= dt;
      if (g.player.shield > 0) g.player.shield -= dt;

      const speed = 200;
      if (g.keys['ArrowLeft'] || g.keys['a']) g.player.x -= speed * dt;
      if (g.keys['ArrowRight'] || g.keys['d']) g.player.x += speed * dt;
      if (g.keys[' ']) g.shoot();
      if (g.touch != null) g.player.x = g.touch;
      g.player.x = Math.max(14, Math.min(g.W-14, g.player.x));
      g.player.cool = Math.max(0, g.player.cool - dt);

      g.bullets.forEach(b => {
        if (b.homing) {
          const target = g.enemies.find(e => e.alive);
          if (target) {
            const dx = target.x - b.x, dy = target.y - b.y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            b.vx += (dx/dist) * 400 * dt; b.vy += (dy/dist) * 400 * dt;
            const spd = Math.sqrt(b.vx*b.vx+b.vy*b.vy);
            if (spd > 400) { b.vx = (b.vx/spd)*400; b.vy = (b.vy/spd)*400; }
          }
        }
        b.x += (b.vx || 0) * dt; b.y += b.vy * dt;
      });
      g.bullets = g.bullets.filter(b => b.y > -10 && b.y < g.H+10 && b.x > -10 && b.x < g.W+10);
      g.efire.forEach(b => {
        b.x += (b.vx || 0) * dt;
        b.y += b.vy * dt;
      });
      g.efire = g.efire.filter(b => b.y < g.H + 50 && b.x > -50 && b.x < g.W + 50);
      g.powerups.forEach(p => { 
        p.y += p.vy * dt;
        if (Math.abs(p.x - g.player.x) < 20 && Math.abs(p.y - g.player.y) < 20) {
          p.y = 500; AudioCtx.coin();
          if (p.type === 'double') g.powers.double = 10;
          if (p.type === 'rapid') g.powers.rapid = 10;
          if (p.type === 'shield') g.player.shield = 1; // 1 hit protection
        }
      });
      g.powerups = g.powerups.filter(p => p.y < g.H + 10);

      const alive = g.enemies.filter(e => e.alive);
      if (alive.length) {
        if (g.isBossWave) {
          const b = alive[0]; b.x += b.dir * 100 * dt;
          if (b.x < 100 || b.x > g.W-100) b.dir *= -1; b.y = 80 + Math.sin(g.t*2)*20;
          b.shootTimer -= dt;
          if (b.shootTimer <= 0) {
            // Complex patterns based on wave
            const pattern = Math.floor(g.wave / 5) % 3;
            if (pattern === 0) { // Spread
              for(let i=-2; i<=2; i++) g.efire.push({ x: b.x+i*15, y: b.y+20, vy: 160 + Math.abs(i)*20 });
            } else if (pattern === 1) { // Targeted
              const ang = Math.atan2(g.player.y - b.y, g.player.x - b.x);
              g.efire.push({ x: b.x, y: b.y+10, vx: Math.cos(ang)*180, vy: Math.sin(ang)*180 });
              g.efire.push({ x: b.x-10, y: b.y+10, vx: Math.cos(ang-0.2)*180, vy: Math.sin(ang-0.2)*180 });
              g.efire.push({ x: b.x+10, y: b.y+10, vx: Math.cos(ang+0.2)*180, vy: Math.sin(ang+0.2)*180 });
            } else { // Spiral / Circle
              for(let i=0; i<8; i++) {
                const a = (i/8)*Math.PI*2 + g.t;
                g.efire.push({ x: b.x, y: b.y, vx: Math.cos(a)*140, vy: Math.sin(a)*140 });
              }
            }
            b.shootTimer = 1.0 - Math.min(0.7, g.wave * 0.02);
          }
        } else {
          g.step += dt; const marchDist = 18*dt*(1+(1-alive.length/40)); let hitEdge = false;
          alive.forEach(e => {
            if (e.state === 'formation') {
              e.homeX += g.dir * marchDist; e.x = e.homeX;
              if (e.homeX < 20 || e.homeX > g.W-20) hitEdge = true;
            }
          });
          if (hitEdge) {
            g.dir *= -1; alive.forEach(e => { if (e.state === 'formation') e.homeY += 10; e.y = e.homeY; });
          }
          g.diveTimer -= dt;
          if (g.diveTimer <= 0) {
            const cs = alive.filter(e => e.state === 'formation');
            if (cs.length) { 
              const num = (g.wave > 5 ? 2 : 1) + (g.wave > 20 ? 1 : 0); 
              for(let i=0; i<num; i++) {
                if(cs[i]) { cs[i].state = 'dive'; cs[i].diveT = 0; }
              }
            }
            g.diveTimer = 2.0 + Math.random()*1.5 - Math.min(1.2, g.wave*0.06);
          }
          alive.forEach(e => {
            if (e.state === 'dive') {
              e.diveT += dt; 
              // Scaling dive speed
              const speedFact = g.wave > 20 ? 1.5 : 1;
              e.y += 140*dt*speedFact;
              // Evasive maneuvers
              if (g.wave > 5) {
                e.x += (g.player.x - e.x)*dt*1.2;
                e.x += Math.sin(e.diveT * 6) * 120 * dt; 
                if (g.wave > 8) e.y += Math.cos(e.diveT * 8) * 40 * dt; 
              } else {
                e.x += (g.player.x - e.x)*dt*1.5;
              }
              if (Math.random() < dt*2) g.efire.push({ x: e.x, y: e.y+6, vy: 180 * speedFact });
              if (e.y > g.H+20) { e.state = 'formation'; e.y = e.homeY; e.x = e.homeX; }
            } else if (Math.random() < dt*0.08) g.efire.push({ x: e.x, y: e.y+6, vy: 140 });
          });
        }
      } else if (state === 'play') {
        // Wave cleared
        g.running = false;
        // For testing, trigger ending after wave 1. Normally use (g.wave === 30)
        if (g.wave >= 1) { 
          setState('victory'); g.victoryT = 0;
        } else {
          setState('win');
          triggerEmotion('happy', 2000);
          if (g.wave === 5) window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: 'wave_5' }));
          if (g.isBossWave) window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: 'boss_slayer' }));
          
          g.wave += 1;
          setWave(g.wave);
          AudioCtx.coin();
          
          const bns = ['double', 'rapid', 'shield'];
          const won = bns[Math.floor(Math.random() * bns.length)];
          if (won === 'shield') g.player.shield = 1; else g.powers[won] = 12;

          if (g.winTimer) clearTimeout(g.winTimer);
          g.winTimer = setTimeout(() => {
            spawnWave(g.wave);
            g.running = true;
            setState('play');
            g.winTimer = null;
          }, 1500);
        }
      }

      g.bullets.forEach(b => {
        g.enemies.forEach(e => {
          if (e.alive && Math.abs(b.x - e.x) < e.w/2 && Math.abs(b.y - e.y) < e.h/2) {
            b.y = -100;
            if (e.type === 'mega_boss') {
              e.hp -= 1; AudioCtx.blip(600,0.05,'sawtooth',0.02);
              if (e.hp <= 0) { 
                e.alive = false; setScore(s => s+2000); setLives(L => L + 1); // +1 Life for Boss Kill
                explode(e.x, e.y, '#ff9500', 30); AudioCtx.blip(100,0.4,'sawtooth',0.1);
                // GAIN ABILITY
                const abs = ['spread', 'homing', 'nova', 'barrage', 'drone', 'atom'];
                const newAb = abs[e.model];
                if (!g.playerAbilities.includes(newAb)) {
                  g.playerAbilities.push(newAb);
                  g.abilityAlert = { text: `CAPTURED: ${newAb.toUpperCase()}`, timer: 3 };
                  AudioCtx.coin(); triggerEmotion('happy', 3000);
                }
              }
            } else {
              e.hp -= 1;
              if (e.hp <= 0) {
                e.alive = false; 
                if (g.playerAbilities.includes('atom')) {
                  // Splash damage particles
                  for(let i=0; i<4; i++) {
                     const a = (i/4)*Math.PI*2;
                     g.bullets.push({ x: e.x, y: e.y, w:2, h:2, vx: Math.cos(a)*200, vy: Math.sin(a)*200, color: '#61dafb' });
                  }
                }
                setScore(s => {
                  const ns = s + (e.type==='boss'?300:e.type==='mid'?150:80);
                  if (ns >= 100) window.dispatchEvent(new CustomEvent('achievement-unlock', { detail: 'first_kill' }));
                  if (ns > hi) { setHi(ns); localStorage.setItem('bugInvadersHi', ns); }
                  return ns;
                });
                explode(e.x, e.y, e.type==='boss'?'#ff2fb6':e.type==='mid'?'#ffe74c':'#1cf2ff');
                spawnPowerup(e.x, e.y); AudioCtx.blip(300,0.06,'square',0.03);
              } else {
                AudioCtx.blip(800, 0.02, 'square', 0.02); // Armor hit hit
              }
            }
          }
        });
      });

      const hit = () => {
        if (g.player.shield > 0) {
          g.player.shield = 0; 
          AudioCtx.blip(500, 0.1, 'sine', 0.05); 
          explode(g.player.x, g.player.y, '#ffe74c', 15);
          return;
        }
        explode(g.player.x, g.player.y, '#ff3860', 12); AudioCtx.blip(120,0.20,'sawtooth',0.04);
        setLives(L => { if (L<=1) { g.running=false; setState('over'); return 0; } return L-1; });
        g.player.x = g.W/2; g.powers = { double: 0, rapid: 0 };
      };
      g.efire.forEach(b => { if (Math.abs(b.x - g.player.x) < 12 && Math.abs(b.y - g.player.y) < 12) { b.y=500; hit(); } });
      g.enemies.forEach(e => { if (e.alive && e.state === 'dive' && Math.abs(e.x - g.player.x) < 20 && Math.abs(e.y - g.player.y) < 20) { e.alive=false; hit(); } });
      g.efire = g.efire.filter(b => b.y < g.H+10);
      g.particles.forEach(p => { 
        if (p.nova) {
          p.r += 200 * dt; 
          // Damaging enemies with Nova
          g.enemies.forEach(e => {
            if (e.alive && Math.sqrt((e.x-p.x)**2 + (e.y-p.y)**2) < p.r) {
              if (e.type === 'mega_boss') e.hp -= 0.1; // Slower burn on bosses
              else { e.alive = false; setScore(s => s + 50); explode(e.x, e.y, '#8a2dff', 4); }
            }
          });
        } else {
          p.x += p.vx*dt; p.y += p.vy*dt; 
        }
        p.life -= dt; 
      }); 
      g.particles = g.particles.filter(p => p.life>0);
      if (g.abilityAlert) {
         g.abilityAlert.timer -= dt; if (g.abilityAlert.timer <= 0) g.abilityAlert = null;
      }
      if (state === 'victory') g.victoryT += dt;
    };

    const draw = () => {
      ctx.fillStyle = '#07060f'; ctx.fillRect(0,0,g.W,g.H);
      
      if (state === 'victory') {
        const vt = g.victoryT; ctx.fillStyle = '#000'; ctx.fillRect(0,0,g.W,g.H);
        
        if (vt < 2) { // PHASE 0: WARP JUMP
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
          for(let i=0; i<40; i++) {
            const x = (i * 17) % g.W, y = (g.t * 1000 + i * 23) % g.H;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 50 * vt); ctx.stroke();
          }
          drawPlayer(ctx, g.W/2, g.H - 60 - vt*20);
          ctx.font = '24px VT323'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
          ctx.fillText("WARP DRIVE ACTIVE", g.W/2, g.H/2);
        } 
        else if (vt < 6) { // PHASE 1: WORMHOLE
          const wt = vt - 2;
          ctx.save(); ctx.translate(g.W/2, g.H/2);
          ctx.rotate(wt * 0.5);
          for(let i=0; i<100; i++) {
            const a = i * 0.1 + wt * 10;
            const r = (i * 4 + wt * 200) % 400;
            ctx.fillStyle = i%3===0?'#8a2dff':i%3===1?'#1cf2ff':'#fff';
            ctx.fillRect(Math.cos(a)*r, Math.sin(a)*r, 3, 3);
          }
          ctx.restore();
          drawPlayer(ctx, g.W/2 + Math.sin(wt*5)*10, g.H/2 + Math.cos(wt*3)*5);
        }
        else { // PHASE 2: EARTH ARRIVAL
          const et = vt - 6;
          // Space Background with Parallax
          g.stars.forEach(s => { ctx.fillStyle = '#fff'; ctx.fillRect(s.x, (s.y + et*20)%g.H, 1, 1); });
          
          // Earth
          const earthSize = Math.min(300, et * 30);
          const centerX = g.W/2, centerY = g.H + 400 - Math.min(500, et*40);
          
          // Atmosphere Glow
          const grad = ctx.createRadialGradient(centerX, centerY, earthSize, centerX, centerY, earthSize + 20);
          grad.addColorStop(0, 'rgba(28, 242, 255, 0.4)'); grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(centerX, centerY, earthSize + 20, 0, Math.PI*2); ctx.fill();
          
          // Ocean
          ctx.fillStyle = '#0a4da2'; ctx.beginPath(); ctx.arc(centerX, centerY, earthSize, 0, Math.PI*2); ctx.fill();
          
          // Continents (Animated Selection)
          ctx.save(); ctx.beginPath(); ctx.arc(centerX, centerY, earthSize, 0, Math.PI*2); ctx.clip();
          ctx.fillStyle = '#2ecc71';
          const rot = et * 10; // Planetary rotation
          for(let i=-1; i<2; i++) {
            const ox = (rot + i*400) % 800 - 400;
            ctx.beginPath(); ctx.arc(centerX + ox, centerY - earthSize*0.5, earthSize*0.4, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(centerX + ox + 60, centerY - earthSize*0.2, earthSize*0.3, 0, Math.PI*2); ctx.fill();
          }
          ctx.restore();

          // Clouds
          ctx.globalAlpha = 0.4; ctx.fillStyle = '#fff';
          for(let i=-1; i<2; i++) {
            const ox = (et * 25 + i*500) % 1000 - 500;
            ctx.fillRect(centerX + ox, centerY - earthSize*0.7, 100, 10);
            ctx.fillRect(centerX + ox + 150, centerY - earthSize*0.4, 80, 8);
          }
          ctx.globalAlpha = 1.0;

          // Ship Descending
          const shipY = Math.max(50, g.H/2 - et*20);
          drawPlayer(ctx, g.W/2, shipY);
          
          if (et > 5) {
            ctx.font = 'bold 24px VT323'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
            ctx.fillText("MISSION ACCOMPLISHED", g.W/2, g.H/2 - 40);
            ctx.font = '14px VT323'; ctx.fillText("WELCOME BACK TO EARTH, HERO.", g.W/2, g.H/2 - 10);
          }
        }
        return;
      }

      g.stars.forEach(s => { ctx.fillStyle = s.s===1?'#f2f0ff':'#1cf2ff'; ctx.fillRect(s.x,s.y,s.s,s.s); });
      if (g.powers.double > 0) { ctx.fillStyle = '#ff9500'; ctx.fillRect(10, g.H-15, (g.powers.double/10)*60, 3); }
      if (g.powers.rapid > 0) { ctx.fillStyle = '#1cf2ff'; ctx.fillRect(10, g.H-10, (g.powers.rapid/10)*60, 3); }
      if (g.player.shield > 0) { ctx.strokeStyle = '#ffe74c'; ctx.beginPath(); ctx.arc(g.player.x, g.player.y, 18, 0, Math.PI*2); ctx.stroke(); }
      drawPlayer(ctx, g.player.x, g.player.y);
      ctx.fillStyle = '#ffe74c'; g.bullets.forEach(b => {
        ctx.fillStyle = b.color || '#ffe74c';
        ctx.fillRect(b.x-b.w/2, b.y-b.h/2, b.w, b.h);
      });
      ctx.fillStyle = '#ff3860'; g.efire.forEach(b => ctx.fillRect(b.x-1, b.y-3, 3, 6));
      g.enemies.forEach(e => { if (e.alive) { if(e.type==='mega_boss') drawMegaBoss(ctx, e.x, e.y, e.hp, e.maxHp, g.t, e.model); else drawBug(ctx, e.x, e.y, e.type, g.t); } });
      g.particles.forEach(p => { 
        if (p.nova) {
          ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.globalAlpha = p.life * 2;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
        } else {
          ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life); ctx.fillRect(p.x-1,p.y-1,3,3); 
        }
      });
      ctx.globalAlpha = 1;
      if (g.abilityAlert) {
        ctx.font = 'bold 16px VT323'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
        ctx.fillText(g.abilityAlert.text, g.W/2, g.H/2 + 40);
        ctx.font = '8px VT323'; ctx.fillText('BOSS POWER ACQUIRED', g.W/2, g.H/2 + 55);
      }
    };

    const loop = (n) => { const dt = Math.min(0.05, (n-last)/1000); last=n; update(dt); draw(); raf=requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const cvs_el = canvasRef.current;
    const reqPos = (e) => { const r = cvs_el.getBoundingClientRect(); const t = e.touches?e.touches[0]:e; return (t.clientX - r.left) * (g.W/r.width); };
    const onKeyDown = (e) => {
      if (state === 'idle') return;
      const gameKeys = [' ', 'ArrowLeft', 'ArrowRight', 'a', 'd', 'w', 's', 'A', 'D', 'W', 'S', 'ArrowUp', 'ArrowDown'];
      if (gameKeys.includes(e.key)) {
        e.preventDefault();
        g.keys[e.key] = true;
      }
    };
    const onKeyUp = (e) => {
      g.keys[e.key] = false;
    };
    const blockSpace = (e) => { if (e.key === ' ' && state !== 'idle') e.preventDefault(); };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keydown', blockSpace, { capture: true, passive: false });
    window.addEventListener('keyup', onKeyUp);
    const onTouch = (e) => { 
      // Prevent scrolling while touching the game
      if (e.cancelable) e.preventDefault();
      g.touch = reqPos(e); 
      if (e.type === 'touchstart') g.shoot(); 
    };
    cvs_el.addEventListener('touchstart', onTouch, { passive: false });
    cvs_el.addEventListener('touchmove', onTouch, { passive: false });
    cvs_el.addEventListener('mousedown', (e) => { setIsMouseControl(true); g.shoot(); });
    cvs_el.addEventListener('mousemove', (e) => { if (isMouseControl) g.touch = reqPos(e); });
    window.addEventListener('mouseup', () => setIsMouseControl(false));
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keydown', blockSpace, { capture: true });
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [state, isMouseControl]);

  return (
    <section id="game" data-screen-label="05 Mini Game" translate="no">
      <SectionTitle stage={t('game_stage')} title={t('game_title')} sub={t('game_sub')} accent="var(--neon-green)"/>

      <div ref={wrapperRef} style={{
        background: 'var(--bg-panel)',
        border: '3px solid var(--neon-green)',
        boxShadow: 'inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 6px 6px 0 0 var(--bg-void)',
        padding: 16,
        maxWidth: 850, margin: '0 auto',
      }}>
        {/* Scoreboard */}
        <div className="font-pixel" translate="no" style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 'clamp(7px, 2vw, 10px)', marginBottom: 12, 
          letterSpacing: '0.05em', flexWrap: 'wrap', gap: '4px 8px',
        }}>
          <span style={{ color: 'var(--neon-yellow)' }}>{t('game_score')} {String(score).padStart(6, '0')}</span>
          <span style={{ color: 'var(--neon-magenta)' }}>{t('game_hi')} {String(hi).padStart(6, '0')}</span>
          <span style={{ color: 'var(--neon-cyan)' }}>{t('game_wave')} {String(wave).padStart(2, '0')}</span>
          <span style={{ color: 'var(--neon-green)' }}>{t('game_lives')} {'▲'.repeat(Math.max(lives,0))}</span>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Sidekick Avatar */}
          {state !== 'idle' && (
            <div className="hide-mobile" style={{ width: 80, marginTop: 10 }}>
              <PlayerPortrait emotion={emotion} floating={true} size="80px" />
              <div className="font-pixel" style={{ 
                fontSize: 8, color: 'var(--ink-dim)', textAlign: 'center', 
                marginTop: 4, background: 'var(--bg-void)', padding: 4,
                border: '1px solid var(--ink-ghost)'
              }}>
                {emotion === 'happy' ? 'YEAH!' : emotion === 'sad' ? 'UGRH!' : '...'}
              </div>
            </div>
          )}

          <div style={{ flex: 1, position: 'relative', aspectRatio: '4 / 3', background: '#07060f', border: '2px solid var(--ink-white)' }}>
            <canvas ref={canvasRef} width={480} height={360} style={{
              width: '100%', height: '100%', display: 'block',
              imageRendering: 'pixelated',
            }}/>

            {/* Performance-friendly Scanline Overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
              backgroundSize: '100% 3px, 3px 100%', zIndex: 5
            }}/>

          {/* Mobile Fire Button */}
          {state === 'play' && (
            <div 
              onTouchStart={(e) => { e.preventDefault(); shoot(); }}
              onMouseDown={(e) => { e.preventDefault(); shoot(); }}
              onClick={(e) => { e.preventDefault(); shoot(); }}
              className="fire-btn-mobile"
              style={{
                position: 'absolute', bottom: 15, right: 15,
                width: 52, height: 52, borderRadius: '50%',
                border: '3px solid rgba(255, 56, 96, 0.7)',
                background: 'rgba(255, 56, 96, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink-white)', fontFamily: 'VT323, monospace',
                fontSize: 12, fontWeight: 'bold', pointerEvents: 'auto',
                userSelect: 'none', zIndex: 100,
                boxShadow: '0 0 10px rgba(255, 56, 96, 0.4)',
                transition: 'all 0.1s'
              }}
            >
              SHOT
            </div>
          )}

          {/* Overlay states */}
          {(state === 'idle' || state === 'over' || state === 'ready' || state === 'win') && (
            <div key={`overlay-${state}`} style={{
              position: 'absolute', inset: 0,
              background: 'rgba(7,6,15,0.85)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 'clamp(8px, 3.5%, 16px)', textAlign: 'center', padding: '10px 20px',
            }}>
              {state === 'idle' && (
                <>
                  <div className="font-pixel" style={{ 
                    fontSize: 'clamp(14px, 5vw, 18px)', color: 'var(--neon-green)', 
                    textShadow: '3px 3px 0 var(--bg-void)' 
                  }}>
                    BUG INVADERS
                  </div>
                  <div style={{ 
                    fontFamily: 'VT323, monospace', fontSize: 'clamp(14px, 3.5vw, 18px)', 
                    color: 'var(--ink-dim)', maxWidth: 300, lineHeight: 1.1 
                  }}>
                    {t('game_tip')}
                  </div>
                  <button className="pixel-btn blink" onClick={() => { game.current.autoplay = false; start(); }} 
                    onMouseEnter={() => AudioCtx.hover()} style={{ padding: '12px 24px', fontSize: 14 }}>
                    {t('game_start')}
                  </button>

                  <div style={{ padding: '1px', background: 'var(--neon-cyan)', marginTop: 8 }}>
                    <button className="font-pixel" onClick={() => { game.current.autoplay = true; start(); }} 
                      onMouseEnter={() => AudioCtx.hover()}
                      style={{ 
                        border: 'none', background: 'var(--bg-void)', color: 'var(--neon-cyan)', 
                        fontSize: 'clamp(8px, 1.8vw, 10px)', cursor: 'none', padding: '6px 10px', letterSpacing: '0.05em'
                      }}>
                      [ ACTIVAR PILOTO IA ]
                    </button>
                  </div>
                  <div style={{ fontSize: 'clamp(7px, 1.5vw, 9px)', color: 'var(--ink-ghost)', marginTop: 4, maxWidth: 240 }}>
                    * El sistema jugará solo. Recuperas el control moviéndote.
                  </div>
                </>
              )}
              {state === 'ready' && (
                <div className="font-pixel blink" style={{ fontSize: 24, color: 'var(--neon-yellow)' }}>{t('game_ready')}</div>
              )}
              {state === 'play' && game.current.autoplay && (
                 <div className="font-pixel blink" style={{ 
                   position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                   fontSize: 9, color: 'var(--neon-magenta)', background: 'var(--bg-void)',
                   padding: '4px 8px', border: '1px solid var(--neon-magenta)', zIndex: 10
                 }}>
                   ● AUTOPILOT ENABLED
                 </div>
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
      </div>

      <div className="font-pixel" style={{ fontSize: 8, color: 'var(--ink-ghost)', marginTop: 10, textAlign: 'center', letterSpacing: '0.1em' }}>
          {t('game_tip')}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MiniGame });
