/* global React, window, AudioCtx, SectionTitle, PLAYER_DATA, useLang */

function StatsScreen() {
  const { t } = useLang();
  const [tab, setTab] = React.useState('SKILLS');
  return (
    <section id="stats" data-screen-label="03 Stats Screen">
      <SectionTitle stage={t('stats_stage')} title={t('stats_title')} sub={t('stats_sub')} accent="var(--neon-yellow)"/>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['SKILLS', t('stats_tab_skills')], ['STATS', t('stats_tab_stats')], ['INVENTORY', t('stats_tab_inv')]].map(([k, label]) => (
          <button key={k}
            onClick={() => { 
              setTab(k); 
              AudioCtx.select(); 
              window.dispatchEvent(new CustomEvent('sidekick-tab', { detail: k }));
            }}
            onMouseEnter={() => AudioCtx.hover()}
            className="font-pixel"
            style={{
              border: 'none', padding: '10px 16px', fontSize: 10,
              background: tab === k ? 'var(--neon-yellow)' : 'var(--bg-panel)',
              color: tab === k ? 'var(--bg-void)' : 'var(--ink-dim)',
              boxShadow: tab === k
                ? `4px 4px 0 0 var(--ink-white)`
                : `inset 0 0 0 2px var(--ink-ghost)`,
              letterSpacing: '0.1em',
            }}>{label}</button>
        ))}
      </div>

      <div style={{
        background: 'var(--bg-panel)',
        border: '3px solid var(--ink-white)',
        boxShadow: `inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--neon-yellow), 6px 6px 0 0 var(--bg-void)`,
        padding: 32, minHeight: 520,
      }}>
        {tab === 'SKILLS' && <SkillsPanel/>}
        {tab === 'STATS' && <StatsPanel/>}
        {tab === 'INVENTORY' && <InventoryPanel/>}
      </div>
    </section>
  );
}

