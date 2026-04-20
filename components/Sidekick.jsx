/* global React, window, useLang, PlayerPortrait */

function Sidekick({ sectionId }) {
  const { t } = useLang();
  const m = window.Motion.motion;
  const [displayedText, setDisplayedText] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [emotion, setEmotion] = React.useState('neutral');
  
  const timerRef = React.useRef(null);
  const typeRef = React.useRef(null);
  const lastMsgRef = React.useRef("");

  const msgMap = {
    'hero':     { key: 'sk_msg_intro',    emo: 'happy' },
    'about':    { key: 'sk_msg_about',    emo: 'neutral' },
    'stats':    { key: 'sk_msg_skills',   emo: 'happy' },
    'projects': { key: 'sk_msg_projects', emo: 'neutral' },
    'game':     { key: 'sk_msg_game',     emo: 'sad' },
    'contact':  { key: 'sk_msg_contact',  emo: 'happy' },
  };

  const startTyping = (text) => {
    if (typeRef.current) clearInterval(typeRef.current);
    if (!text) return;
    
    setDisplayedText('');
    let i = 0;
    typeRef.current = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typeRef.current);
      }
    }, 35);
  };

  const showMsg = (text, emo, duration = 6000) => {
    if (!text || text === lastMsgRef.current) return;
    lastMsgRef.current = text;

    if (timerRef.current) clearTimeout(timerRef.current);
    setEmotion(emo);
    setVisible(true);
    startTyping(text);
    
    timerRef.current = setTimeout(() => {
      setVisible(false);
      lastMsgRef.current = ""; // Reset to allow repeating same msg later if needed
    }, duration);
  };

  // Change message when section changes
  React.useEffect(() => {
    const config = msgMap[sectionId];
    if (config) {
      showMsg(t(config.key), config.emo);
    }
  }, [sectionId, t]);

  // Click reactions
  React.useEffect(() => {
    let lastClick = 0;
    const onClick = (e) => {
      // Ignore if clicked on a button or interactive element that has its own logic
      if (e.target.closest('button') || e.target.closest('a')) return;
      
      const now = Date.now();
      if (now - lastClick < 4000) return;
      lastClick = now;

      const rand = Math.floor(Math.random() * 5) + 1;
      showMsg(t(`sk_click_${rand}`), 'happy', 4000);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [t]);

  // Inventory & Tab reactions
  React.useEffect(() => {
    const onEquip = (e) => {
      const item = e.detail || {};
      const name = item.k || '???';
      const type = item.t || 'gen';
      const typeMsg = t(`sk_eq_${type}`);
      const genMsg = t('sk_eq_gen').replace('{item}', name);
      showMsg(`${genMsg} ${typeMsg}`, 'happy', 5000);
    };
    const onTab = (e) => {
      if (!e.detail) return;
      showMsg(t(`sk_tab_${e.detail.toLowerCase()}`), 'neutral', 5000);
    };
    const onLore = (e) => {
      if (!e.detail) return;
      showMsg(t(`sk_lore_${e.detail}`), 'happy', 6000);
    };

    window.addEventListener('sidekick-equip', onEquip);
    window.addEventListener('sidekick-tab', onTab);
    window.addEventListener('sidekick-lore', onLore);
    return () => {
      window.removeEventListener('sidekick-equip', onEquip);
      window.removeEventListener('sidekick-tab', onTab);
      window.removeEventListener('sidekick-lore', onLore);
    };
  }, [t]);

  return (
    <div style={{
      position: 'fixed', bottom: 30, left: 30, zIndex: 5000,
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
