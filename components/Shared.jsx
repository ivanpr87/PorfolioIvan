/* global React, AudioCtx, useLang */
/* ============================================================
   GLITCH TEXT
   ============================================================ */
function GlitchText({ children, className = '', as: Tag = 'span' }) {
  const [g, setG] = React.useState(false);
  React.useEffect(() => {
    const i = setInterval(() => {
      setG(true);
      setTimeout(() => setG(false), 120 + Math.random() * 80);
    }, 2800 + Math.random() * 2500);
    return () => clearInterval(i);
  }, []);
  return (
    <Tag className={className} style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      {g && (
        <>
          <span style={{
            position: 'absolute', inset: 0, color: 'var(--neon-magenta)',
            transform: `translate(${-2 - Math.random() * 3}px, ${Math.random() * 2}px)`,
            mixBlendMode: 'screen', zIndex: 1, clipPath: 'inset(20% 0 40% 0)',
          }}>{children}</span>
          <span style={{
            position: 'absolute', inset: 0, color: 'var(--neon-cyan)',
            transform: `translate(${2 + Math.random() * 3}px, ${-Math.random() * 2}px)`,
            mixBlendMode: 'screen', zIndex: 1, clipPath: 'inset(50% 0 10% 0)',
          }}>{children}</span>
        </>
      )}
    </Tag>
  );
}

/* ============================================================
   HUD
   ============================================================ */
function HUD({ palette, setPalette, muted, setMuted, section }) {
  const { lang, setLang, t } = useLang();
  const palettes = [
    { id: 'genesis', label: 'GENESIS', color: '#ff2fb6' },
    { id: 'snes',    label: 'SNES',    color: '#ffd36e' },
    { id: 'neogeo',  label: 'NEOGEO',  color: '#00fff7' },
    { id: 'jrpg',    label: 'JRPG',    color: '#f2c94c' },
  ];
  return (
    <div translate="no" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      padding: '14px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'linear-gradient(180deg, rgba(7,6,15,0.92) 0%, rgba(7,6,15,0) 100%)',
      pointerEvents: 'none', flexWrap: 'wrap', gap: 8,
    }}>
      <div className="font-pixel" style={{
        pointerEvents: 'auto',
        fontSize: 10, color: 'var(--ink-dim)',
        display: 'flex', gap: 18, alignItems: 'center',
      }}>
        <span style={{ color: 'var(--neon-green)' }}>● 1P</span>
        <span>{t('hud_credits')} <span style={{ color: 'var(--neon-yellow)' }}>99</span></span>
        <span style={{ color: 'var(--neon-cyan)' }}>{t('hud_now')}: {section}</span>
      </div>

      {muted && (
        <window.Motion.motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => { setMuted(false); AudioCtx.muted = false; AudioCtx.coin(); }}
          onMouseEnter={() => AudioCtx.hover()}
          className="font-pixel"
          style={{
            pointerEvents: 'auto', cursor: 'none',
            fontSize: 9, color: 'var(--bg-void)', background: 'var(--neon-magenta)',
            padding: '6px 12px', boxShadow: '4px 4px 0 var(--ink-white)',
            letterSpacing: '0.1em'
          }}>
          🔊 ENABLE SOUND
        </window.Motion.motion.div>
      )}

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', pointerEvents: 'auto', flexWrap: 'wrap' }}>
        {/* LANGUAGE TOGGLE */}
        <div className="font-pixel" style={{ fontSize: 9, color: 'var(--ink-ghost)', marginRight: 4 }}>{t('hud_lang')}</div>
        {['es','en'].map(l => (
          <button key={l} onClick={() => { setLang(l); AudioCtx.select(); }}
            onMouseEnter={() => AudioCtx.hover()}
            className="font-pixel" style={{
              border:'none', padding:'6px 8px', fontSize:8,
              background: lang===l ? 'var(--neon-green)' : 'transparent',
              color: lang===l ? 'var(--bg-void)' : 'var(--neon-green)',
              boxShadow: 'inset 0 0 0 2px var(--neon-green)',
              letterSpacing: '0.08em',
            }}>{l.toUpperCase()}</button>
        ))}

        <div className="font-pixel" style={{ fontSize: 9, color: 'var(--ink-ghost)', margin: '0 4px 0 10px' }}>{t('hud_palette')}</div>
        {palettes.map(p => (
          <button
            key={p.id}
            onClick={() => { setPalette(p.id); AudioCtx.select(); }}
            onMouseEnter={() => AudioCtx.hover()}
            className="font-pixel"
            style={{
              border: 'none', padding: '6px 8px', fontSize: 8,
              background: palette === p.id ? p.color : 'transparent',
              color: palette === p.id ? 'var(--bg-void)' : p.color,
              boxShadow: `inset 0 0 0 2px ${p.color}`,
              letterSpacing: '0.08em',
            }}
          >{p.label}</button>
        ))}
        <button
          onClick={() => { setMuted(!muted); if (muted) { AudioCtx.muted = false; AudioCtx.coin(); } else { AudioCtx.muted = true; } }}
          onMouseEnter={() => AudioCtx.hover()}
          className="font-pixel"
          style={{
            border: 'none', padding: '6px 8px', fontSize: 8,
            marginLeft: 6,
            background: 'transparent',
            color: muted ? 'var(--ink-ghost)' : 'var(--neon-green)',
            boxShadow: `inset 0 0 0 2px currentColor`,
            letterSpacing: '0.08em',
          }}
        >{muted ? '♪ OFF' : '♪ ON'}</button>
      </div>
    </div>
  );
}

/* ============================================================
   CORNER BRACKETS
   ============================================================ */
function CornerBrackets() {
  const C = ({ style }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ position: 'fixed', zIndex: 400, ...style }} shapeRendering="crispEdges">
      <g fill="var(--neon-magenta)">
        <rect x="0" y="0" width="16" height="3"/>
        <rect x="0" y="0" width="3" height="16"/>
      </g>
    </svg>
  );
  return (
    <>
      <C style={{ top: 78, left: 18 }}/>
      <C style={{ top: 78, right: 18, transform: 'scaleX(-1)' }}/>
      <C style={{ bottom: 18, left: 18, transform: 'scaleY(-1)' }}/>
      <C style={{ bottom: 18, right: 18, transform: 'scale(-1,-1)' }}/>
    </>
  );
}

/* ============================================================
   SECTION TITLE
   ============================================================ */
function SectionTitle({ stage, title, sub, accent = 'var(--neon-magenta)' }) {
  const MotionDiv = (window.Motion && window.Motion.motion && window.Motion.motion.div) || 'div';
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}
    >
      <div className="font-pixel" style={{
        fontSize: 14, color: 'var(--bg-void)', background: accent,
        padding: '8px 14px', letterSpacing: '0.1em',
        boxShadow: `4px 4px 0 0 var(--ink-white)`,
      }}>
        {stage}
      </div>
      <div>
        <div className="font-pixel" style={{
          fontSize: 36, color: 'var(--ink-white)', letterSpacing: '0.04em',
          textShadow: `4px 4px 0 ${accent}, 8px 8px 0 rgba(0,0,0,0.5)`,
          lineHeight: 1,
        }}>
          <GlitchText>{title}</GlitchText>
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: 'var(--ink-dim)', marginTop: 8 }}>
          <span style={{ color: accent }}>▸</span> {sub}
        </div>
      </div>
    </MotionDiv>
  );
}

Object.assign(window, { GlitchText, HUD, CornerBrackets, SectionTitle });
