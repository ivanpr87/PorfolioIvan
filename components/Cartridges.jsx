/* global React, window, AudioCtx, SectionTitle, PROJECT_DATA, useLang */

function CartridgeShelf() {
  const { t } = useLang();
  return (
    <section id="projects" data-screen-label="04 Projects Shelf">
      <SectionTitle stage={t('proj_stage')} title={t('proj_title')} sub={t('proj_sub')} accent="var(--neon-magenta)"/>

      <div style={{
        overflow: 'hidden', marginBottom: 32,
        border: '2px solid var(--neon-yellow)',
        background: 'var(--bg-void)', padding: '10px 0',
      }}>
        <div className="marquee font-pixel" style={{ fontSize: 11, color: 'var(--neon-yellow)' }}>
          {`◆ ${t('proj_marquee')} ◆ `.repeat(4)}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 28,
      }}>
        {PROJECT_DATA.map((p, i) => <Cartridge key={p.id} p={p} idx={i}/>)}
      </div>
    </section>
  );
}

function Cartridge({ p, idx }) {
  const { t } = useLang();
  const m = window.Motion.motion;
  const AP = window.Motion.AnimatePresence;
  const [hover, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const colorMap = {
    magenta: 'var(--neon-magenta)', cyan: 'var(--neon-cyan)',
    yellow: 'var(--neon-yellow)', violet: 'var(--neon-violet)', green: 'var(--neon-green)',
  };
  const accent = colorMap[p.color];

  const projKeyMap = { nexus:'p_nexus', labtrack1:'p_lab1', dashboard:'p_dash', labtrack2:'p_lab2', aleman:'p_aleman', multiagent:'p_multi', centinela:'p_centinela', portfolio:'p_port' };
  const pk = projKeyMap[p.key];
  const title = t(pk + '_t'), sub = t(pk + '_s'), genre = t(pk + '_g'), desc = t(pk + '_d');
  const scenes = t(pk + '_sc') || [];

  return (
    <>
      <m.div className="cartridge" data-hover="1"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay: (idx % 4) * 0.06, duration: 0.4 }}
        whileHover={{ y: -8, rotate: [0, -0.8, 0.8, 0] }}
        onHoverStart={() => { setHover(true); AudioCtx.hover(); }}
        onHoverEnd={() => setHover(false)}
        onClick={() => { setOpen(true); AudioCtx.coin(); }}
        style={{ cursor: 'none', position: 'relative' }}>
        <CartridgeArt p={p} title={title} genre={genre} accent={accent} hover={hover} scenes={scenes}/>
        <div style={{ marginTop: 10, fontFamily: 'VT323, monospace', fontSize: 16, color: 'var(--ink-dim)', textAlign: 'center' }}>
          <span style={{ color: accent }}>▸</span> {genre} · {p.year}
        </div>
      </m.div>

      <AP>
        {open && <CartridgeModal p={p} title={title} sub={sub} genre={genre} desc={desc} accent={accent} onClose={() => setOpen(false)}/>}
      </AP>
    </>
  );
}

