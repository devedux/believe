// Student home — REDISEÑO senior
// Principios:
//  1. Honestidad: el tema de la clase NO se pre-anuncia (se decide en clase con 6-7 compañeros)
//  2. Compacto: mini-calendar + lista del día (no grid de 720px)
//  3. Widgets removibles — todo componible
//  4. Genérico: academia.name + program.track (no hardcode Believe / Inglés)

const { useState: useState_s } = React;

// Copy-table minimal — UI se adapta al idioma que estudia el alumno
const I18N_S = {
  es: {
    nextClass: 'Tu próxima clase', inMinutes: 'en',
    scanOnArrival: 'Escanear al llegar',
    mySchedule: 'Mis clases esta semana', reserved: 'reservadas de', edit: 'Editar',
    scheduleRule: 'Horarios flexibles: Lun–Sáb 08:30–18:00 · 1h por clase · máx. 4 por semana.',
    history: 'Lo que has visto', lastSeen: 'Última clase',
    pendingTopics: 'Temas pendientes del programa', noOrder: 'El orden depende de la clase · lo decide el profesor con el grupo',
    payment: 'Pago', dueIn: 'vence en', uploadReceipt: 'Subir comprobante',
    attendance: 'Asistencia', thisMonth: 'este mes',
    pickDay: 'Elige un día', free: 'libre',
    today: 'Hoy', practiceMode: 'practice mode',
  },
  en: {
    nextClass: 'Your next class', inMinutes: 'in',
    scanOnArrival: 'Scan on arrival',
    mySchedule: 'My classes this week', reserved: 'of', edit: 'Edit',
    scheduleRule: 'Flexible schedule: Mon–Sat 8:30–18:00 · 1h per class · up to 4/week.',
    history: 'What you\'ve covered', lastSeen: 'Last class',
    pendingTopics: 'Pending topics', noOrder: 'Order depends on the class — decided by the teacher with the group',
    payment: 'Payment', dueIn: 'due in', uploadReceipt: 'Upload receipt',
    attendance: 'Attendance', thisMonth: 'this month',
    pickDay: 'Pick a day', free: 'free',
    today: 'Today', practiceMode: 'practice mode',
  },
};