function SkillsPanel() {
  const { t, lang } = useLang();
  const m = window.Motion.motion;
  return (
    <div>
      <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-cyan)', marginBottom: 22, letterSpacing: '0.1em' }}>
        ▸ {t('stats_abilities')}
      </div>
      <div className="grid-skills">
        {PLAYER_DATA.skills.map((s, i) => (
          <m.div key={s.key}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span className="font-pixel" style={{ fontSize: 11, color: 'var(--ink-white)' }}>{t('sk_' + s.key)}</span>
                <span className="font-pixel" style={{ fontSize: 8, color: s.color, letterSpacing: '0.1em' }}>[{lang === 'es' ? s.tagEs : s.tagEn}]</span>
              </div>
              <span className="font-pixel" style={{ fontSize: 11, color: s.color }}>LV {s.lvl}</span>
            </div>
            <SkillBar value={s.lvl} color={s.color}/>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function SkillBar({ value, color }) {
  const m = window.Motion.motion;
  const segs = 20;
  const filled = Math.round((value / 100) * segs);
  return (
    <div style={{
      background: 'var(--bg-void)', border: '2px solid var(--ink-white)',
      padding: 3, display: 'flex', gap: 2, height: 22,
    }}>
      {Array.from({ length: segs }).map((_, i) => (
        <m.div key={i}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: i * 0.02 }}
          style={{
            flex: 1, background: i < filled ? color : 'var(--bg-panel-hi)',
            boxShadow: i < filled ? `0 0 6px ${color}` : 'none',
          }}/>
      ))}
    </div>
  );
}

function StatsPanel() {
  const { t } = useLang();
  const m = window.Motion.motion;
  const stats = Object.entries(PLAYER_DATA.stats);
  return (
    <div className="grid-stats">
      <div>
        <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-cyan)', marginBottom: 22, letterSpacing: '0.1em' }}>
          ▸ {t('stats_base')}
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {stats.map(([k, v], i) => (
            <m.div key={k} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ display: 'grid', gridTemplateColumns: '60px 1fr 50px', gap: 12, alignItems: 'center' }}>
              <span className="font-pixel" style={{ fontSize: 12, color: 'var(--neon-yellow)' }}>{k}</span>
              <SkillBar value={v} color="var(--neon-magenta)"/>
              <span className="font-pixel" style={{ fontSize: 11, color: 'var(--ink-white)', textAlign: 'right' }}>{v}</span>
            </m.div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-cyan)', marginBottom: 22, letterSpacing: '0.1em' }}>
          ▸ {t('stats_level')}
        </div>
        <div style={{
          background: 'var(--bg-void)', padding: 20, border: '2px solid var(--ink-ghost)',
          fontFamily: 'VT323, monospace', fontSize: 22, lineHeight: 1.5,
        }}>
          <div style={{ color: 'var(--neon-yellow)', fontSize: 48, fontFamily: 'Press Start 2P' }}>LV {PLAYER_DATA.age}</div>
          <div style={{ marginTop: 12, color: 'var(--ink-dim)' }}>{t('stats_xp')} <span style={{ color: 'var(--neon-green)' }}>184,520</span> / 200,000</div>
          <div style={{ marginTop: 4, color: 'var(--ink-dim)' }}>{t('stats_next')} <span style={{ color: 'var(--neon-cyan)' }}>15,480 XP</span></div>
          <div style={{ marginTop: 16, height: 14, background: 'var(--bg-panel)', border: '2px solid var(--ink-white)', padding: 2 }}>
            <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))' }}/>
          </div>
          <div style={{ marginTop: 20, color: 'var(--ink-dim)', fontSize: 18 }}>
            {t('stats_titles')}<br/>
            <span style={{ color: 'var(--neon-magenta)' }}>▸ {t('stats_title_1')}</span><br/>
            <span style={{ color: 'var(--neon-magenta)' }}>▸ {t('stats_title_2')}</span><br/>
            <span style={{ color: 'var(--neon-magenta)' }}>▸ {t('stats_title_3')}</span><br/>
            <span style={{ color: 'var(--neon-magenta)' }}>▸ {t('stats_title_4')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryPanel() {
  const { t } = useLang();
  const rarityColor = { common: 'var(--ink-dim)', rare: 'var(--neon-cyan)', epic: 'var(--neon-magenta)' };
  const [sel, setSel] = React.useState(0);
  const item = PLAYER_DATA.inventory[sel];

  return (
    <div className="grid-inv">
      <div>
        <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-cyan)', marginBottom: 18, letterSpacing: '0.1em' }}>
          ▸ {t('stats_equipped')}
        </div>
        <div className="grid-inv-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
          {PLAYER_DATA.inventory.map((it, i) => (
            <button key={it.id || it.k}
              onClick={() => { 
                setSel(i); 
                AudioCtx.select();
                window.dispatchEvent(new CustomEvent('sidekick-equip', { detail: it }));
                window.dispatchEvent(new CustomEvent('sidekick-lore', { detail: it.k }));
              }}
              onMouseEnter={() => AudioCtx.hover()}
              className={it.r === 'epic' ? 'epic-pulse' : ''}
              style={{
                aspectRatio: '1',
                background: sel === i ? 'var(--bg-panel-hi)' : 'var(--bg-void)',
                border: `2px solid ${sel === i ? rarityColor[it.r] : 'var(--ink-ghost)'}`,
                boxShadow: sel === i ? `0 0 15px ${rarityColor[it.r]}` : 'none',
                padding: 10,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                gap: 6, cursor: 'pointer', transition: 'all 0.2s',
              }}>
              <ItemIcon type={it.t} color={rarityColor[it.r]}/>
              <span className="font-pixel" style={{ fontSize: 7, color: rarityColor[it.r], letterSpacing: '0.05em', textAlign: 'center' }}>
                {it.k.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-pixel" style={{ fontSize: 11, color: 'var(--neon-cyan)', marginBottom: 18, letterSpacing: '0.1em' }}>
          ▸ {t('stats_detail')}
        </div>
        <div className="dialog-box" style={{ minHeight: 280, borderStyle: 'double', borderWidth: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="font-pixel" style={{ fontSize: 18, color: rarityColor[item.r], marginBottom: 4 }}>
              {item.k.toUpperCase()}
            </div>
            <div className="font-pixel" style={{ fontSize: 8, color: 'var(--neon-yellow)' }}>
              {t('stats_type')}: {item.t.toUpperCase()}
            </div>
          </div>
          
          <div className="font-pixel" style={{ fontSize: 9, color: 'var(--ink-dim)', marginBottom: 14, letterSpacing: '0.1em' }}>
            {t('stats_rarity')}: <span style={{ color: rarityColor[item.r] }}>{item.r.toUpperCase()}</span>
          </div>

          <div style={{ 
            background: 'rgba(0,0,0,0.3)', padding: 12, border: '1px solid var(--ink-ghost)', 
            marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 
          }}>
            <div className="font-pixel" style={{ fontSize: 8, color: 'var(--neon-green)', gridColumn: 'span 2', marginBottom: 4 }}>
              [ {t('stats_bonus')} ]
            </div>
            {Object.entries(item.stats || {}).map(([stat, val]) => (
              <div key={stat} className="font-pixel" style={{ fontSize: 9, color: 'var(--ink-white)' }}>
                {stat}: <span style={{ color: 'var(--neon-cyan)' }}>+{val}</span>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: 'var(--ink-white)', lineHeight: 1.3 }}>
            {t('inv_' + item.k)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ type, color }) {
  if (type === 'weapon') {
    return (
      <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges">
        <rect x="7" y="2" width="2" height="10" fill={color}/>
        <rect x="6" y="12" width="4" height="2" fill="var(--ink-white)"/>
        <rect x="7" y="14" width="2" height="2" fill={color}/>
        <rect x="5" y="11" width="6" height="1" fill="var(--ink-white)"/>
      </svg>
    );
  }
  if (type === 'armor') {
    return (
      <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges">
        <path d="M3,3 L13,3 L13,9 C13,12 8,15 8,15 C8,15 3,12 3,9 Z" fill={color} opacity="0.8"/>
        <rect x="5" y="5" width="6" height="2" fill="var(--ink-white)" opacity="0.5"/>
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <rect x="4" y="4" width="8" height="8" rx="1" fill={color} opacity="0.6"/>
      <rect x="7" y="2" width="2" height="2" fill={color}/>
      <rect x="7" y="12" width="2" height="2" fill={color}/>
      <rect x="2" y="7" width="2" height="2" fill={color}/>
      <rect x="12" y="7" width="2" height="2" fill={color}/>
      <path d="M6,6 L10,10 M10,6 L6,10" stroke="var(--ink-white)" strokeWidth="1"/>
    </svg>
  );
}

Object.assign(window, { StatsScreen });