function CartridgeArt({ p, title, genre, accent, hover, scenes }) {
  return (
    <div style={{ aspectRatio: '3 / 4', position: 'relative', transition: 'transform 160ms steps(3)' }}>
      <svg viewBox="0 0 120 160" style={{ width: '100%', height: '100%', display: 'block' }} shapeRendering="crispEdges">
        <defs>
          <pattern id={`dots-${p.id}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="rgba(255,255,255,0.25)"/>
          </pattern>
        </defs>
        <polygon points="8,10 90,10 100,22 112,22 112,154 8,154" fill="var(--bg-panel-hi)"/>
        <polygon points="8,10 90,10 100,22 8,22" fill="var(--bg-panel)"/>
        <rect x="8" y="22" width="6" height="132" fill="var(--bg-void)"/>
        <rect x="106" y="22" width="6" height="132" fill={accent}/>
        <rect x="14" y="22" width="4" height="132" fill="rgba(255,255,255,0.08)"/>
        <rect x="8" y="22" width="104" height="132" fill={`url(#dots-${p.id})`}/>
        <rect x="30" y="14" width="40" height="2" fill="var(--bg-void)"/>
        <rect x="30" y="18" width="40" height="1" fill="var(--bg-void)"/>
        <rect x="18" y="32" width="84" height="90" fill="var(--bg-void)"/>
        <rect x="20" y="34" width="80" height="86" fill="var(--bg-panel)"/>
        <rect x="20" y="34" width="80" height="14" fill={accent}/>
        <rect x="24" y="140" width="72" height="8" fill="var(--bg-void)"/>
        {[26,30,34,38,42,80,84,88].map(x => <rect key={x} x={x} y="142" width="2" height="4" fill={accent}/>)}
      </svg>

      <div style={{
        position: 'absolute',
        left: '16.6%', right: '15%', top: '20%', bottom: '23.75%',
        display: 'flex', flexDirection: 'column', pointerEvents: 'none',
      }}>
        <div style={{
          height: '16%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Press Start 2P, monospace', fontSize: 7,
          color: 'var(--bg-void)', letterSpacing: '0.08em', padding: '0 4px', textAlign: 'center',
        }}>{genre.slice(0, 18)}</div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-void)' }}>
          {!hover ? <CartCover p={p} title={title} accent={accent}/> : <AttractMode p={p} title={title} accent={accent} scenes={scenes}/>}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '8%', left: 0, right: 0,
        textAlign: 'center', fontFamily: 'Press Start 2P, monospace',
        fontSize: 11, color: 'var(--ink-white)', letterSpacing: '0.05em',
        textShadow: `2px 2px 0 ${accent}`,
      }}>{title}</div>
    </div>
  );
}

function CartCover({ p, title, accent }) {
  const seed = p.id;
  return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, var(--bg-panel-hi), var(--bg-deep))` }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0.3) 2px)',
        pointerEvents: 'none',
      }}/>
      <svg viewBox="0 0 60 60" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }} shapeRendering="crispEdges">
        <circle cx={20 + seed * 3} cy={22} r={10} fill={accent} opacity="0.8"/>
        <circle cx={20 + seed * 3} cy={22} r={6} fill="var(--bg-void)"/>
        <rect x="0" y="36" width="60" height="24" fill="var(--bg-void)"/>
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1="0" y1={38 + i * 4} x2="60" y2={38 + i * 4} stroke={accent} strokeWidth="0.5" opacity={0.4 - i * 0.05}/>
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={i * 10} y1="36" x2={30 + (i - 3) * 20} y2="60" stroke={accent} strokeWidth="0.5" opacity="0.4"/>
        ))}
        <text x="30" y="56" textAnchor="middle" fontFamily="Press Start 2P, monospace" fontSize="5" fill="var(--ink-white)">{title.slice(0,10)}</text>
      </svg>
    </div>
  );
}

function AttractMode({ p, title, accent, scenes }) {
  const m = window.Motion.motion;
  const [scene, setScene] = React.useState(0);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const i = setInterval(() => setScene(s => (s + 1) % Math.max(scenes.length, 1)), 1400);
    const tk = setInterval(() => setTick(x => x + 1), 120);
    return () => { clearInterval(i); clearInterval(tk); };
  }, [scenes.length]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.5) 3px)',
        pointerEvents: 'none', zIndex: 3,
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 10,
        top: `${(tick * 2) % 120 - 10}%`,
        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)',
        zIndex: 4, pointerEvents: 'none',
      }}/>
      <m.div key={scene}
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{ scale: 1.15, x: scene % 2 ? -8 : 8, y: scene % 2 ? -4 : 4 }}
        transition={{ duration: 1.4, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}>
        <AttractScreenshot accent={accent} scene={scene}/>
      </m.div>
      <div className="blink" style={{
        position: 'absolute', top: 4, left: 4,
        fontFamily: 'Press Start 2P, monospace', fontSize: 5,
        color: 'var(--bg-void)', background: accent,
        padding: '2px 4px', zIndex: 5, letterSpacing: '0.1em',
      }}>ATTRACT</div>
      <m.div key={`cap-${scene}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute', bottom: 4, left: 4, right: 4,
          fontFamily: 'Press Start 2P, monospace', fontSize: 5,
          color: 'var(--ink-white)', background: 'rgba(0,0,0,0.75)',
          padding: '3px 4px', zIndex: 5, letterSpacing: '0.05em', textAlign: 'center',
        }}>{scenes[scene] || ''}</m.div>
    </div>
  );
}