function StudentHome() {
  const [lang, setLang] = useState_s('es');
  const [selectedDay, setSelectedDay] = useState_s(23); // today
  const t = I18N_S[lang];

  // Student studies English B2. UI language can be swapped (practice mode).
  const availableUILangs = [
    { code: 'es', flag: '🇪🇸', label: 'Español' },
    { code: 'en', flag: '🇬🇧', label: 'English', practice: true },
  ];

  // This week's bookings — no pre-announced topic, just time+room+teacher.
  const bookings = [
    { date: 21, day: 'Lun', time: '08:30', room: 'A2', teacher: 'María José' },
    { date: 21, day: 'Lun', time: '09:30', room: 'A2', teacher: 'María José' },
    { date: 23, day: 'Mié', time: '16:00', room: 'A3', teacher: 'María José', today: true },
    { date: 25, day: 'Vie', time: '14:00', room: 'A3', teacher: 'María José' },
  ];
  const MAX_WEEK = 4;

  // Mini calendar — September-style (mes actual)
  // Highlight dates where student has class
  const DAYS_IN_MONTH = 30; // April 2026 mock
  const FIRST_DAY_OFFSET = 2; // April 1 = Wed (index 2 if Mon-start)
  const classDates = bookings.map(b => b.date);
  const hasClass = (d) => classDates.includes(d);

  // History — REAL topics, confirmed by teacher after class
  const history = [
    { date: '21 abr', unit: 6, topic: 'Reported questions', teacher: 'María José', notes: 'Repasamos usos formales.' },
    { date: '21 abr', unit: 6, topic: 'Indirect speech drill', teacher: 'María José' },
    { date: '14 abr', unit: 6, topic: 'Reported statements', teacher: 'María José' },
    { date: '11 abr', unit: 7, topic: 'Conditionals Type 1 & 2 (review)', teacher: 'Carlos' },
    { date: '8 abr',  unit: 5, topic: 'Modals of obligation', teacher: 'María José' },
  ];

  // Pending topics — no order, just what's left in the program
  const pending = [
    { unit: 5, topic: 'Past modals' },
    { unit: 5, topic: 'Mixed modals quiz' },
    { unit: 6, topic: 'Reported commands' },
    { unit: 7, topic: 'Type 3 conditionals' },
    { unit: 7, topic: 'Mixed conditionals' },
    { unit: 7, topic: 'Wish / If only' },
  ];

  const bookingsOnDay = bookings.filter(b => b.date === selectedDay);

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top row: language switcher */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display:'flex', background:'var(--neutral-100)', borderRadius: 8, padding: 3, gap: 2 }}>
          {availableUILangs.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{
              padding: '5px 10px', fontSize: 12, fontWeight: 600,
              border: 'none', background: lang===l.code ? 'white' : 'transparent',
              color: lang===l.code ? 'var(--fg-1)' : 'var(--fg-3)',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: lang===l.code ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>
              <span style={{marginRight:6}}>{l.flag}</span>{l.label}
              {l.practice && <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--fg-4)', fontWeight: 500 }}>· {t.practiceMode}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Next class ribbon — the ONLY confident piece of info about the future */}
      <div style={{
        background: 'var(--grad-night)', color: 'white', borderRadius: 12,
        padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{ flex: 1 }}>
          <Eyebrow color="rgba(252,185,0,1)">{t.nextClass} · {t.inMinutes} 38 min</Eyebrow>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>
            {t.today} 16:00 · Aula 3 · María José
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>
            🇬🇧 English B2 · el tema lo define la profe en clase con el grupo.
          </div>
        </div>
        <Button variant="primary" icon={<IconQR size={16}/>}>{t.scanOnArrival}</Button>
      </div>

      {/* Main grid — widgets componibles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Widget: Mini-calendar + lista del día (estilo tu screenshot) */}
          <Widget
            id="schedule-month"
            eyebrow={t.mySchedule}
            title={`${bookings.length} ${t.reserved} ${MAX_WEEK}`}
            actions={<Button variant="ghost" size="sm">{t.edit}</Button>}
            removable
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 18, marginTop: 4 }}>
              {/* Mini calendar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Abril 2026</div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button style={{ width: 22, height: 22, border: '1px solid var(--border-1)', background: 'white', borderRadius: 6, cursor: 'pointer', color: 'var(--fg-3)' }}>‹</button>
                    <button style={{ width: 22, height: 22, border: '1px solid var(--border-1)', background: 'white', borderRadius: 6, cursor: 'pointer', color: 'var(--fg-3)' }}>›</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 11 }}>
                  {['L','M','X','J','V','S','D'].map(d => (
                    <div key={d} style={{ textAlign: 'center', color: 'var(--fg-4)', fontWeight: 600, padding: 4 }}>{d}</div>
                  ))}
                  {Array.from({length: FIRST_DAY_OFFSET}).map((_,i) => <div key={'e'+i}/>)}
                  {Array.from({length: DAYS_IN_MONTH}).map((_,i) => {
                    const d = i+1;
                    const has = hasClass(d);
                    const sel = d === selectedDay;
                    const today = d === 23;
                    return (
                      <button key={d} onClick={() => setSelectedDay(d)} style={{
                        width: 30, height: 30, border: 'none', borderRadius: '50%',
                        background: sel ? 'var(--cyan-500)' : has ? 'var(--cyan-50)' : 'transparent',
                        color: sel ? 'white' : has ? 'var(--cyan-700)' : 'var(--fg-2)',
                        fontWeight: has || sel ? 700 : 500,
                        fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                        border: today && !sel ? '1.5px solid var(--cyan-500)' : 'none',
                        fontVariantNumeric: 'tabular-nums',
                      }}>{d}</button>
                    );
                  })}
                </div>
              </div>
              {/* Day list */}
              <div style={{ borderLeft: '1px solid var(--border-1)', paddingLeft: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                  {bookingsOnDay[0]?.day || 'Día'} {selectedDay} abr
                </div>
                {bookingsOnDay.length === 0 && (
                  <div style={{ fontSize: 12, color: 'var(--fg-4)', fontStyle: 'italic', padding: '8px 0' }}>Sin clases</div>
                )}
                {bookingsOnDay.map((b, i) => (
                  <div key={i} style={{
                    border: '1px solid var(--cyan-300)', borderRadius: 8,
                    padding: '6px 10px', marginBottom: 6,
                    background: b.today ? 'var(--cyan-500)' : 'transparent',
                    color: b.today ? 'white' : 'var(--cyan-700)',
                    fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {b.time}
                    <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>{b.room} · {b.teacher}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--fg-3)' }}>{t.scheduleRule}</div>
          </Widget>

          {/* Widget: Historial — lo que realmente has visto (NO predicción) */}
          <Widget
            id="history"
            eyebrow={t.history}
            title={t.lastSeen + ': 21 abr · U6 · Reported questions'}
            removable
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {history.map((h, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '64px 28px 1fr auto', gap: 10, alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < history.length-1 ? '1px solid var(--neutral-100)' : 'none',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{h.date}</div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, background: 'var(--indigo-500)',
                    color: 'white', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 10, fontWeight: 700,
                  }}>U{h.unit}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{h.topic}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{h.teacher}</div>
                </div>
              ))}
            </div>
          </Widget>

          {/* Widget: Pending topics — sin orden */}
          <Widget
            id="pending-topics"
            eyebrow={t.pendingTopics}
            title={`${pending.length} temas sin ver`}
            removable
          >
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 10, fontStyle: 'italic' }}>
              {t.noOrder}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pending.map((p, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', borderRadius: 6, fontSize: 12,
                  background: 'var(--neutral-50)', border: '1px solid var(--border-1)',
                  color: 'var(--fg-2)', fontWeight: 500,
                }}>
                  <span style={{
                    padding: '1px 5px', background: 'var(--neutral-200)', borderRadius: 3,
                    fontSize: 9, fontWeight: 700, color: 'var(--fg-2)',
                  }}>U{p.unit}</span>
                  {p.topic}
                </span>
              ))}
            </div>
          </Widget>

        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Widget id="payment" eyebrow={`${t.payment} · 30 abr`} compact
                  actions={<Badge tone="warning" dot>{t.dueIn} 5d</Badge>}>
            <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 4 }}>S/ 340.00</div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 10 }}>Mensualidad abril</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
              {['Yape', 'Plin', 'BCP'].map(m => (
                <span key={m} style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, background: 'var(--neutral-100)', borderRadius: 4 }}>{m}</span>
              ))}
            </div>
            <Button variant="primary" size="sm" icon={<IconUpload size={13}/>} block>{t.uploadReceipt}</Button>
          </Widget>

          <Widget id="attendance" eyebrow={t.attendance} compact>
            <div style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric:'tabular-nums' }}>94%</div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>17 de 18 · {t.thisMonth}</div>
            {/* sparkline */}
            <div style={{ display: 'flex', gap: 2, marginTop: 10, alignItems: 'flex-end', height: 30 }}>
              {[70, 85, 80, 90, 75, 88, 92, 95, 94].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--cyan-300)', borderRadius: 2 }}/>
              ))}
            </div>
          </Widget>

          <Widget id="reminder" eyebrow="Recordatorio" compact>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--fg-2)' }}>
              Este viernes abre la reserva de la semana del 28 abr al 3 may.
            </div>
            <Button variant="ghost" size="sm" style={{ marginTop: 8 }}>Avisarme</Button>
          </Widget>

          <Widget id="progress" eyebrow="Programa" title="English B2" compact>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6 }}>Temas cubiertos</div>
            <div style={{ height: 8, background: 'var(--neutral-100)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: '42%', height: '100%', background: 'var(--cyan-500)' }}/>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', fontVariantNumeric:'tabular-nums' }}>{history.length} vistos · {pending.length} por ver · sin orden fijo</div>
          </Widget>

        </div>
      </div>
    </div>
  );
}

window.StudentHome = StudentHome;
