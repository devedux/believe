// BookingFlow — Reservar clases (Estudiante)
// Lógica real Believe Academy:
// • Ventana viernes 9-12 / 14-18 → reserva para semana siguiente
// • Estudiante ve solo slots de SU nivel + idioma
// • Profe es rotativo (no se muestra en card de slot — vive en detalle)
// • 4 clases/semana, 7 cupos por slot
// • Estados: closed-future, open-am, lunch, open-pm, closed-locked

const { useState: bf_useState, useEffect: bf_useEffect, useMemo: bf_useMemo } = React;
const D = window.BELIEVE_DATA;

const HOURS = ['08:30','09:30','10:30','11:30','15:00','16:00','17:00'];
const DAYS  = [
  { key: 'lun', label: 'Lun', date: 4,  monthLabel: 'may' },
  { key: 'mar', label: 'Mar', date: 5,  monthLabel: 'may' },
  { key: 'mie', label: 'Mié', date: 6,  monthLabel: 'may' },
  { key: 'jue', label: 'Jue', date: 7,  monthLabel: 'may' },
  { key: 'vie', label: 'Vie', date: 8,  monthLabel: 'may' },
  { key: 'sab', label: 'Sáb', date: 9,  monthLabel: 'may' },
];

function BookingFlow() {
  // Demo: control del estado de ventana via toggle en la UI
  const [windowState, setWindowState] = bf_useState(() => D.getWindowState());

  // Genera grilla y filtra a nivel + idioma del alumno
  const fullWeek = bf_useMemo(() => D.makeWeek(1), []);
  const myLevelSlots = bf_useMemo(() => {
    const me = D.STUDENT;
    const out = {};
    Object.values(fullWeek).forEach(s => {
      if (s.lang === me.language && s.level === me.level) {
        out[`${s.day}-${s.time}`] = s;
      }
    });
    return out;
  }, [fullWeek]);

  const [existing, setExisting] = bf_useState(['lun-08:30']); // matches key in myLevelSlots (day-time)
  const [picked, setPicked] = bf_useState([]);
  const [hovered, setHovered] = bf_useState(null);
  const [detailFor, setDetailFor] = bf_useState(null);
  const [confirmState, setConfirmState] = bf_useState(null); // null | 'success'

  const handleConfirm = () => {
    setExisting(prev => [...prev, ...picked]);
    setPicked([]);
    setConfirmState('success');
    setTimeout(() => setConfirmState(null), 3500);
  };

  const MAX = D.RULES.classesPerWeek;
  const totalSelected = existing.length + picked.length;
  const remaining = MAX - totalSelected;

  const isEditable = windowState === 'open-am' || windowState === 'open-pm';

  const togglePick = (id) => {
    if (!isEditable) return;
    if (existing.includes(id)) return;
    if (picked.includes(id)) {
      setPicked(picked.filter(p => p !== id));
    } else if (totalSelected < MAX) {
      const slot = myLevelSlots[id];
      if (!slot || slot.taken >= slot.cap) return;
      setPicked([...picked, id]);
    }
  };

  const slotStatus = (id) => {
    const s = myLevelSlots[id];
    if (!s) return 'none';
    if (existing.includes(id)) return 'existing';
    if (picked.includes(id)) return 'picked';
    if (s.taken >= s.cap) return 'full';
    return 'free';
  };

  const slotColors = {
    none:     { bg: 'transparent', border: '1px dashed transparent', cursor: 'default', fg: 'var(--fg-4)' },
    existing: { bg: 'var(--indigo-500)', border: '1px solid var(--indigo-500)', cursor: 'pointer', fg: 'white' },
    picked:   { bg: 'var(--cyan-500)', border: '1px solid var(--cyan-500)', cursor: 'pointer', fg: 'white' },
    full:     { bg: 'var(--neutral-100)', border: '1px solid var(--border-1)', cursor: 'not-allowed', fg: 'var(--fg-4)' },
    free:     { bg: 'white', border: '1px solid var(--cyan-200)', cursor: 'pointer', fg: 'var(--cyan-700)' },
  };

  const me = D.STUDENT;
  const myLevel = D.levelOf(me.level);
  const myLang  = D.langOf(me.language);

  return (
    <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

      {/* ========= MAIN ========= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Estado de ventana — banner contextual */}
        <WindowBanner state={windowState} setState={setWindowState}/>

        {/* Header card: contexto del alumno */}
        <div style={{
          background: 'white', border: '1px solid var(--border-1)', borderRadius: 12,
          padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          <div>
            <Eyebrow>Semana 4 – 9 may · Tu nivel</Eyebrow>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>
                {myLang.flag} {myLang.name} · {myLevel.name}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button style={chevBtn}>‹</button>
            <button style={chevBtn}>›</button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--fg-3)', padding: '0 4px', flexWrap: 'wrap' }}>
          <Legend dot="white" border="var(--cyan-200)" label="Disponible"/>
          <Legend dot="var(--cyan-500)" label="Tu selección"/>
          <Legend dot="var(--indigo-500)" label="Ya reservada"/>
          <Legend dot="var(--neutral-100)" border="var(--border-1)" label="Lleno"/>
        </div>

        {/* Grid */}
        <div style={{
          background: 'white', border: '1px solid var(--border-1)', borderRadius: 12,
          padding: 14, position: 'relative',
          opacity: isEditable ? 1 : 0.78,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '64px repeat(6, 1fr)',
            gap: 6,
          }}>
            <div/>
            {DAYS.map(d => (
              <div key={d.key} style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                <div style={{ fontSize: 10, color: 'var(--fg-4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{d.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-1)', marginTop: 2 }}>
                  {d.date}<span style={{ fontSize: 9, color: 'var(--fg-4)', marginLeft: 3, fontWeight: 500 }}>{d.monthLabel}</span>
                </div>
              </div>
            ))}

            {HOURS.map(h => (
              <React.Fragment key={h}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
                  fontSize: 11, color: 'var(--fg-3)', fontWeight: 600,
                  fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                }}>{h}</div>
                {DAYS.map(d => {
                  const id = `${d.key}-${h}`;
                  const s = myLevelSlots[id];
                  const status = slotStatus(id);
                  const c = slotColors[status];
                  const isHovered = hovered === id;
                  if (status === 'none') {
                    return <div key={id} style={{ height: 44 }}/>;
                  }
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (status === 'existing') return setDetailFor(id);
                        togglePick(id);
                      }}
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                      disabled={status === 'full' || (!isEditable && status === 'free')}
                      style={{
                        height: 44, borderRadius: 8,
                        background: c.bg, border: c.border, color: c.fg,
                        cursor: isEditable || status === 'existing' ? c.cursor : 'default',
                        fontFamily: 'inherit',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 2, padding: 4, position: 'relative',
                        transition: 'all 120ms',
                        outline: isHovered && status === 'free' && isEditable ? '2px solid var(--cyan-300)' : 'none',
                        outlineOffset: -2,
                      }}>
                      {status === 'existing' && (
                        <>
                          <IconCheck size={12}/>
                          <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.85 }}>{s.room}</div>
                        </>
                      )}
                      {status === 'picked' && (
                        <>
                          <IconCheck size={12}/>
                          <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.85 }}>{s.room}</div>
                        </>
                      )}
                      {status === 'free' && (
                        <>
                          <div style={{ fontSize: 11, fontWeight: 700, color: s.cap - s.taken <= 2 ? '#8A6300' : 'var(--fg-2)' }}>
                            {s.cap - s.taken} {s.cap - s.taken === 1 ? 'libre' : 'libres'}
                          </div>
                          <div style={{ fontSize: 9, color: 'var(--fg-4)', fontWeight: 500 }}>{s.room}</div>
                        </>
                      )}
                      {status === 'full' && (
                        <div style={{ fontSize: 10, fontWeight: 600 }}>Lleno</div>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--fg-3)', padding: '0 4px', lineHeight: 1.5 }}>
          La reserva abre los viernes 9:00–12:00 y 14:00–18:00. Puedes reprogramar una clase hasta 2 horas antes de su inicio si tienes un imprevisto.
        </div>
      </div>

      {/* ========= CART ========= */}
      <BookingCart
        existing={existing} picked={picked} max={MAX}
        slots={myLevelSlots} setPicked={setPicked} togglePick={togglePick}
        isEditable={isEditable} onConfirm={handleConfirm} confirmState={confirmState}
      />

      {/* ========= DETAIL DRAWER ========= */}
      {detailFor && (
        <SlotDetail
          slot={myLevelSlots[detailFor]}
          onClose={() => setDetailFor(null)}
          isExisting={existing.includes(detailFor)}
        />
      )}
    </div>
  );
}

