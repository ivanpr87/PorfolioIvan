/* global React, window, AudioCtx, GlitchText, SectionTitle, PLAYER_DATA, useLang */

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  const { t } = useLang();
  const m = window.Motion.motion;
  const [pressed, setPressed] = React.useState(false);
  const [hi, setHi] = React.useState(12450);

  React.useEffect(() => {
    const iv = setInterval(() => setHi(h => h + Math.floor(Math.random() * 50)), 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="hero" data-screen-label="01 Title Screen" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '120px 6vw 80px', position: 'relative',
    }}>
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="hero-orb"
        style={{
          position: 'absolute', right: '8%', top: '18%',
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, var(--neon-magenta) 0%, var(--neon-violet) 50%, var(--neon-blue) 90%)',
          boxShadow: '0 0 80px rgba(255,47,182,0.4), inset -20px -20px 40px rgba(0,0,0,0.5)',
          zIndex: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: '45%', left: '-20%', width: '140%', height: '30%',
          border: '3px solid var(--neon-cyan)', borderRadius: '50%',
          transform: 'rotate(-20deg)', opacity: 0.6,
        }}/>
      </m.div>

      <svg viewBox="0 0 1000 120" preserveAspectRatio="none" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 140,
        zIndex: 0, opacity: 0.9,
      }} shapeRendering="crispEdges">
        <polygon points="0,120 80,40 140,80 220,20 320,90 400,50 500,100 600,30 720,70 820,40 920,80 1000,50 1000,120" fill="var(--bg-panel)"/>
        <polygon points="0,120 60,90 160,70 260,100 360,80 460,110 560,90 680,100 800,80 900,110 1000,95 1000,120" fill="var(--bg-panel-hi)"/>
      </svg>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 1100 }}>
        <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="font-pixel"
          style={{ fontSize: 10, color: 'var(--neon-cyan)', letterSpacing: '0.3em', marginBottom: 24 }}>
          ◆ {t('hero_tag')} ◆
        </m.div>

        <m.h1 initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }} className="font-pixel"
          style={{
            fontSize: 'clamp(42px, 9vw, 120px)', lineHeight: 0.95, margin: 0,
            letterSpacing: '0.02em', color: 'var(--ink-white)',
            textShadow: '6px 6px 0 var(--neon-magenta), 12px 12px 0 var(--neon-blue), 18px 18px 0 rgba(0,0,0,0.6)',
          }}>
          <GlitchText>IVAN</GlitchText><br/>
          <span style={{ color: 'var(--neon-yellow)' }}>BASTOS</span>
        </m.h1>

        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginTop: 32 }}>
          <div className="font-pixel" style={{ fontSize: 14, color: 'var(--neon-cyan)', letterSpacing: '0.2em' }}>
            ▸ {t('hero_role')} ◂
          </div>
          <div style={{
            fontFamily: 'VT323, monospace', fontSize: 26, color: 'var(--ink-dim)',
            marginTop: 12, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto',
          }}>
            {t('hero_sub')}
          </div>
        </m.div>

        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: 48 }}>
          {!pressed ? (
            <button className="pixel-btn blink" style={{ fontSize: 14, padding: '18px 28px' }}
              onClick={() => {
                AudioCtx.coin(); setPressed(true);
                setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 400);
              }}
              onMouseEnter={() => AudioCtx.hover()}>▶ {t('hero_press')}</button>
          ) : (
            <div className="font-pixel" style={{ fontSize: 12, color: 'var(--neon-green)' }}>
              ✓ {t('hero_loaded')}
            </div>
          )}
        </m.div>

        <div className="font-pixel" style={{
          marginTop: 64, fontSize: 10, color: 'var(--ink-dim)',
          display: 'flex', gap: 36, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <span>HI-SCORE <span style={{ color: 'var(--neon-yellow)' }}>{hi.toLocaleString()}</span></span>
          <span>STAGE <span style={{ color: 'var(--neon-magenta)' }}>01</span>/06</span>
          <span>PLAYER <span style={{ color: 'var(--neon-cyan)' }}>1UP</span></span>
        </div>
      </div>

      <m.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
        className="font-pixel">
        <div style={{ fontSize: 9, color: 'var(--ink-dim)', textAlign: 'center', letterSpacing: '0.2em' }}>
          {t('hero_scroll')}
        </div>
      </m.div>
    </section>
  );
}

