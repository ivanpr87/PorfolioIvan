/* global React, window, useLang, PlayerPortrait */

function Sidekick({ sectionId }) {
  const { t } = useLang();
  const m = window.Motion.motion;
  const [msg, setMsg] = React.useState('');
  const [displayedText, setDisplayedText] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [emotion, setEmotion] = React.useState('neutral');

  // Map section IDs to i18n keys
  const msgMap = {
    'hero':     { key: 'sk_msg_intro',    emo: 'happy' },
    'about':    { key: 'sk_msg_about',    emo: 'neutral' },
    'stats':    { key: 'sk_msg_skills',   emo: 'happy' },
    'projects': { key: 'sk_msg_projects', emo: 'neutral' },
    'game':     { key: 'sk_msg_game',     emo: 'sad' },
    'contact':  { key: 'sk_msg_contact',  emo: 'happy' },
  };

  // Change message when section changes
  React.useEffect(() => {
    const config = msgMap[sectionId];
    if (config) {
      const newText = t(config.key);
      setMsg(newText);
      setEmotion(config.emo);
      setVisible(true);
      
      // Auto-hide after some time OR keep visible? 
      // Let's keep it visible for 6 seconds per section entry.
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [sectionId, t]);

  // Typing effect
  React.useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < msg.length) {
        setDisplayedText(prev => prev + msg[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [msg]);

  return (
    <div style={{
      position: 'fixed', bottom: 30, left: 30, zIndex: 1000,
      display: 'flex', alignItems: 'flex-end', gap: 12,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
    }}>
      {/* Mini Portrait */}
      <div style={{ pointerEvents: 'auto', width: 70, height: 70 }}>
        <PlayerPortrait emotion={emotion} size="100%" floating={true} />
      </div>

      {/* Speech Bubble */}
      <m.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ 
          opacity: visible ? 1 : 0, 
          scale: visible ? 1 : 0.8,
          x: visible ? 0 : -20 
        }}
        style={{
          background: 'var(--bg-panel)',
          border: '3px solid var(--ink-white)',
          padding: '12px 16px',
          maxWidth: 240,
          position: 'relative',
          pointerEvents: visible ? 'auto' : 'none',
          boxShadow: 'inset 0 0 0 2px var(--bg-void), 4px 4px 0 0 var(--bg-void)',
        }}
      >
        <div style={{
          fontFamily: 'VT323, monospace', fontSize: 20, color: 'var(--ink-white)',
          lineHeight: 1.2, textWrap: 'pretty'
        }}>
          {displayedText}
        </div>
        
        {/* Tail */}
        <div style={{
          position: 'absolute', bottom: 12, left: -10,
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '10px solid var(--ink-white)',
        }} />
      </m.div>
    </div>
  );
}

Object.assign(window, { Sidekick });