// ─── Banner de estado de ventana ─────────────────────────────────
function WindowBanner({ state, setState }) {
  const states = {
    'closed-future':  { tone: 'neutral', icon: '🔒', title: 'Reservas cierran hasta el viernes',
                         body: 'La parrilla de la semana 4 – 9 may abre el viernes 1 may a las 9:00.', cta: 'En 2 días, 14h, 22min' },
    'open-am':        { tone: 'live',    icon: '🟢', title: 'Reservas abiertas',
                         body: 'Tienes hasta las 12:00 del mediodía. Vuelve a las 14:00 si necesitas.', cta: 'Cierra en 2h 14min' },
    'lunch':          { tone: 'pause',   icon: '⏸',  title: 'Pausa del mediodía',
                         body: 'Lo que ya elegiste quedó guardado. Reservas vuelven a las 14:00.', cta: 'Vuelve en 1h 22min' },
    'open-pm':        { tone: 'live',    icon: '🟢', title: 'Reservas abiertas',
                         body: 'Última ventana del día. Cierra a las 18:00.', cta: 'Cierra en 3h 04min' },
    'closed-locked':  { tone: 'neutral', icon: '🔒', title: 'Tu semana está confirmada',
                         body: 'Las reservas cerraron el viernes a las 18:00. Puedes reprogramar una clase hasta 2h antes de su inicio.', cta: '' },
  };
  const s = states[state] || states['closed-future'];
  const tones = {
    neutral: { bg: 'var(--neutral-50)', border: 'var(--border-1)', accent: 'var(--fg-2)' },
    live:    { bg: '#F0FBF7', border: '#B8E8D2', accent: '#0A7B47' },
    pause:   { bg: '#FFF8EC', border: '#F5E2B5', accent: '#8A6300' },
  }[s.tone];

  return (
    <div style={{
      background: tones.bg, border: `1px solid ${tones.border}`, borderRadius: 12,
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ fontSize: 20, lineHeight: 1 }}>{s.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: tones.accent }}>{s.title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{s.body}</div>
      </div>
      {s.cta && (
        <div style={{
          fontSize: 11, fontWeight: 700, color: tones.accent,
          fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
          padding: '6px 10px', background: 'white', border: `1px solid ${tones.border}`, borderRadius: 6,
        }}>{s.cta}</div>
      )}
      {/* DEMO toggle — solo visible en demo */}
      <select value={state} onChange={e => setState(e.target.value)}
        style={{
          fontSize: 10, fontFamily: 'inherit', padding: '4px 6px',
          border: '1px dashed var(--fg-4)', borderRadius: 4, background: 'transparent',
          color: 'var(--fg-3)', cursor: 'pointer',
        }}>
        <option value="closed-future">Demo: cerrada</option>
        <option value="open-am">Demo: abierta AM</option>
        <option value="lunch">Demo: pausa</option>
        <option value="open-pm">Demo: abierta PM</option>
        <option value="closed-locked">Demo: confirmada</option>
      </select>
    </div>
  );
}

