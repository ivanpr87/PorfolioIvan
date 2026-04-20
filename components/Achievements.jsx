/* global React, window */

const ACHIEVEMENTS_LIST = [
  { id: 'start_game',   icon: '🎮', key: 'ach_start' },
  { id: 'first_kill',   icon: '👾', key: 'ach_kill' },
  { id: 'wave_5',       icon: '🎖️', key: 'ach_wave5' },
  { id: 'boss_slayer',  icon: '⚔️', key: 'ach_boss' },
  { id: 'inv_full',     icon: '🎒', key: 'ach_inv' },
  { id: 'hi_score',     icon: '🏆', key: 'ach_hi' },
  { id: 'legendary_eq', icon: '✨', key: 'ach_legend' },
];

function AchievementSystem() {
  const [queue, setQueue] = React.useState([]);
  const [unlocked, setUnlocked] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('achievements_unlocked') || '[]'); } catch(_) { return []; }
  });

  const notify = React.useCallback((id) => {
    if (unlocked.includes(id)) return;
    const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
    if (!ach) return;

    const newUnlocked = [...unlocked, id];
    setUnlocked(newUnlocked);
    localStorage.setItem('achievements_unlocked', JSON.stringify(newUnlocked));

    setQueue(prev => [...prev, ach]);
    setTimeout(() => {
      setQueue(prev => prev.slice(1));
    }, 4500);
  }, [unlocked]);

  React.useEffect(() => {
    window.unlockAchievement = notify;
    const onUnlock = (e) => notify(e.detail);
    window.addEventListener('achievement-unlock', onUnlock);
    return () => window.removeEventListener('achievement-unlock', onUnlock);
  }, [notify]);

  return (
    <div style={{
      position: 'fixed', top: 80, right: 20, zIndex: 10000,
      display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none'
    }}>
      {queue.map((ach, i) => (
        <AchievementToast key={ach.id + i} ach={ach} />
      ))}
    </div>
  );
}

function AchievementToast({ ach }) {
  const { t } = window.useLang();
  const m = window.Motion.motion;
  return (
    <m.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      style={{
        background: 'var(--bg-panel)',
        border: '3px solid var(--neon-yellow)',
        boxShadow: 'inset 0 0 0 2px var(--bg-void), 4px 4px 0 0 var(--bg-void)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        minWidth: 240, pointerEvents: 'auto'
      }}
    >
      <div style={{ fontSize: 24 }}>{ach.icon}</div>
      <div>
        <div className="font-pixel" style={{ fontSize: 8, color: 'var(--neon-yellow)', marginBottom: 4 }}>ACHIEVEMENT UNLOCKED!</div>
        <div className="font-pixel" style={{ fontSize: 10, color: 'var(--ink-white)' }}>{t(ach.key).toUpperCase()}</div>
      </div>
    </m.div>
  );
}

Object.assign(window, { AchievementSystem });
