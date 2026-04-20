/* global React, window.Motion */
/* ============================================================
   CURSOR — retro fighter sprite w/ thruster animation on scroll
   ============================================================ */
function SpaceCursor({ variant = 'fighter' }) {
  const [boosting, setBoosting] = React.useState(false);
  const [clicking, setClicking] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const scrollTimer = React.useRef(null);
  const [trailPts, setTrailPts] = React.useState([]);

  React.useEffect(() => {
    const onMove = (e) => {
      // Hover detection
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest('button, a, [data-hover], input, textarea, .cartridge');
      setHovering(!!interactive);
      
      // Trail
      setTrailPts(prev => [{ x: e.clientX, y: e.clientY, t: Date.now() }, ...prev].slice(0, 6));
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onScroll = () => {
      setBoosting(true);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setBoosting(false), 180);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scale = clicking ? 0.85 : hovering ? 1.25 : 1;

  return (
    <>
      {/* Trail dots */}
      {trailPts.map((p, i) => (
        <div
          key={p.t + '-' + i}
          style={{
            position: 'fixed',
            left: 0, top: 0,
            transform: `translate(${p.x - 2}px, ${p.y - 2}px)`,
            width: 4, height: 4,
            background: i % 2 ? 'var(--neon-cyan)' : 'var(--neon-magenta)',
            opacity: (1 - i / 6) * 0.5,
            pointerEvents: 'none',
            zIndex: 9998,
            imageRendering: 'pixelated',
          }}
        />
      ))}

      <div
        style={{
          position: 'fixed',
          left: 0, top: 0,
          transform: `translate(calc(var(--mx) - 50%), calc(var(--my) - 50%)) scale(${scale})`,
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'transform 80ms steps(3)',
          imageRendering: 'pixelated',
        }}
      >
        <ShipSprite variant={variant} boosting={boosting} clicking={clicking} hovering={hovering} />
      </div>
    </>
  );
}

function ShipSprite({ variant, boosting, clicking, hovering }) {
  // R-Type style fighter, drawn as an SVG with blocky pixel shapes
  const size = 36;
  const flame = boosting ? 18 : 8;
  const flameColor = hovering ? 'var(--neon-yellow)' : 'var(--neon-cyan)';
  const hullA = hovering ? 'var(--neon-magenta)' : '#e8e6ff';
  const hullB = hovering ? 'var(--neon-violet)' : '#8a8ad1';
  const accent = 'var(--neon-yellow)';

  if (variant === 'arrow') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges">
        <g fill={hullA}>
          <rect x="2" y="2" width="2" height="2"/>
          <rect x="4" y="4" width="2" height="2"/>
          <rect x="6" y="6" width="2" height="2"/>
          <rect x="8" y="8" width="2" height="2"/>
          <rect x="4" y="6" width="2" height="2"/>
          <rect x="4" y="8" width="2" height="2"/>
          <rect x="4" y="10" width="2" height="2"/>
        </g>
      </svg>
    );
  }

  // Default: R-Type style side-scrolling fighter
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" shapeRendering="crispEdges">
      {/* Thruster flame - behind ship, tail to the left */}
      <g>
        <rect x={10 - flame * 0.4} y="9" width={flame * 0.4} height="2" fill={flameColor}/>
        <rect x={10 - flame * 0.25} y="8" width={flame * 0.25} height="4" fill="var(--neon-yellow)"/>
        <rect x={10 - flame * 0.15} y="9" width={flame * 0.15} height="2" fill="#fff"/>
      </g>

      {/* Hull (pointing right) */}
      <g shapeRendering="crispEdges">
        {/* Nose */}
        <rect x="16" y="9" width="2" height="2" fill={hullA}/>
        <rect x="14" y="8" width="2" height="4" fill={hullA}/>
        {/* Cockpit */}
        <rect x="12" y="7" width="2" height="6" fill={hullA}/>
        <rect x="11" y="9" width="1" height="2" fill={accent}/>
        {/* Body */}
        <rect x="10" y="8" width="2" height="4" fill={hullB}/>
        <rect x="8"  y="8" width="2" height="4" fill={hullB}/>
        {/* Wings */}
        <rect x="10" y="5" width="4" height="2" fill={hullA}/>
        <rect x="10" y="13" width="4" height="2" fill={hullA}/>
        <rect x="8"  y="4" width="2" height="2" fill={hullB}/>
        <rect x="8"  y="14" width="2" height="2" fill={hullB}/>
        {/* Tail */}
        <rect x="6"  y="9" width="2" height="2" fill={hullB}/>
      </g>

      {/* Click ring */}
      {clicking && (
        <rect x="0" y="0" width="20" height="20" fill="none" stroke={accent} strokeWidth="1"/>
      )}
    </svg>
  );
}

/* ============================================================
   AUDIO — chiptune blips via WebAudio
   ============================================================ */
const AudioCtx = {
  ctx: null,
  muted: true,
  init() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("AudioContext init failed", e);
    }
  },
  blip(freq = 880, dur = 0.05, type = 'square', vol = 0.04) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch (e) {
      console.warn("Audio blip failed", e);
    }
  },
  hover() { this.blip(660, 0.03, 'square', 0.02); },
  click() { this.blip(220, 0.08, 'square', 0.05); setTimeout(() => this.blip(440, 0.06, 'square', 0.04), 40); },
  coin()  { this.blip(988, 0.05); setTimeout(() => this.blip(1318, 0.12), 60); },
  select(){ this.blip(523, 0.04); setTimeout(() => this.blip(784, 0.05), 50); },
  bgmSource: null,
  playBgm() {
    if (this.muted || this.bgmSource) return;
    this.init();
    if (!this.ctx) return;
    try {
      const ctx = this.ctx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.2);
      g.connect(ctx.destination);
      
      const melody = [
        [523.25, 0.1], [0, 0.05], [523.25, 0.1], [0, 0.05], [659.25, 0.1], [783.99, 0.15],
        [0, 0.05], [659.25, 0.1], [783.99, 0.3], [0, 0.2]
      ];
      
      let t = ctx.currentTime + 0.05;
      melody.forEach(([f, d]) => {
        if (f > 0) {
          const o = ctx.createOscillator();
          o.type = 'square';
          o.frequency.setValueAtTime(f, t);
          o.connect(g);
          o.start(t); o.stop(t + d);
        }
        t += d;
      });
      this.bgmSource = g;
    } catch(e) {}
  },
  stopBgm() {
    if (this.bgmSource) {
      try { this.bgmSource.disconnect(); } catch(e) {}
      this.bgmSource = null;
    }
  }
};

Object.assign(window, { SpaceCursor, ShipSprite, AudioCtx });