// ─── Carrito lateral ─────────────────────────────────────────────
function BookingCart({ existing, picked, max, slots, setPicked, togglePick, isEditable, onConfirm, confirmState }) {
  const totalSelected = existing.length + picked.length;
  const remaining = max - totalSelected;
  const all = [...existing.map(id => ({ id, kind: 'existing' })),
               ...picked.map(id => ({ id, kind: 'picked' }))]
    .sort((a, b) => {
      const [da, ta] = a.id.split('-');
      const [db, tb] = b.id.split('-');
      const ord = ['lun','mar','mie','jue','vie','sab'];
      return (ord.indexOf(da) - ord.indexOf(db)) || ta.localeCompare(tb);
    });

  const dayMeta = id => {
    const [dk] = id.split('-');
    return DAYS.find(x => x.key === dk);
  };

  return (
    <div style={{
      background: 'white', border: '1px solid var(--border-1)', borderRadius: 12,
      padding: 18, position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div>
        <Eyebrow>Tu semana</Eyebrow>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          {totalSelected}<span style={{ fontSize: 14, color: 'var(--fg-3)', fontWeight: 500 }}> / {max} clases</span>
        </div>
        {remaining > 0 && (
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
            Te falta{remaining > 1 ? 'n' : ''} {remaining} por elegir
          </div>
        )}
        {remaining === 0 && (
          <div style={{ fontSize: 11, color: 'var(--semantic-success)', marginTop: 2, fontWeight: 600 }}>
            ✓ Semana completa
          </div>
        )}
      </div>

      <div style={{ height: 6, background: 'var(--neutral-100)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${(totalSelected/max)*100}%`, height: '100%',
          background: remaining === 0 ? 'var(--semantic-success)' : 'var(--cyan-500)',
          transition: 'width 200ms',
        }}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {all.length === 0 && (
          <div style={{
            padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--fg-4)',
            border: '1px dashed var(--border-1)', borderRadius: 8, fontStyle: 'italic',
          }}>
            Toca un horario para empezar
          </div>
        )}
        {all.map(({ id, kind }) => {
          const slot = slots[id];
          const d = dayMeta(id);
          if (!slot || !d) return null;
          return (
            <div key={id} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr 24px', gap: 10, alignItems: 'center',
              padding: '8px 10px',
              background: kind === 'existing' ? 'var(--neutral-50)' : 'var(--cyan-50)',
              border: `1px solid ${kind === 'existing' ? 'var(--border-1)' : 'var(--cyan-200)'}`,
              borderRadius: 8,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--fg-4)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{d.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{d.date}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{slot.time}</div>
                <div style={{ fontSize: 10, color: kind === 'existing' ? 'var(--fg-3)' : 'var(--cyan-700)', fontWeight: 500, marginTop: 1 }}>
                  Aula {slot.room} · {kind === 'existing' ? 'Confirmada' : 'Por confirmar'}
                </div>
              </div>
              {kind === 'picked' ? (
                <button onClick={() => togglePick(id)} title="Quitar"
                  style={{
                    width: 22, height: 22, border: 'none', borderRadius: 4, cursor: 'pointer',
                    background: 'transparent', color: 'var(--fg-3)', fontSize: 14,
                  }}>✕</button>
              ) : (
                <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo-500)' }}>
                  <IconCheck size={14}/>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="primary" block disabled={!isEditable || picked.length === 0} onClick={onConfirm}>
        {!isEditable ? 'Reservas cerradas' :
         picked.length === 0 ? 'Elige tus clases' :
         `Confirmar ${picked.length} ${picked.length === 1 ? 'clase' : 'clases'}`}
      </Button>

      {confirmState === 'success' && (
        <div style={{
          padding: '10px 14px', background: '#E6F5E9', border: '1px solid #B8E8D2',
          borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#0A7B47',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <IconCheck size={14}/> ¡Semana confirmada! Te vemos en clase.
        </div>
      )}

      <div style={{
        fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5,
        padding: '10px 12px', background: 'var(--neutral-50)', borderRadius: 8,
      }}>
        <strong style={{ color: 'var(--fg-2)' }}>Recuerda:</strong> tu profe se asigna el viernes según disponibilidad. El tema lo decide en clase con el grupo.
      </div>
    </div>
  );
}

// ─── Detail drawer (al click en clase ya reservada) ──────────────
function SlotDetail({ slot, onClose, isExisting }) {
  if (!slot) return null;
  const lang = D.langOf(slot.lang);
  const lvl  = D.levelOf(slot.level);
  const teacher = D.teacherOf(slot.teacher);
  const day = DAYS.find(d => d.key === slot.day);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,17,21,0.4)', zIndex: 100,
      }}/>
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 101,
        background: 'white', borderLeft: '1px solid var(--border-1)',
        display: 'flex', flexDirection: 'column', padding: 24, gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Detalle de clase</Eyebrow>
          <button onClick={onClose} style={{
            width: 32, height: 32, border: '1px solid var(--border-1)', borderRadius: 6,
            background: 'white', cursor: 'pointer', fontSize: 16, color: 'var(--fg-3)',
          }}>✕</button>
        </div>

        <div>
          <div style={{ fontSize: 11, color: 'var(--fg-4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {day?.label} {day?.date} {day?.monthLabel}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {slot.time}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 0', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
          <Row label="Idioma" value={`${lang.flag} ${lang.name}`}/>
          <Row label="Nivel" value={lvl.name}/>
          <Row label="Aula" value={slot.room}/>
          <Row label="Cupos" value={`${slot.taken} de ${slot.cap}`}/>
          <Row label="Asesor"
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--cyan-500)', color: 'white',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                }}>{teacher.initials}</span>
                {teacher.name}
              </div>
            }
          />
        </div>

        {isExisting && (
          <>
            <div style={{
              fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5,
              padding: '12px 14px', background: 'var(--neutral-50)', borderRadius: 8,
            }}>
              Si necesitas <strong>cancelar o reprogramar</strong>, hazlo al menos 2 horas antes del inicio.
              El sistema te ofrecerá horarios libres en esta misma semana.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <Button variant="ghost" block onClick={onClose}>Reprogramar</Button>
              <Button variant="danger" block onClick={onClose}>Cancelar</Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, alignItems: 'center', fontSize: 13 }}>
      <div style={{ color: 'var(--fg-3)', fontWeight: 500 }}>{label}</div>
      <div style={{ color: 'var(--fg-1)', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Legend({ dot, border, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 12, height: 12, borderRadius: 3,
        background: dot, border: border ? `1px solid ${border}` : 'none',
      }}/>
      {label}
    </div>
  );
}

const chevBtn = {
  width: 28, height: 28, border: '1px solid var(--border-1)', background: 'white',
  borderRadius: 6, cursor: 'pointer', color: 'var(--fg-3)', fontFamily: 'inherit',
};

window.BookingFlow = BookingFlow;
