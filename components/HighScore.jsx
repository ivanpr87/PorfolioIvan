/* global React, window, AudioCtx, SectionTitle, PLAYER_DATA, useLang */

function HighScore() {
  const { t } = useLang();
  const m = window.Motion.motion;
  const [initials, setInitials] = React.useState(['I', 'V', 'N']);
  const [sel, setSel] = React.useState(0);
  const [msg, setMsg] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (loading || sent) return;
    AudioCtx.coin();
    setLoading(true);

    const formData = {
      initials: initials.join(''),
      email: email, // Formspree uses this for Reply-To
      message: msg,
      _subject: `Arcadia High Score from ${initials.join('')}`,
    };

    try {
      const response = await fetch('https://formspree.io/f/ivanbastos18@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSent(true);
      } else {
        console.error("Formspree error:", response);
        setSent(true);
      }
    } catch (e) {
      console.error("Submission failed", e);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_.!';
  const cycleLetter = (dir) => {
    const next = [...initials];
    const cur = letters.indexOf(next[sel]);
    const n = (cur + dir + letters.length) % letters.length;
    next[sel] = letters[n];
    setInitials(next);
    AudioCtx.blip(440 + sel * 60, 0.03);
  };

  const scores = [
    { rank: 1, init: 'IVN', score: '9,999,999', label: t('lb_1') },
    { rank: 2, init: 'AI_', score: '1,240,480', label: t('lb_2') },
    { rank: 3, init: 'N8N', score: '  840,200', label: t('lb_3') },
    { rank: 4, init: 'NXT', score: '  610,900', label: t('lb_4') },
    { rank: 5, init: 'SQL', score: '  420,780', label: t('lb_5') },
  ];

  return (
    <section id="contact" data-screen-label="06 High Score">
      <SectionTitle stage={t('score_stage')} title={t('score_title')} sub={t('score_sub')} accent="var(--neon-green)"/>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        <div style={{
          background: 'var(--bg-panel)',
          border: '3px solid var(--neon-yellow)',
          boxShadow: `inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 6px 6px 0 0 var(--bg-void)`,
          padding: 24,
        }}>
          <div className="font-pixel" style={{ fontSize: 12, color: 'var(--neon-yellow)', marginBottom: 18, letterSpacing: '0.1em', textAlign: 'center' }}>
            {t('score_hi')}
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {scores.map((s, i) => (
              <m.div key={s.rank}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  display: 'grid', gridTemplateColumns: '24px 50px 1fr auto', gap: 10, alignItems: 'center',
                  padding: '8px 10px',
                  background: i === 0 ? 'rgba(255,231,76,0.1)' : 'transparent',
                  border: i === 0 ? '2px dashed var(--neon-yellow)' : '2px dashed transparent',
                }}>
                <span className="font-pixel" style={{ fontSize: 11, color: i === 0 ? 'var(--neon-yellow)' : 'var(--ink-dim)' }}>{s.rank}.</span>
                <span className="font-pixel" style={{ fontSize: 12, color: 'var(--neon-magenta)', letterSpacing: '0.1em' }}>{s.init}</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: 'var(--ink-white)' }}>{s.label}</span>
                <span className="font-pixel" style={{ fontSize: 10, color: 'var(--neon-cyan)' }}>{s.score}</span>
              </m.div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'grid', gap: 8 }}>
            {[
              { k: t('contact_email'),    v: PLAYER_DATA.email,                  c: 'var(--neon-magenta)', href: `mailto:${PLAYER_DATA.email}` },
              { k: t('contact_linkedin'), v: PLAYER_DATA.linkedin,               c: 'var(--neon-cyan)',    href: `https://linkedin.com/${PLAYER_DATA.linkedin}` },
              { k: t('contact_location'), v: `${PLAYER_DATA.location} · ${PLAYER_DATA.timezone}`, c: 'var(--neon-yellow)', href: '#' },
            ].map(c => (
              <a key={c.k} href={c.href} target="_blank" data-hover="1"
                onMouseEnter={() => AudioCtx.hover()}
                onClick={() => AudioCtx.coin()}
                style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 10, alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--bg-void)',
                  border: `2px solid ${c.c}`,
                  fontFamily: 'VT323, monospace', fontSize: 19,
                  color: 'var(--ink-white)', textDecoration: 'none',
                }}>
                <span className="font-pixel" style={{ fontSize: 9, color: c.c, letterSpacing: '0.1em' }}>{c.k}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.v}</span>
                <span className="font-pixel" style={{ fontSize: 9, color: c.c }}>▶</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-panel)',
          border: '3px solid var(--neon-green)',
          boxShadow: `inset 0 0 0 2px var(--bg-void), inset 0 0 0 4px var(--ink-white), 6px 6px 0 0 var(--bg-void)`,
          padding: 24,
        }}>
          <div className="font-pixel" style={{ fontSize: 12, color: 'var(--neon-green)', marginBottom: 18, letterSpacing: '0.1em', textAlign: 'center' }}>
            {t('score_new')}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            {initials.map((l, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <button onMouseEnter={() => AudioCtx.hover()}
                  onClick={() => { if (sel === i) cycleLetter(1); else { setSel(i); AudioCtx.select(); } }}
                  className="font-pixel"
                  style={{
                    width: 64, height: 72, fontSize: 32,
                    background: sel === i ? 'var(--neon-green)' : 'var(--bg-void)',
                    color: sel === i ? 'var(--bg-void)' : 'var(--neon-green)',
                    border: 'none',
                    boxShadow: sel === i
                      ? `inset 0 0 0 2px var(--ink-white), 4px 4px 0 0 var(--ink-white)`
                      : `inset 0 0 0 2px var(--neon-green)`,
                  }}>{l}</button>
                {sel === i && (
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
                    <button className="font-pixel" onClick={() => cycleLetter(-1)} style={{ border: 'none', background: 'var(--bg-void)', color: 'var(--neon-cyan)', padding: '4px 8px', fontSize: 10 }}>▲</button>
                    <button className="font-pixel" onClick={() => cycleLetter(1)} style={{ border: 'none', background: 'var(--bg-void)', color: 'var(--neon-cyan)', padding: '4px 8px', fontSize: 10 }}>▼</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t('score_email_ph')} data-hover="1"
            style={{
              width: '100%', background: 'var(--bg-void)',
              border: '2px solid var(--neon-cyan)',
              color: 'var(--ink-white)', padding: '8px 12px',
              fontFamily: 'VT323, monospace', fontSize: 20,
              outline: 'none', marginBottom: 12,
            }}/>

          <textarea value={msg} onChange={(e) => setMsg(e.target.value)}
            placeholder={t('score_msg_ph')} rows={5} data-hover="1"
            style={{
              width: '100%', background: 'var(--bg-void)',
              border: '2px solid var(--neon-cyan)',
              color: 'var(--ink-white)', padding: 12,
              fontFamily: 'VT323, monospace', fontSize: 20,
              resize: 'none', outline: 'none',
            }}/>

          <button className="pixel-btn"
            onClick={handleSubmit}
            onMouseEnter={() => AudioCtx.hover()}
            style={{
              marginTop: 16, width: '100%',
              background: sent ? 'var(--neon-green)' : (loading ? 'var(--bg-panel-hi)' : 'var(--neon-magenta)'),
              color: 'var(--bg-void)',
            }}>
            {sent ? t('score_sent') : (loading ? t('score_sending') : t('score_submit'))}
          </button>

          {sent && (
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-pixel"
              style={{ marginTop: 12, fontSize: 9, color: 'var(--neon-green)', textAlign: 'center', letterSpacing: '0.1em' }}>
              {t('score_sent_sub')}
            </m.div>
          )}
        </div>
      </div>

      <div style={{
        marginTop: 60, textAlign: 'center',
        fontFamily: 'VT323, monospace', fontSize: 18, color: 'var(--ink-ghost)',
      }}>
        <div className="font-pixel" style={{ fontSize: 9, color: 'var(--neon-magenta)', letterSpacing: '0.2em', marginBottom: 10 }}>
          ◆ {t('score_foot')} ◆
        </div>
        <div>{t('score_foot_sub')}</div>
      </div>
    </section>
  );
}

Object.assign(window, { HighScore });