/* ============================================================
   CHARACTER SELECT
   ============================================================ */
function CharacterSelect() {
  const { t } = useLang();
  const m = window.Motion.motion;
  return (
    <section id="about" data-screen-label="02 Character Select">
      <SectionTitle stage={t('char_stage')} title={t('char_title')} sub={t('char_sub')} accent="var(--neon-cyan)"/>

      <div className="grid-char">
        <m.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="pixel-border-cyan"
          style={{ background: 'var(--bg-panel)', padding: 24, position: 'relative' }}>
          <PlayerPortrait/>
          <div className="font-pixel" style={{
            marginTop: 18, fontSize: 14, color: 'var(--neon-yellow)',
            textAlign: 'center', letterSpacing: '0.08em',
          }}>
            {PLAYER_DATA.name} · LV {PLAYER_DATA.age}
          </div>
          <div className="font-pixel" style={{
            marginTop: 8, fontSize: 9, color: 'var(--neon-cyan)',
            textAlign: 'center', letterSpacing: '0.12em',
          }}>
            CLASS: {t('char_class')}
          </div>
          <div style={{
            marginTop: 16, padding: '10px 12px',
            background: 'var(--bg-void)',
            border: '2px solid var(--neon-magenta)',
            fontFamily: 'VT323, monospace', fontSize: 18,
            color: 'var(--ink-white)', textAlign: 'center',
          }}>
            ❝ {t('char_tagline')} ❞
          </div>
        </m.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <m.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="dialog-box">
            <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-yellow)', marginBottom: 14, letterSpacing: '0.1em' }}>
              ▸ {t('char_bio_label')}
            </div>
            <p style={{ fontFamily: 'VT323, monospace', fontSize: 24, lineHeight: 1.3, color: 'var(--ink-white)', margin: 0, textWrap: 'pretty', letterSpacing: '0.02em' }}>
              {t('char_bio')}
            </p>
          </m.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { k: t('char_role'),    v: t('char_role_v'),    c: 'var(--neon-magenta)' },
              { k: t('char_stack'),   v: t('char_stack_v'),   c: 'var(--neon-cyan)' },
              { k: t('char_mindset'), v: t('char_mindset_v'), c: 'var(--neon-yellow)' },
              { k: t('char_status'),  v: t('char_status_v'),  c: 'var(--neon-green)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-panel)',
                border: `2px solid ${s.c}`,
                padding: '12px 14px',
                boxShadow: `3px 3px 0 0 var(--bg-void)`,
              }}>
                <div className="font-pixel" style={{ fontSize: 8, color: s.c, letterSpacing: '0.1em' }}>{s.k}</div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 20, color: 'var(--ink-white)', marginTop: 4 }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--bg-void)',
            border: '2px dashed var(--ink-ghost)',
            padding: '16px 20px',
            fontFamily: 'VT323, monospace', fontSize: 20, color: 'var(--ink-dim)',
          }}>
            <div className="font-pixel" style={{ fontSize: 9, color: 'var(--neon-cyan)', marginBottom: 10, letterSpacing: '0.1em' }}>
              {t('char_moves')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
              <div>↑ ↑ ↓ ↓ ← → B A — <span style={{ color: 'var(--neon-yellow)' }}>{t('char_move1')}</span></div>
              <div>↓ ↘ → + PUNCH — <span style={{ color: 'var(--neon-magenta)' }}>{t('char_move2')}</span></div>
              <div>← ↙ ↓ ↘ → + KICK — <span style={{ color: 'var(--neon-cyan)' }}>{t('char_move3')}</span></div>
              <div>HOLD SELECT — <span style={{ color: 'var(--neon-green)' }}>{t('char_move4')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayerPortrait() {
  const m = window.Motion.motion;
  const [look, setLook] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      setLook({ x: dx, y: dy });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div ref={containerRef} style={{
      width: '100%', aspectRatio: '1 / 1',
      background: 'linear-gradient(180deg, #2a1f5e 0%, #0d0a1f 100%)',
      position: 'relative', overflow: 'hidden',
      border: '2px solid var(--ink-white)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--neon-magenta) 1px, transparent 1px), linear-gradient(90deg, var(--neon-magenta) 1px, transparent 1px)',
        backgroundSize: '20px 20px', opacity: 0.15,
      }}/>

      <m.div 
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(rgba(28, 242, 255, 0.1) 0%, transparent 10%, transparent 90%, rgba(28, 242, 255, 0.1) 100%)',
          zIndex: 5, pointerEvents: 'none'
        }}
      />

      <svg viewBox="0 0 32 32" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} shapeRendering="crispEdges">
        {/* HAIR - Improved Symmetrical Shape */}
        <rect x="7" y="5" width="18" height="5" fill="#1f1406"/>
        <rect x="5" y="8" width="3" height="8" fill="#1f1406"/>
        <rect x="24" y="8" width="3" height="8" fill="#1f1406"/>
        
        {/* HEAD GROUP (follows mouse slightly) */}
        <m.g animate={{ x: look.x * 0.4, y: look.y * 0.4 }}>
          {/* Face Base */}
          <rect x="8" y="9" width="16" height="10" fill="#e8b88a"/>
          <rect x="9" y="19" width="14" height="2" fill="#d49a6a"/>
          
          {/* Eyes Group (Clamped to prevent escaping the face) */}
          <m.g animate={{ x: look.x * 0.8, y: look.y * 0.8 }}>
            {/* Left Eye */}
            <rect x="11" y="12" width="3" height="2" fill="#fff"/>
            <m.rect animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 1] }}
              x="12" y="12" width="1" height="2" fill="#07060f"/>
            
            {/* Right Eye */}
            <rect x="18" y="12" width="3" height="2" fill="#fff"/>
            <m.rect animate={{ scaleY: [1, 1, 0.1, 1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 1] }}
              x="19" y="12" width="1" height="2" fill="#07060f"/>
          </m.g>

          {/* Brows */}
          <rect x="10" y="10" width="4" height="1" fill="#2a1a0a" opacity="0.6"/>
          <rect x="18" y="10" width="4" height="1" fill="#2a1a0a" opacity="0.6"/>
          
          {/* Nose & Mouth */}
          <rect x="15" y="14" width="2" height="2" fill="#d49a6a"/>
          <rect x="14" y="18" width="4" height="1" fill="#ff3860"/>
        </m.g>
        
        <rect x="13" y="21" width="6" height="2" fill="#d49a6a"/>
        <rect x="6" y="23" width="20" height="9" fill="#ff2fb6"/>
        <rect x="6" y="23" width="20" height="1" fill="#ffffff"/>
        <rect x="14" y="23" width="4" height="9" fill="#07060f"/>
        <rect x="4" y="24" width="2" height="6" fill="#8a2dff"/>
        <rect x="26" y="24" width="2" height="6" fill="#8a2dff"/>
        <rect x="15" y="23" width="2" height="4" fill="#1cf2ff"/>
        <rect x="15" y="27" width="2" height="1" fill="#ffe74c"/>
      </svg>
      
      <div style={{
        position: 'absolute', top: 10, left: 10, right: 10,
        display: 'flex', gap: 6, alignItems: 'center', zIndex: 10
      }}>
        <span className="font-pixel" style={{ fontSize: 8, color: 'var(--neon-green)' }}>HP</span>
        <div style={{ flex: 1, height: 8, background: 'var(--bg-void)', border: '1px solid var(--ink-white)', padding: 1 }}>
          <m.div 
            initial={{ width: '0%' }}
            animate={{ width: '92%' }}
            transition={{ duration: 1.5, delay: 0.5 }}
            style={{ height: '100%', background: 'var(--neon-green)' }}
          />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, CharacterSelect, PlayerPortrait });
