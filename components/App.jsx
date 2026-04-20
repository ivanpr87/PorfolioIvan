/* global React, ReactDOM, window,
   SpaceCursor, AudioCtx, HUD, CornerBrackets,
   Hero, CharacterSelect, StatsScreen, CartridgeShelf, MiniGame, HighScore, useLang */

const TWEAKS = /*EDITMODE-BEGIN*/{
  "palette": "genesis",
  "muted": true,
  "scanIntensity": 0.18,
  "cursorVariant": "fighter"
}/*EDITMODE-END*/;

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Global Error Caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#07060f', color: '#ff3860', fontFamily: 'Press Start 2P, monospace', textAlign: 'center', padding: 20
        }}>
          <div style={{ fontSize: 32, marginBottom: 20 }}>SYSTEM ERROR</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#a9a4d8' }}>THE APPLICATION HAS CRASHED.<br/>PLEASE RELOAD THE PAGE (F5).</div>
          <button onClick={() => window.location.reload()} style={{
            marginTop: 30, background: '#ff3860', color: '#07060f', border: 'none', padding: '12px 24px', cursor: 'pointer', fontFamily: 'inherit'
          }}>REBOOT SYSTEM</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { t } = useLang();
  const [palette, setPalette] = React.useState(TWEAKS.palette);
  const [muted, setMuted] = React.useState(TWEAKS.muted);
  const [scanIntensity, setScanIntensity] = React.useState(TWEAKS.scanIntensity);
  const [cursorVariant, setCursorVariant] = React.useState(TWEAKS.cursorVariant);
  const [section, setSection] = React.useState('TITLE');
  const [currentSectionId, setCurrentSectionId] = React.useState('hero');
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    document.body.dataset.palette = palette;
    document.body.style.setProperty('--scan-opacity', scanIntensity);
    AudioCtx.muted = muted;
  }, [palette, muted, scanIntensity]);

  React.useEffect(() => {
    const sections = [
      { id: 'hero',     key: 'sec_title' },
      { id: 'about',    key: 'sec_char' },
      { id: 'stats',    key: 'sec_stats' },
      { id: 'projects', key: 'sec_shelf' },
      { id: 'game',     key: 'sec_game' },
      { id: 'contact',  key: 'sec_score' },
    ];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const hit = sections.find(s => s.id === e.target.id);
          if (hit) {
            setSection(t(hit.key));
            setCurrentSectionId(hit.id);
          }
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [t]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') setEditMode(true);
      if (d.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  React.useEffect(() => {
    const handleMove = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
      document.documentElement.style.setProperty('--mnx', (e.clientX / window.innerWidth) * 2 - 1);
      document.documentElement.style.setProperty('--mny', (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const persist = (edits) => {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (_) {}
  };

  return (
    <ErrorBoundary>
      <div className="bg-grid"/>
      <div className="bg-stars"/>

      <HUD
        palette={palette}
        setPalette={(p) => { setPalette(p); persist({ palette: p }); }}
        muted={muted}
        setMuted={(m) => { setMuted(m); persist({ muted: m }); }}
        section={section}
      />
      <AchievementSystem />
      <CornerBrackets/>
      <SpaceCursor variant={cursorVariant}/>
      <Sidekick sectionId={currentSectionId}/>

      <Hero/>
      <CharacterSelect/>
      <StatsScreen/>
      <CartridgeShelf/>
      <MiniGame/>
      <HighScore/>

      <div className="crt-scanlines"/>
      <div className="crt-roll"/>
      <div className="crt-vignette"/>

      {editMode && (
        <TweaksPanel
          palette={palette}
          setPalette={(p) => { setPalette(p); persist({ palette: p }); }}
          scanIntensity={scanIntensity}
          setScanIntensity={(v) => { setScanIntensity(v); persist({ scanIntensity: v }); }}
          cursorVariant={cursorVariant}
          setCursorVariant={(v) => { setCursorVariant(v); persist({ cursorVariant: v }); }}
        />
      )}
    </ErrorBoundary>
  );
}

function TweaksPanel({ palette, setPalette, scanIntensity, setScanIntensity, cursorVariant, setCursorVariant }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 9500,
      background: 'var(--bg-panel)',
      border: '3px solid var(--neon-cyan)',
      boxShadow: `inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 6px 6px 0 0 var(--bg-void)`,
      padding: 20, width: 260,
    }}>
      <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-yellow)', marginBottom: 14, letterSpacing: '0.1em' }}>
        ▸ TWEAKS
      </div>
      <div style={{ marginBottom: 14 }}>
        <div className="font-pixel" style={{ fontSize: 8, color: 'var(--ink-dim)', marginBottom: 6 }}>PALETTE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {['genesis', 'snes', 'neogeo', 'jrpg'].map(p => (
            <button key={p} onClick={() => setPalette(p)} className="font-pixel" style={{
              border: 'none', padding: '8px 6px', fontSize: 8,
              background: palette === p ? 'var(--neon-cyan)' : 'var(--bg-void)',
              color: palette === p ? 'var(--bg-void)' : 'var(--neon-cyan)',
              boxShadow: `inset 0 0 0 2px var(--neon-cyan)`,
              letterSpacing: '0.08em',
            }}>{p.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div className="font-pixel" style={{ fontSize: 8, color: 'var(--ink-dim)', marginBottom: 6 }}>
          SCANLINES: {Math.round(scanIntensity * 100)}%
        </div>
        <input type="range" min="0" max="0.5" step="0.02" value={scanIntensity}
               onChange={(e) => setScanIntensity(parseFloat(e.target.value))}
               style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}/>
      </div>
      <div>
        <div className="font-pixel" style={{ fontSize: 8, color: 'var(--ink-dim)', marginBottom: 6 }}>CURSOR</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {['fighter', 'arrow'].map(v => (
            <button key={v} onClick={() => setCursorVariant(v)} className="font-pixel" style={{
              border: 'none', padding: '8px 6px', fontSize: 8,
              background: cursorVariant === v ? 'var(--neon-magenta)' : 'var(--bg-void)',
              color: cursorVariant === v ? 'var(--bg-void)' : 'var(--neon-magenta)',
              boxShadow: `inset 0 0 0 2px var(--neon-magenta)`,
              letterSpacing: '0.08em',
            }}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