function AttractScreenshot({ accent, scene }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg-deep)',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: '14%', background: 'var(--bg-panel)', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 3 }}>
        <div style={{ width: 4, height: 4, background: accent, borderRadius: '50%' }}/>
        <div style={{ flex: 1, height: 3, background: 'var(--bg-void)' }}/>
      </div>
      <div style={{ flex: 1, display: 'flex', padding: 4, gap: 4 }}>
        <div style={{ width: '22%', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          {[0,1,2,3].map(i => (<div key={i} style={{ height: 3, background: i === (scene % 4) ? accent : 'var(--bg-void)' }}/>))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ height: 4, width: '60%', background: accent }}/>
          <div style={{ height: 2, width: '80%', background: 'var(--ink-ghost)' }}/>
          <div style={{ height: 2, width: '70%', background: 'var(--ink-ghost)' }}/>
          <div style={{ flex: 1, background: 'var(--bg-panel)', position: 'relative', marginTop: 2 }}>
            {scene % 3 === 0 && (
              <svg viewBox="0 0 40 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <polyline fill="none" stroke={accent} strokeWidth="0.8" points="0,15 5,12 10,14 15,8 20,10 25,5 30,7 35,3 40,4"/>
              </svg>
            )}
            {scene % 3 === 1 && (
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 1, padding: 2 }}>
                {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: i % 2 ? accent : 'var(--neon-cyan)' }}/>
                ))}
              </div>
            )}
            {scene % 3 === 2 && (
              <div style={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[0,1,2,3].map(i => (<div key={i} style={{ height: 2, width: `${100 - i * 15}%`, background: i === 0 ? accent : 'var(--ink-ghost)' }}/>))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartridgeModal({ p, title, sub, genre, desc, accent, onClose }) {
  const { t } = useLang();
  const m = window.Motion.motion;
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        background: 'rgba(7,6,15,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
      <m.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, width: '100%' }}>
        <div style={{
          maxHeight: '85vh', overflowY: 'auto',
          background: 'var(--bg-panel)',
          border: `3px solid ${accent}`,
          boxShadow: `inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 8px 8px 0 0 var(--bg-void)`,
          padding: 28, position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="font-pixel" style={{ fontSize: 10, color: accent, letterSpacing: '0.1em' }}>
              {t('proj_cart_loaded')} :: {genre}
            </div>
            <button onClick={onClose} onMouseEnter={() => AudioCtx.hover()}
              className="font-pixel cart-modal-close" style={{ border: 'none', background: 'transparent', color: 'var(--ink-white)', fontSize: 12 }}>
              {t('proj_close')}
            </button>
          </div>
          <div className="font-pixel" style={{ fontSize: 28, color: 'var(--ink-white)', marginBottom: 8, textShadow: `3px 3px 0 ${accent}` }}>
            {title}
          </div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: 'var(--ink-dim)', marginBottom: 20 }}>
            {sub} · {p.year}
          </div>
          <div className="dialog-box" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: 'var(--ink-white)', lineHeight: 1.4 }}>
              {desc}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {p.tech.map(tc => (
              <span key={tc} className="font-pixel" style={{
                fontSize: 9, padding: '6px 10px',
                background: 'var(--bg-void)', color: accent,
                boxShadow: `inset 0 0 0 2px ${accent}`,
                letterSpacing: '0.08em',
              }}>{tc}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="pixel-btn" onMouseEnter={() => AudioCtx.hover()} onClick={() => AudioCtx.coin()}>{t('proj_view_demo')}</button>
            <button className="pixel-btn" onMouseEnter={() => AudioCtx.hover()} onClick={() => AudioCtx.select()} style={{ background: 'transparent' }}>{t('proj_case')}</button>
          </div>
          <button onClick={onClose} onMouseEnter={() => AudioCtx.hover()}
            className="font-pixel pixel-btn cart-modal-close-bottom"
            style={{ marginTop: 20, width: '100%' }}>
            ✕ {t('proj_close')}
          </button>
        </div>
      </m.div>
    </m.div>
  );
}

Object.assign(window, { CartridgeShelf });
