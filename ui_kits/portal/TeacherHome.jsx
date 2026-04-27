// Teacher Home — Flexible schedule reality
// Profesor puede tener hasta 7 alumnos en un aula, niveles distintos, idiomas a veces distintos.
// El profe decide tema con el grupo presente. UI le ayuda a: marcar asistencia, registrar qué se vio, ver programa.

const { useState: useState_t } = React;

function TeacherHome() {
  const [selectedClass, setSelectedClass] = useState_t(1);
  const [topicUnit, setTopicUnit] = useState_t('U6');
  const [topicName, setTopicName] = useState_t('');
  const [topicNotes, setTopicNotes] = useState_t('');
  const [classSaved, setClassSaved] = useState_t(false);

  // Clases de hoy — stateful para poder marcar como completadas al guardar
  const [todayClasses, setTodayClasses] = useState_t([
    { id: 0, time: '08:30', room: 'A2', lang: '🇬🇧', level: 'B2', students: 5, status: 'done', topic: 'Reported questions' },
    { id: 1, time: '16:00', room: 'A3', lang: '🇬🇧', level: 'B2/C1', students: 7, status: 'now', topic: null },
    { id: 2, time: '17:00', room: 'A3', lang: '🇬🇧', level: 'B2/C1', students: 6, status: 'next', topic: null },
    { id: 3, time: '18:00', room: 'A1', lang: '🇫🇷', level: 'A2', students: 4, status: 'next', topic: null },
  ]);

  // Alumnos en la clase seleccionada — stateful para marcar asistencia
  const [studentsInClass, setStudentsInClass] = useState_t([
    { name: 'Sebastián Ríos', level: 'B2', lastUnit: 6, lastTopic: 'Reported questions', attended: true },
    { name: 'Lucía Mendoza', level: 'B2', lastUnit: 6, lastTopic: 'Reported questions', attended: true },
    { name: 'Diego Ortiz', level: 'C1', lastUnit: 3, lastTopic: 'Passive voice review', attended: true },
    { name: 'Camila Soto', level: 'B2', lastUnit: 5, lastTopic: 'Modals of obligation', attended: false },
    { name: 'Andrés Quispe', level: 'B2', lastUnit: 6, lastTopic: 'Indirect speech drill', attended: true },
    { name: 'Valentina Cruz', level: 'C1', lastUnit: 3, lastTopic: 'Passive voice review', attended: true },
    { name: 'Matías León', level: 'B2', lastUnit: 6, lastTopic: 'Reported questions', attended: null },
  ]);

  const markAttendance = (idx, present) => {
    setStudentsInClass(prev => prev.map((s, i) => i === idx ? { ...s, attended: present } : s));
  };

  const saveClass = () => {
    if (!topicName.trim()) return;
    setTodayClasses(prev => prev.map((c, i) =>
      i === selectedClass ? { ...c, status: 'done', topic: topicName } : c
    ));
    setClassSaved(true);
    setTopicName('');
    setTopicNotes('');
    setTimeout(() => setClassSaved(false), 3500);
  };

  const current = todayClasses[selectedClass];

  // Suggested topics — basado en lo que el grupo ya vio
  const suggestions = [
    { unit: 6, topic: 'Reported commands', match: '6/7 alumnos listos' },
    { unit: 7, topic: 'Type 1 conditionals', match: '5/7 alumnos listos' },
    { unit: 5, topic: 'Past modals (review)', match: 'Camila lo necesita' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Timeline del día */}
      <Widget id="today-timeline" eyebrow="Hoy · Miércoles 23 abr" title="Tu día"
              actions={<Badge tone="success" dot>1 completada · 3 por venir</Badge>}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {todayClasses.map((c, i) => {
            const active = i === selectedClass;
            const isNow = c.status === 'now';
            const isDone = c.status === 'done';
            return (
              <button key={c.id} onClick={() => setSelectedClass(i)} style={{
                minWidth: 200, padding: '12px 14px', textAlign: 'left',
                border: active ? '2px solid var(--cyan-500)' : '1px solid var(--border-1)',
                borderRadius: 10, background: isDone ? 'var(--neutral-50)' : 'white',
                cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
                opacity: isDone ? 0.7 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{c.time}</div>
                  {isNow && <span style={{
                    padding: '2px 7px', fontSize: 9, fontWeight: 800,
                    background: 'var(--red-500)', color: 'white', borderRadius: 4,
                    letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>En curso</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
                  {c.lang} {c.level} · Aula {c.room}
                </div>
                <div style={{ fontSize: 10, color: 'var(--fg-4)', marginTop: 6 }}>
                  {c.students} alumnos{isDone && c.topic ? ` · ${c.topic}` : ''}
                </div>
              </button>
            );
          })}
        </div>
      </Widget>

      {/* Grid: clase actual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Class roster — asistencia */}
          <Widget
            id="roster"
            eyebrow={`${current.time} · Aula ${current.room} · ${current.lang} ${current.level}`}
            title={`Asistencia · ${current.students} alumnos`}
            actions={<Button variant="ghost" size="sm" icon={<IconQR size={13}/>}>Ver QR del aula</Button>}
          >
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 10 }}>
              Los alumnos escanean el QR al entrar · tú puedes marcar manual si el escaneo falló.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {studentsInClass.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 60px auto', gap: 10, alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < studentsInClass.length-1 ? '1px solid var(--neutral-100)' : 'none',
                }}>
                  <Avatar name={s.name} size={26}/>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>
                      Última clase: U{s.lastUnit} · {s.lastTopic}
                    </div>
                  </div>
                  <Badge tone={s.level === 'C1' ? 'warning' : 'info'}>{s.level}</Badge>
                  <div>
                    {s.attended === true && <Badge tone="success" dot>Presente</Badge>}
                    {s.attended === false && <Badge tone="danger" dot>Ausente</Badge>}
                    {s.attended === null && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => markAttendance(i, true)} title="Marcar presente" style={{ padding: '3px 8px', fontSize: 10, border: '1px solid var(--border-1)', borderRadius: 4, background: 'white', cursor: 'pointer' }}>✓</button>
                        <button onClick={() => markAttendance(i, false)} title="Marcar ausente" style={{ padding: '3px 8px', fontSize: 10, border: '1px solid var(--border-1)', borderRadius: 4, background: 'white', cursor: 'pointer' }}>✗</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          {/* Register what was covered (post-class) */}
          <Widget id="register-topic" eyebrow="Al terminar la clase" title="¿Qué vieron hoy?">
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 10 }}>
              Tú decides el tema en clase con el grupo. Déjalo registrado para que los alumnos lo vean en su historial.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10, marginBottom: 10 }}>
              <select value={topicUnit} onChange={e => setTopicUnit(e.target.value)} style={{
                padding: '8px 10px', fontSize: 13, border: '1px solid var(--border-1)',
                borderRadius: 6, fontFamily: 'inherit', background: 'white',
              }}>
                <option>U5</option><option>U6</option><option>U7</option>
              </select>
              <input value={topicName} onChange={e => setTopicName(e.target.value)} placeholder="Ej. Reported commands · ejercicios pág. 84" style={{
                padding: '8px 12px', fontSize: 13, border: '1px solid var(--border-1)',
                borderRadius: 6, fontFamily: 'inherit',
              }}/>
            </div>
            <textarea value={topicNotes} onChange={e => setTopicNotes(e.target.value)} placeholder="Notas internas (opcional)" style={{
              width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid var(--border-1)',
              borderRadius: 6, fontFamily: 'inherit', resize: 'vertical', minHeight: 60,
            }}/>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 10 }}>
              {classSaved && (
                <span style={{ fontSize: 12, color: '#0A7B47', fontWeight: 600 }}>✓ Clase registrada</span>
              )}
              <Button variant="primary" size="sm" onClick={saveClass} disabled={!topicName.trim()}>Guardar clase</Button>
            </div>
          </Widget>

        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <Widget id="suggestions" eyebrow="Sugerencias" title="Posibles temas de hoy">
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 10, fontStyle: 'italic' }}>
              Basado en lo que vio este grupo. Tú decides con ellos en clase.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  padding: 10, border: '1px solid var(--border-1)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: 'var(--indigo-500)',
                    color: 'white', display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: 11, fontWeight: 700,
                  }}>U{s.unit}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.topic}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>{s.match}</div>
                  </div>
                </div>
              ))}
            </div>
          </Widget>

          <Widget id="levels-warning" eyebrow="Aviso" accent="var(--amber-500)" compact>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Grupo mixto</div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.5 }}>
              2 alumnos C1 en una clase de B2. Considera un tema de gramática compartido o divide en parejas.
            </div>
          </Widget>

          <Widget id="teacher-stats" eyebrow="Esta semana" title="Tu carga" compact>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>18</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>clases</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>42</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>alumnos únicos</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>92%</div>
                <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>asistencia</div>
              </div>
            </div>
          </Widget>

        </div>
      </div>
    </div>
  );
}

window.TeacherHome = TeacherHome;
