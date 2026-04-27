// Admin Home — reemplaza Recepción + Dueño + Finanzas
// Rol genérico para cualquier trabajador de la academia.
// Permisos granulares se definen por tab (placeholder UI).

const { useState: useState_a } = React;

const TABS = [
  { id: 'home', label: 'Resumen' },
  { id: 'reservas', label: 'Reservas & slots' },
  { id: 'estudiantes', label: 'Estudiantes' },
  { id: 'pagos', label: 'Pagos & cobros' },
  { id: 'profesores', label: 'Profesores' },
  { id: 'excel', label: 'Importar/Exportar' },
];

function AdminHome({ tab = 'home' }) {
  const currentTab = TABS.find(t => t.id === tab) || TABS[0];
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Excel bridge — always visible as confidence tool */}
      <ExcelBridge context={currentTab.label}/>

      {tab === 'home' && <ResumenTab/>}
      {tab === 'reservas' && <ReservasTab/>}
      {tab === 'estudiantes' && <EstudiantesTab/>}
      {tab === 'pagos' && <PagosTab/>}
      {tab === 'profesores' && <ProfesoresTab/>}
      {tab === 'excel' && <ExcelTab/>}

    </div>
  );
}

function ResumenTab() {
  const [comprobantes, setComprobantes] = useState_a([
    { name: 'Sebastián Ríos', amount: 'S/ 340', method: 'Yape', when: 'hace 12 min' },
    { name: 'Lucía Mendoza', amount: 'S/ 280', method: 'Plin', when: 'hace 1h' },
    { name: 'Diego Ortiz', amount: 'S/ 340', method: 'BCP', when: 'hace 2h' },
    { name: 'Camila Soto', amount: 'S/ 420', method: 'Yape', when: 'ayer' },
  ]);
  const [lastApproved, setLastApproved] = useState_a(null);
  const [viewingIdx, setViewingIdx] = useState_a(null);

  const approve = (i) => {
    setLastApproved(comprobantes[i].name);
    setViewingIdx(null);
    setComprobantes(prev => prev.filter((_, idx) => idx !== i));
    setTimeout(() => setLastApproved(null), 3000);
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatTile label="Estudiantes activos" value="84" delta="+3 este mes"/>
        <StatTile label="Clases esta semana" value="198" delta="+12%"/>
        <StatTile label="Ingresos abril" value="S/ 28,560" delta="+8%"/>
        <StatTile label="Pagos pendientes" value="11" delta="2 vencidos" tone="down"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginTop: 6 }}>
        <Widget id="approve-queue" eyebrow="Bandeja" title="Comprobantes por aprobar"
                actions={<Badge tone="warning">{comprobantes.length} pendientes</Badge>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
            {lastApproved && (
              <div style={{
                padding: '8px 12px', background: '#E6F5E9', border: '1px solid #B8E8D2',
                borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#0A7B47',
              }}>
                ✓ Pago de {lastApproved} aprobado
              </div>
            )}
            {comprobantes.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'var(--fg-4)', fontStyle: 'italic' }}>
                Sin comprobantes pendientes
              </div>
            )}
            {comprobantes.map((p, i) => (
              <div key={p.name}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 72px auto auto', gap: 12, alignItems: 'center',
                  padding: '8px 10px', border: viewingIdx === i ? '1px solid var(--cyan-300)' : '1px solid var(--border-1)',
                  borderRadius: viewingIdx === i ? '8px 8px 0 0' : 8,
                  background: viewingIdx === i ? 'var(--cyan-50)' : 'white',
                }}>
                  <Avatar name={p.name} size={26}/>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-3)' }}>{p.method} · {p.when}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textAlign: 'right' }}>{p.amount}</div>
                  <Button variant="ghost" size="sm" onClick={() => setViewingIdx(viewingIdx === i ? null : i)}>
                    {viewingIdx === i ? 'Cerrar' : 'Ver'}
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => approve(i)}>Aprobar</Button>
                </div>
                {viewingIdx === i && (
                  <div style={{
                    padding: '12px 14px', border: '1px solid var(--cyan-300)', borderTop: 'none',
                    borderRadius: '0 0 8px 8px', background: 'var(--neutral-50)',
                    fontSize: 12, color: 'var(--fg-2)', display: 'flex', gap: 16, alignItems: 'center',
                  }}>
                    <div style={{
                      width: 80, height: 56, background: 'var(--neutral-200)', borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'var(--fg-4)', fontWeight: 600,
                    }}>Comprobante</div>
                    <div>
                      <div><strong>Monto:</strong> {p.amount}</div>
                      <div><strong>Método:</strong> {p.method}</div>
                      <div><strong>Recibido:</strong> {p.when}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Widget>

        <Widget id="occupancy" eyebrow="Ocupación hoy" title="6 aulas activas">
          {[
            { room: 'A1', cls: 'Inglés · B2 · M. José', filled: 6, cap: 7 },
            { room: 'A2', cls: 'Francés · A2 · Carlos', filled: 4, cap: 7 },
            { room: 'A3', cls: 'Inglés · C1 · M. José', filled: 7, cap: 7 },
            { room: 'A4', cls: 'Japonés · A1 · Yuki', filled: 3, cap: 6 },
          ].map(r => (
            <div key={r.room} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 10, alignItems: 'center',
              padding: '8px 0', borderBottom: '1px solid var(--neutral-100)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--indigo-500)' }}>{r.room}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)' }}>{r.cls}</div>
              <div style={{ fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                            color: r.filled === r.cap ? 'var(--red-700)' : 'var(--fg-3)' }}>
                {r.filled}/{r.cap}
              </div>
            </div>
          ))}
        </Widget>
      </div>
    </>
  );
}

function ReservasTab() {
  const [sub, setSub] = useState_a('actual');
  const subs = [
    { id: 'actual',   label: 'Esta semana', sub: 'lun 27 abr – sáb 2 may' },
    { id: 'parrilla', label: 'Próxima parrilla', sub: 'lun 4 may – sáb 9 may' },
    { id: 'asignar',  label: 'Asignar asesores', sub: 'rotación semanal' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'white',
                    border: '1px solid var(--border-1)', borderRadius: 10, alignSelf: 'flex-start' }}>
        {subs.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            style={{
              padding: '8px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: sub === s.id ? 'var(--neutral-900)' : 'transparent',
              color: sub === s.id ? 'white' : 'var(--fg-2)',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.2,
            }}>
            <span>{s.label}</span>
            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, lineHeight: 1.3 }}>{s.sub}</span>
          </button>
        ))}
      </div>

      {sub === 'actual'   && <ReservasEstaSemana/>}
      {sub === 'parrilla' && <ReservasParrilla/>}
      {sub === 'asignar'  && <ReservasAsignar/>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 1. Esta semana — vista monitorial: cuántos alumnos en cada slot
// ──────────────────────────────────────────────────────────────────
function ReservasEstaSemana() {
  const D2 = window.BELIEVE_DATA;
  const week = D2.makeWeek(0);
  const slots = Object.values(week);
  const totalCap = slots.reduce((s, x) => s + x.cap, 0);
  const totalTaken = slots.reduce((s, x) => s + x.taken, 0);
  const fullSlots = slots.filter(s => s.taken >= s.cap).length;
  const [selectedSlot, setSelectedSlot] = useState_a(null);
  const [cancelaciones] = useState_a({ total: 3, reprog: 2 });
  const [showBadgeInfo, setShowBadgeInfo] = useState_a(false);
  const [langFilter, setLangFilter] = useState_a(null);
  const [filterNoTeacher, setFilterNoTeacher] = useState_a(false);

  const langsInWeek = window.BELIEVE_DATA.LANGUAGES.filter(l => slots.some(s => s.lang === l.code));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatTile label="Clases publicadas" value={slots.length} delta="esta semana"/>
        <StatTile label="Clases llenas" value={fullSlots} delta={fullSlots === 0 ? 'Ninguna aún' : `${Math.round(fullSlots/slots.length*100)}% de la semana`}/>
        <StatTile label="Alumnos inscritos" value={`${totalTaken}/${totalCap}`} delta={`${Math.round(totalTaken/totalCap*100)}% ocupación`}/>
        <StatTile label="Cancelaciones" value={cancelaciones.total} delta={`${cancelaciones.reprog} reprogramadas`} tone="down"/>
      </div>

      <Widget id="week-monitor" eyebrow="Monitor semanal" title="Cómo va la semana"
              actions={
                <div style={{ position:'relative', display:'inline-flex', alignItems:'center', gap:6 }}>
                  <Badge tone="neutral" dot>Inscripciones cerradas</Badge>
                  <button
                    onClick={() => setShowBadgeInfo(b => !b)}
                    title="¿Qué significa esto?"
                    style={{
                      width:18, height:18, borderRadius:'50%', border:'1px solid var(--neutral-300)',
                      background: showBadgeInfo ? 'var(--neutral-900)' : 'var(--neutral-100)',
                      color: showBadgeInfo ? 'white' : 'var(--fg-3)',
                      fontSize:10, fontWeight:800, cursor:'pointer', lineHeight:1,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                    }}>i</button>
                  {showBadgeInfo && (
                    <div style={{
                      position:'absolute', top:'calc(100% + 8px)', right:0,
                      background:'var(--neutral-900)', color:'white',
                      fontSize:12, fontWeight:400, lineHeight:1.6,
                      padding:'10px 14px', borderRadius:8, width:260,
                      boxShadow:'0 4px 16px rgba(0,0,0,0.2)', zIndex:20,
                    }}>
                      <div style={{ fontWeight:700, marginBottom:4 }}>¿Qué significa esto?</div>
                      La ventana de reservas de esta semana ya cerró. Los alumnos <strong>no pueden</strong> reservar ni cancelar clases hasta la próxima apertura.
                      <div style={{ marginTop:8, fontSize:11, opacity:0.7 }}>La próxima apertura es el viernes 1 may a las 9:00.</div>
                    </div>
                  )}
                </div>
              }>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
          <LangFilter activeLangs={langFilter} allLangs={langsInWeek} onChange={setLangFilter}/>
          <button onClick={() => setFilterNoTeacher(f => !f)} style={{
            padding:'4px 10px', fontSize:11, fontWeight:700, borderRadius:999, cursor:'pointer', fontFamily:'inherit',
            border: filterNoTeacher ? '1.5px solid #F59E0B' : '1px solid var(--border-1)',
            background: filterNoTeacher ? '#FFF7E0' : 'white',
            color: filterNoTeacher ? '#B45309' : 'var(--fg-3)',
            display:'flex', alignItems:'center', gap:5,
          }}>
            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:13, height:13, borderRadius:2, background: filterNoTeacher ? '#F59E0B' : 'var(--neutral-200)', color: filterNoTeacher ? 'white' : 'var(--fg-4)', fontSize:8, fontWeight:900 }}>!</span>
            {filterNoTeacher ? 'Mostrando sin asesor' : 'Ver sin asesor'}
          </button>
        </div>
        <SlotGrid week={week} langFilter={langFilter} filterNoTeacher={filterNoTeacher} mode="monitor" onSlotClick={setSelectedSlot}/>
        {/* Leyenda integrada + hint de click */}
        <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--fg-3)', marginTop:12, flexWrap:'wrap', alignItems:'center', padding:'8px 10px', background:'var(--neutral-50)', borderRadius:6 }}>
          {/* Aulas — badges de color con nombre */}
          <span style={{ fontWeight:700, color:'var(--fg-2)', fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Aula:</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
            {Object.entries({ A1:'#0693E3', A2:'#020381', A3:'#FCB900', A4:'#CF2E2E' }).map(([room, color]) => (
              <span key={room} style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                minWidth:20, height:16, paddingLeft:4, paddingRight:4, borderRadius:3,
                background:color, color: room === 'A3' ? '#5C4100' : 'white',
                fontSize:9, fontWeight:800,
              }}>{room}</span>
            ))}
          </span>
          {/* Ocupación — conteo coloreado */}
          <span style={{ borderLeft:'1px solid var(--border-1)', paddingLeft:12, fontWeight:700, color:'var(--fg-2)', fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em' }}>Cupo:</span>
          {[
            { color:'#CF2E2E', example:'7/7', label:'Llena' },
            { color:'#D97706', example:'5/7', label:'Alta (≥70%)' },
            { color:'var(--fg-3)', example:'2/7', label:'Normal' },
          ].map(({ color, example, label }) => (
            <span key={label} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color, fontVariantNumeric:'tabular-nums' }}>{example}</span>
              <span style={{ fontSize:10 }}>{label}</span>
            </span>
          ))}
          {/* Sin asesor */}
          <span style={{ borderLeft:'1px solid var(--border-1)', paddingLeft:12, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:14, height:14, borderRadius:3, background:'#F59E0B', color:'white', fontSize:9, fontWeight:900 }}>!</span>
            <span>Sin asesor asignado</span>
          </span>
          <span style={{ borderLeft:'1px solid var(--border-1)', paddingLeft:12, marginLeft:2, color:'var(--cyan-700)', fontWeight:700 }}>
            → Click en una clase para gestionar alumnos
          </span>
        </div>
      </Widget>

      {selectedSlot && <SlotDrawer slot={selectedSlot} onClose={() => setSelectedSlot(null)}/>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 2. Próxima parrilla — Admin define qué slots abre la próxima semana
// ──────────────────────────────────────────────────────────────────
function ReservasParrilla() {
  const D2 = window.BELIEVE_DATA;
  const baseWeek = D2.makeWeek(1);
  const [displayWeek, setDisplayWeek] = useState_a(baseWeek);
  const slots = Object.values(displayWeek);
  const langCounts = {};
  slots.forEach(s => { langCounts[s.lang] = (langCounts[s.lang] || 0) + 1; });
  const [published, setPublished] = useState_a(false);
  const [publishedAt, setPublishedAt] = useState_a(null);
  const [confirmPublish, setConfirmPublish] = useState_a(false);
  const [copied, setCopied] = useState_a(false);
  const [hasEverCopied, setHasEverCopied] = useState_a(false);
  const [showCopyPreview, setShowCopyPreview] = useState_a(false);
  const [showNewSlot, setShowNewSlot] = useState_a(false);
  const [newSlotForm, setNewSlotForm] = useState_a({ dia: 'lun', aula: 'A1', hora: '08:30', idioma: 'en', nivel: 'B2', asesor: '' });
  const [slotAddedToast, setSlotAddedToast] = useState_a(null);
  const [editingSlotId, setEditingSlotId] = useState_a(null);
  const [langFilterP, setLangFilterP] = useState_a(null);
  const [filterNoTeacherP, setFilterNoTeacherP] = useState_a(false);
  const [deletedSlot, setDeletedSlot] = useState_a(null);
  const [deleteTimer, setDeleteTimer] = useState_a(null);

  const slotsSinAsesor = slots.filter(s => !s.teacher).length;
  const langsInParrilla = D2.LANGUAGES.filter(l => slots.some(s => s.lang === l.code));

  // Aulas ya ocupadas en el día/hora del form — para validación de conflictos
  const occupiedAtForm = Object.values(displayWeek)
    .filter(s => s.day === newSlotForm.dia && s.time === newSlotForm.hora && s.id !== editingSlotId)
    .reduce((acc, s) => { acc[s.room] = D2.langOf(s.lang).name; return acc; }, {});

  const handleSlotRemove = (id) => {
    const slot = displayWeek[id];
    if (!slot) return;
    if (deleteTimer) clearTimeout(deleteTimer);
    setDeletedSlot(slot);
    setDisplayWeek(w => { const n = {...w}; delete n[id]; return n; });
    const timer = setTimeout(() => setDeletedSlot(null), 5000);
    setDeleteTimer(timer);
  };
  const undoDelete = () => {
    if (!deletedSlot) return;
    setDisplayWeek(w => ({ ...w, [deletedSlot.id]: deletedSlot }));
    setDeletedSlot(null);
    if (deleteTimer) clearTimeout(deleteTimer);
    setDeleteTimer(null);
  };

  const doPublish = () => {
    const now = new Date();
    const hhmm = now.toLocaleTimeString('es-PE', { hour:'2-digit', minute:'2-digit' });
    const dd = now.toLocaleDateString('es-PE', { day:'numeric', month:'short' });
    setPublishedAt(`${dd} · ${hhmm}`);
    setPublished(true);
    setConfirmPublish(false);
  };

  const addNewSlot = () => {
    const id = editingSlotId || `custom-${Date.now()}`;
    const newSlot = {
      id,
      day: newSlotForm.dia,
      time: newSlotForm.hora,
      room: newSlotForm.aula,
      lang: newSlotForm.idioma,
      level: newSlotForm.nivel,
      teacher: newSlotForm.asesor || null,
      taken: editingSlotId ? (displayWeek[editingSlotId]?.taken || 0) : 0,
      cap: 7,
    };
    setDisplayWeek(w => {
      const next = editingSlotId ? Object.fromEntries(Object.entries(w).filter(([k]) => k !== editingSlotId)) : {...w};
      return { ...next, [id]: newSlot };
    });
    setSlotAddedToast(`${editingSlotId ? 'Editado' : 'Agregado'}: ${D2.langOf(newSlotForm.idioma).flag} ${newSlotForm.hora} · Aula ${newSlotForm.aula}`);
    setTimeout(() => setSlotAddedToast(null), 3000);
    setShowNewSlot(false);
    setEditingSlotId(null);
    setNewSlotForm({ dia: 'lun', aula: 'A1', hora: '08:30', idioma: 'en', nivel: 'B2', asesor: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <Widget id="next-week" eyebrow="Semana 4 – 9 may" title="Editor de parrilla"
              actions={
                <div style={{ display: 'flex', gap: 6, alignItems:'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => { if (!hasEverCopied) setShowCopyPreview(true); }} disabled={hasEverCopied}>
                    {copied ? '✓ Copiados' : hasEverCopied ? 'Horarios copiados' : 'Copiar de la anterior'}
                  </Button>
                  <Button variant="primary" size="sm" icon={<IconPlus size={13}/>} onClick={() => setShowNewSlot(true)}>Slot nuevo</Button>
                </div>
              }>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
          <LangFilter activeLangs={langFilterP} allLangs={langsInParrilla} onChange={setLangFilterP}/>
          <button onClick={() => setFilterNoTeacherP(f => !f)} style={{
            padding:'4px 10px', fontSize:11, fontWeight:700, borderRadius:999, cursor:'pointer', fontFamily:'inherit',
            border: filterNoTeacherP ? '1.5px solid #F59E0B' : '1px solid var(--border-1)',
            background: filterNoTeacherP ? '#FFF7E0' : 'white',
            color: filterNoTeacherP ? '#B45309' : 'var(--fg-3)',
            display:'flex', alignItems:'center', gap:5,
          }}>
            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:13, height:13, borderRadius:2, background: filterNoTeacherP ? '#F59E0B' : 'var(--neutral-200)', color: filterNoTeacherP ? 'white' : 'var(--fg-4)', fontSize:8, fontWeight:900 }}>!</span>
            {filterNoTeacherP ? 'Mostrando sin asesor' : 'Ver sin asesor'}
          </button>
        </div>
        {langFilterP && (
          <div style={{ padding:'6px 12px', background:'#FFF8EC', border:'1px solid #F5E2B5', borderRadius:6, fontSize:11, color:'#8A6300', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span>Solo se muestran slots de {D2.langOf(langFilterP).flag} {D2.langOf(langFilterP).name}. Los demás siguen programados.</span>
            <button onClick={() => setLangFilterP(null)} style={{ fontSize:11, fontWeight:700, color:'var(--cyan-700)', background:'none', border:'none', cursor:'pointer', padding:'0 4px', fontFamily:'inherit' }}>Ver todos</button>
          </div>
        )}

        {/* Resumen por idioma — arriba de la grilla para diagnóstico rápido */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10, alignItems:'center' }}>
          <span style={{ fontSize:10, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginRight:2 }}>Cobertura:</span>
          {D2.LANGUAGES.map(l => {
            const n = langCounts[l.code] || 0;
            if (n === 0) return null;
            return (
              <span key={l.code} style={{
                display:'inline-flex', alignItems:'center', gap:4,
                padding:'3px 8px', background:'white',
                border:'1px solid var(--border-1)', borderRadius:999, fontSize:11,
              }}>
                {l.flag} <strong>{n}</strong> <span style={{ color:'var(--fg-3)' }}>{l.name}</span>
              </span>
            );
          })}
          <span style={{ marginLeft:'auto', fontSize:11, color: slotsSinAsesor > 0 ? 'var(--amber-700,#92400E)' : 'var(--fg-3)' }}>
            {slotsSinAsesor > 0 ? `⚠ ${slotsSinAsesor} sin asesor` : `${slots.length} slots · todos con asesor`}
          </span>
        </div>

        {/* Toasts */}
        {copied === 'copied' && (
          <div style={{ padding:'8px 14px', background:'#E6F5E9', border:'1px solid #B8E8D2', borderRadius:8, fontSize:12, fontWeight:600, color:'#0A7B47', marginBottom:8 }}>
            ✓ Horarios copiados de la semana anterior — revisa y ajusta lo que necesites.
          </div>
        )}
        {slotAddedToast && (
          <div style={{ padding:'8px 14px', background:'#E6F5E9', border:'1px solid #B8E8D2', borderRadius:8, fontSize:12, fontWeight:600, color:'#0A7B47', marginBottom:8 }}>
            ✓ {slotAddedToast}
          </div>
        )}
        {deletedSlot && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px', background:'#FBE7E7', border:'1px solid #FCA5A5', borderRadius:8, fontSize:12, marginBottom:8 }}>
            <span style={{ color:'var(--red-700)', fontWeight:600 }}>Slot eliminado: {D2.langOf(deletedSlot.lang).flag} {deletedSlot.time} · Aula {deletedSlot.room}</span>
            <button onClick={undoDelete} style={{ fontSize:11, fontWeight:700, color:'var(--red-700)', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', textDecoration:'underline' }}>↩ Deshacer (5s)</button>
          </div>
        )}

        <SlotGrid
          week={displayWeek}
          langFilter={langFilterP}
          filterNoTeacher={filterNoTeacherP}
          mode="edit"
          onSlotRemove={handleSlotRemove}
          onCellClick={(day, time) => {
            const occupied = Object.values(displayWeek).filter(s => s.day === day && s.time === time).map(s => s.room);
            const firstFree = D2.ROOMS.find(r => !occupied.includes(r)) || 'A1';
            setEditingSlotId(null);
            setNewSlotForm(f => ({...f, dia: day, hora: time, aula: firstFree}));
            setShowNewSlot(true);
          }}
          onSlotEdit={s => { setEditingSlotId(s.id); setNewSlotForm({ dia: s.day, aula: s.room, hora: s.time, idioma: s.lang, nivel: s.level, asesor: s.teacher || '' }); setShowNewSlot(true); }}
        />
        <div style={{ marginTop: 8, padding: '7px 12px', background: 'var(--neutral-50)', borderRadius: 6, fontSize: 11, color: 'var(--fg-3)', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:13 }}>ℹ️</span>
          Clic en una celda vacía para agregar · clic en <strong>✕</strong> de un slot para eliminarlo.
        </div>
      </Widget>

      {/* Banner de publicación — debajo del editor, donde termina el trabajo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px',
        background: published ? '#F0FBF7' : '#FFF8EC',
        border: published ? '1px solid #B8E8D2' : '1px solid #F5E2B5',
        borderRadius: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: published ? '#0A7B47' : '#8A6300' }}>
            {published ? '¡Parrilla publicada! Los estudiantes ya pueden reservar.' : 'Parrilla lista para publicar'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
            {published
              ? `Ventana abierta · cierra el viernes a las 18:00${publishedAt ? ` · Publicada ${publishedAt}` : ''}`
              : `${slots.length} clases armadas${slotsSinAsesor > 0 ? ` · ${slotsSinAsesor} sin asesor asignado` : ' · todo listo'} · se publica automáticamente el viernes 1 may a las 9:00`}
          </div>
        </div>
        {!published && !confirmPublish && (
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <Button variant="ghost" size="sm" onClick={() => setConfirmPublish(true)}>Publicar ahora</Button>
            <Button variant="primary" size="sm" onClick={() => setConfirmPublish(true)}>Programar publicación</Button>
          </div>
        )}
        {!published && confirmPublish && (
          <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', flexShrink:0, minWidth:210 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#8A6300' }}>¿Publicar ahora?</div>
            {slotsSinAsesor > 0 && (
              <div style={{ fontSize:11, color:'var(--amber-700,#92400E)', textAlign:'right' }}>
                ⚠ {slotsSinAsesor} slot{slotsSinAsesor > 1 ? 's' : ''} sin asesor — los alumnos verán la clase sin profesor asignado.
              </div>
            )}
            <div style={{ fontSize:11, color:'var(--fg-3)', textAlign:'right' }}>Los estudiantes podrán reservar inmediatamente.</div>
            <div style={{ display:'flex', gap:6 }}>
              <Button variant="ghost" size="sm" onClick={() => setConfirmPublish(false)}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={doPublish}>Sí, publicar</Button>
            </div>
          </div>
        )}
        {published && <Badge tone="success" dot>Publicada</Badge>}
      </div>

      {/* Modal: Confirmar copiar parrilla anterior */}
      {showCopyPreview && (
        <>
          <div onClick={() => setShowCopyPreview(false)} style={{ position:'fixed', inset:0, background:'rgba(2,3,129,0.4)', zIndex:200 }}/>
          <div style={{
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:400, background:'white', borderRadius:16, padding:24, zIndex:201,
            boxShadow:'0 20px 60px rgba(2,3,129,0.2)',
          }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Copiar parrilla anterior</div>
            <div style={{ fontSize:12, color:'var(--fg-2)', lineHeight:1.6, marginBottom:14 }}>
              Se copiarán <strong>{slots.length} slots</strong> (horarios y aulas) de la semana del <strong>27 abr – 2 may</strong> como punto de partida para la semana del <strong>4–9 may</strong>.
            </div>
            <div style={{ padding:'10px 14px', background:'var(--amber-50,#FFF7E0)', border:'1px solid var(--amber-300,#FDD14D)', borderRadius:8, fontSize:12, color:'#8A6300', marginBottom:14 }}>
              Solo se copian <strong>horarios, aulas e idiomas</strong>.<br/>
              <strong>No</strong> se copian alumnos inscritos ni asesores asignados.
            </div>
            <div style={{ fontSize:11, color:'var(--fg-3)', marginBottom:16 }}>
              Idiomas incluidos: {D2.LANGUAGES.filter(l => langCounts[l.code]).map(l => `${l.flag} ${l.name}`).join(' · ')}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Button variant="ghost" block onClick={() => setShowCopyPreview(false)}>Cancelar</Button>
              <Button variant="primary" block onClick={() => {
                setShowCopyPreview(false);
                setDisplayWeek(D2.makeWeek(0));
                setHasEverCopied(true);
                setCopied('copied');
                setTimeout(() => setCopied(false), 3000);
              }}>Sí, copiar horarios</Button>
            </div>
          </div>
        </>
      )}

      {/* Modal: Nuevo slot */}
      {showNewSlot && (
        <>
          <div onClick={() => { setShowNewSlot(false); setEditingSlotId(null); }} style={{ position:'fixed', inset:0, background:'rgba(2,3,129,0.4)', zIndex:200 }}/>
          <div style={{
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:360, background:'white', borderRadius:16, padding:24, zIndex:201,
            boxShadow:'0 20px 60px rgba(2,3,129,0.2)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ fontSize:15, fontWeight:700 }}>{editingSlotId ? 'Editar slot' : 'Agregar slot nuevo'}</div>
              <button onClick={() => { setShowNewSlot(false); setEditingSlotId(null); }} style={{ border:'1px solid var(--border-1)', borderRadius:6, background:'white', width:28, height:28, cursor:'pointer', fontSize:14, color:'var(--fg-3)' }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {/* Día */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Día</div>
                <select value={newSlotForm.dia} onChange={e => setNewSlotForm(f => ({...f, dia: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  {[{v:'lun',l:'Lunes'},{v:'mar',l:'Martes'},{v:'mie',l:'Miércoles'},{v:'jue',l:'Jueves'},{v:'vie',l:'Viernes'},{v:'sab',l:'Sábado'}].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              {/* Horario */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Horario</div>
                <select value={newSlotForm.hora} onChange={e => setNewSlotForm(f => ({...f, hora: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  {['08:30','09:30','10:30','11:30','15:00','16:00','17:00','18:00'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {/* Aula — con detección de conflictos de sala */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Aula</div>
                <select value={newSlotForm.aula} onChange={e => setNewSlotForm(f => ({...f, aula: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border: Object.keys(occupiedAtForm).length > 0 ? '1px solid var(--cyan-300)' : '1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  {D2.ROOMS.map(r => {
                    const conflict = occupiedAtForm[r];
                    return (
                      <option key={r} value={r} disabled={!!conflict && r !== newSlotForm.aula}>
                        {r}{conflict ? ` — ocupada (${conflict})` : ''}
                      </option>
                    );
                  })}
                </select>
                {occupiedAtForm[newSlotForm.aula] && newSlotForm.aula !== (editingSlotId ? displayWeek[editingSlotId]?.room : null) && (
                  <div style={{ marginTop:4, fontSize:11, color:'var(--red-700)', fontWeight:600 }}>
                    ⚠ Aula {newSlotForm.aula} ya tiene {occupiedAtForm[newSlotForm.aula]} a esa hora
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Idioma</div>
                <select value={newSlotForm.idioma} onChange={e => setNewSlotForm(f => ({...f, idioma: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  {D2.LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Nivel</div>
                <select value={newSlotForm.nivel} onChange={e => setNewSlotForm(f => ({...f, nivel: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  {D2.LEVELS.map(l => <option key={l.id} value={l.id}>{l.short} — {l.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Asesor</div>
                <select value={newSlotForm.asesor} onChange={e => setNewSlotForm(f => ({...f, asesor: e.target.value}))}
                  style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                  <option value="">— Sin asignar aún —</option>
                  {D2.TEACHERS.filter(t => t.langs.includes(newSlotForm.idioma)).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:6 }}>
                <Button variant="ghost" block onClick={() => { setShowNewSlot(false); setEditingSlotId(null); }}>Cancelar</Button>
                <Button variant="primary" block onClick={addNewSlot}>{editingSlotId ? 'Guardar cambios' : 'Agregar slot'}</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 3. Asignar asesores — slot ↔ profe disponible
// ──────────────────────────────────────────────────────────────────
function ReservasAsignar() {
  const D2 = window.BELIEVE_DATA;
  const week = D2.makeWeek(1);
  const allSlots = Object.values(week).slice(0, 12); // primeros 12 para demo
  const AVAIL = { t1:'Lun–Vie', t2:'Lun–Sáb', t3:'Mar–Sáb', t4:'Lun–Jue', t5:'Lun–Vie', t6:'Mié–Sáb' };
  const [assignments, setAssignments] = useState_a(() => {
    const a = {};
    allSlots.forEach((s, i) => { if (i % 3 !== 0) a[s.id] = s.teacher; });
    return a;
  });
  const [prevAssignments, setPrevAssignments] = useState_a(null);
  const [canUndo, setCanUndo] = useState_a(false);
  const [undoCountdown, setUndoCountdown] = useState_a(0);
  const [lastAutoCount, setLastAutoCount] = useState_a(0);
  const [langFilterA, setLangFilterA] = useState_a(null);
  const [bulkByLang, setBulkByLang] = useState_a({});
  const [bulkToasts, setBulkToasts] = useState_a({});

  React.useEffect(() => {
    if (!canUndo) return;
    const interval = setInterval(() => {
      setUndoCountdown(c => {
        if (c <= 1) { clearInterval(interval); setCanUndo(false); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [canUndo]);

  const unassigned = allSlots.filter(s => !assignments[s.id]).length;
  const langsInAsignar = D2.LANGUAGES.filter(l => allSlots.some(s => s.lang === l.code));
  const slots = langFilterA ? allSlots.filter(s => s.lang === langFilterA) : allSlots;

  const assignBulk = (langCode) => {
    const teacherId = bulkByLang[langCode];
    if (!teacherId) return;
    const newA = { ...assignments };
    let count = 0;
    allSlots.filter(s => s.lang === langCode && !newA[s.id]).forEach(s => {
      newA[s.id] = teacherId; count++;
    });
    setAssignments(newA);
    setBulkToasts(t => ({ ...t, [langCode]: count }));
    setTimeout(() => setBulkToasts(t => { const n = {...t}; delete n[langCode]; return n; }), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <StatTile label="Slots de la semana" value={allSlots.length}/>
        <StatTile label="Asesores asignados" value={allSlots.length - unassigned}/>
        <StatTile label="Sin asignar" value={unassigned} tone={unassigned > 0 ? 'down' : undefined}/>
      </div>

      {/* Estrategia 1: Asignación masiva por idioma */}
      <Widget id="bulk-lang-assign" eyebrow="Paso 1 · Estrategia rápida" title="Asignar por idioma">
        <div style={{ fontSize:12, color:'var(--fg-3)', marginBottom:12, lineHeight:1.5 }}>
          Elige un asesor y asígnalo de golpe a <strong>los slots sin asesor de un idioma</strong>. No reemplaza asignaciones ya confirmadas. Ajusta en la tabla si hay excepciones.
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {langsInAsignar.map(lang => {
            const langSlots = allSlots.filter(s => s.lang === lang.code);
            const assigned = langSlots.filter(s => assignments[s.id]).length;
            const eligible = D2.TEACHERS.filter(t => t.langs.includes(lang.code));
            const allDone = assigned === langSlots.length;
            return (
              <div key={lang.code} style={{
                display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:10, alignItems:'center',
                padding:'10px 12px', border:'1px solid var(--border-1)', borderRadius:8,
                background: allDone ? 'var(--neutral-50)' : 'white',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:18 }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{lang.name}</div>
                    <div style={{ fontSize:10, color: allDone ? '#0A7B47' : 'var(--fg-3)' }}>
                      {allDone ? `✓ ${langSlots.length}/${langSlots.length} asignados` : `${assigned}/${langSlots.length} asignados · ${langSlots.length - assigned} pendiente${langSlots.length - assigned !== 1 ? 's' : ''}`}
                    </div>
                    {bulkToasts[lang.code] && (
                      <div style={{ fontSize:10, color:'#0A7B47', fontWeight:700 }}>✓ {bulkToasts[lang.code]} slots asignados</div>
                    )}
                  </div>
                </div>
                <select
                  value={bulkByLang[lang.code] || ''}
                  onChange={e => setBulkByLang(b => ({...b, [lang.code]: e.target.value}))}
                  style={{ padding:'7px 8px', borderRadius:7, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:12, background:'white' }}>
                  <option value="">— Elegir asesor —</option>
                  {eligible.map(t => <option key={t.id} value={t.id}>{t.name} · {AVAIL[t.id]||'Disponible'}</option>)}
                </select>
                <Button variant="primary" size="sm"
                  disabled={!bulkByLang[lang.code]}
                  onClick={() => assignBulk(lang.code)}>
                  Asignar todos
                </Button>
              </div>
            );
          })}
        </div>
      </Widget>

      {/* Estrategia 2: Auto-asignación con IA */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', background: 'var(--cyan-50)',
        border: '1px solid var(--cyan-200)', borderRadius: 12,
      }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', flexShrink:0 }}>Paso 2</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan-700)' }}>Auto-asignación inteligente</div>
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
            Completa los slots aún sin asesor automáticamente según disponibilidad y carga balanceada.
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
          {canUndo && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', background:'var(--neutral-50)', border:'1px solid var(--border-1)', borderRadius:8, fontSize:12 }}>
              <span style={{ color:'var(--fg-2)' }}>Se asignaron <strong>{lastAutoCount}</strong> asesores</span>
              <button
                onClick={() => { setAssignments(prevAssignments); setCanUndo(false); setUndoCountdown(0); setPrevAssignments(null); }}
                style={{ padding:'4px 10px', fontSize:11, fontWeight:700, border:'1px solid var(--border-1)', borderRadius:6, background:'white', cursor:'pointer', fontFamily:'inherit', color:'var(--fg-2)', display:'flex', alignItems:'center', gap:4 }}>
                ↩ Deshacer <span style={{ color:'var(--fg-4)', fontWeight:400 }}>({undoCountdown}s)</span>
              </button>
            </div>
          )}
          <Button variant="primary" size="sm" onClick={() => {
            const snapshot = { ...assignments };
            const newA = { ...assignments };
            let count = 0;
            allSlots.forEach(s => {
              if (!newA[s.id]) {
                const eligible = D2.TEACHERS.filter(t => t.langs.includes(s.lang));
                if (eligible.length) { newA[s.id] = eligible[Math.floor(Math.random() * eligible.length)].id; count++; }
              }
            });
            if (count === 0) return;
            setPrevAssignments(snapshot);
            setAssignments(newA);
            setLastAutoCount(count);
            setUndoCountdown(30);
            setCanUndo(true);
          }}>Auto-asignar restantes</Button>
        </div>
      </div>

      {/* Estrategia 3: Ajuste fino slot a slot */}
      <Widget id="assignment" eyebrow="Paso 3 · Ajuste fino" title="Revisión individual de slots"
              actions={
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <LangFilter activeLangs={langFilterA} allLangs={langsInAsignar} onChange={setLangFilterA}/>
                  <Badge tone={unassigned > 0 ? 'warning' : 'success'}>{unassigned > 0 ? `${unassigned} sin asignar` : 'Todo asignado'}</Badge>
                </div>
              }>
        <div style={{ fontSize:11, color:'var(--fg-3)', marginBottom:8 }}>Usa las estrategias de arriba para asignar en bloque · aquí solo ajusta excepciones.</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-1)' }}>
              {['Día','Hora','Aula','Idioma · Nivel','Cupos','Asesor', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 6px', fontSize: 11,
                  color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((s) => {
              const lang = D2.langOf(s.lang);
              const lvl  = D2.levelOf(s.level);
              const teacher = assignments[s.id] ? D2.teacherOf(assignments[s.id]) : null;
              const dayLabel = { lun:'Lun', mar:'Mar', mie:'Mié', jue:'Jue', vie:'Vie', sab:'Sáb' }[s.day];
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: 600, color: 'var(--fg-2)' }}>{dayLabel}</td>
                  <td style={{ padding: '10px 6px', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{s.time}</td>
                  <td style={{ padding: '10px 6px', color: 'var(--fg-3)' }}>{s.room}</td>
                  <td style={{ padding: '10px 6px' }}>
                    <span style={{ marginRight: 6 }}>{lang.flag}</span>
                    <span style={{ fontWeight: 600 }}>{lvl.short}</span>
                    <span style={{ color: 'var(--fg-3)', fontSize: 11, marginLeft: 6 }}>{lang.name}</span>
                  </td>
                  <td style={{ padding: '10px 6px', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-3)' }}>{s.taken}/{s.cap}</td>
                  <td style={{ padding: '10px 6px' }}>
                    <select
                      value={assignments[s.id] || ''}
                      onChange={e => setAssignments({ ...assignments, [s.id]: e.target.value || undefined })}
                      style={{
                        padding: '6px 8px', borderRadius: 6,
                        border: assignments[s.id] ? '1px solid var(--border-1)' : '1px solid #F5E2B5',
                        background: assignments[s.id] ? 'white' : '#FFF8EC',
                        fontFamily: 'inherit', fontSize: 12, color: 'var(--fg-1)', minWidth: 160,
                        cursor: 'pointer',
                      }}>
                      <option value="">— Sin asignar —</option>
                      {D2.TEACHERS.filter(t => t.langs.includes(s.lang)).map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} — {AVAIL[t.id] || 'Disponible'}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 6px' }}>
                    {teacher && <Badge tone="success" dot>OK</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Widget>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SlotGrid compartido — "Class Card" design
// Cada celda = contenedor de tarjetas. Cada clase paralela = 1 card.
// Max 3 visibles por defecto; expandible con "+ N más".
// Mañana y tarde separados visualmente. Hover lift en tarjetas.
// ──────────────────────────────────────────────────────────────────
const ROOM_COLORS = { A1:'#0693E3', A2:'#020381', A3:'#FCB900', A4:'#CF2E2E' };
const MAX_VISIBLE = 4; // max 4 aulas → el expand "+ N más" nunca aparece en práctica

function SlotGrid({ week, mode = 'monitor', langFilter = null, filterNoTeacher = false, onSlotClick, onSlotRemove, onCellClick, onSlotEdit }) {
  const D2 = window.BELIEVE_DATA;
  const [expandedCells, setExpandedCells] = useState_a({});
  const [confirmDeleteId, setConfirmDeleteId] = useState_a(null);
  const MORNING   = ['08:30','09:30','10:30','11:30'];
  const AFTERNOON = ['15:00','16:00','17:00','18:00'];
  const DAYS_KEYS = ['lun','mar','mie','jue','vie','sab'];
  const dayLabels = { lun:'Lun', mar:'Mar', mie:'Mié', jue:'Jue', vie:'Vie', sab:'Sáb' };
  const dates = { lun: 4, mar: 5, mie: 6, jue: 7, vie: 8, sab: 9 };
  const toggleExpand = (key) => setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));

  const byCell = {};
  Object.values(week).forEach(s => {
    const k = `${s.day}-${s.time}`;
    (byCell[k] = byCell[k] || []).push(s);
  });

  // ── renderCard — tarjeta de una clase. Llamada como función, no como componente JSX. ──
  const renderCard = (s, ghosted) => {
    const lang     = D2.langOf(s.lang);
    const lvl      = D2.levelOf(s.level);
    const teacher  = D2.teacherOf(s.teacher);
    const noTeacher = !s.teacher;
    const roomColor = ROOM_COLORS[s.room] || '#888';
    const pct = s.taken / s.cap;
    const countColor = pct >= 1 ? '#CF2E2E' : pct >= 0.7 ? '#D97706' : 'var(--fg-3)';
    const barColor   = pct >= 1 ? '#CF2E2E' : pct >= 0.7 ? '#F59E0B' : '#0693E3';
    const isConfirmingDelete = confirmDeleteId === s.id;

    if (ghosted) {
      return (
        <div key={`g-${s.id}`} style={{
          padding:'7px 9px', borderRadius:7,
          border:'1px solid var(--neutral-200)',
          borderLeft:`3px solid ${roomColor}`,
          background:'var(--neutral-50)', opacity:0.32,
          fontSize:12, color:'var(--fg-4)', userSelect:'none',
        }}>
          <span style={{ marginRight:5 }}>{lang.flag}</span>{lang.name}
          <span style={{ marginLeft:6, fontSize:10 }}>{s.room}</span>
        </div>
      );
    }

    return (
      <div key={s.id} style={{ position:'relative' }}>
        <div
          title={`${lang.name} ${lvl.name} · Aula ${s.room} · ${s.taken}/${s.cap} · ${teacher?.name || 'Sin asesor'}`}
          onClick={() => {
            if (isConfirmingDelete) return;
            if (onSlotClick) onSlotClick(s);
            else if (onSlotEdit) onSlotEdit(s);
          }}
          style={{
            padding:'8px 10px', borderRadius:8,
            border:'1px solid var(--border-1)',
            borderLeft:`3px solid ${roomColor}`,
            background: noTeacher ? '#FFFBEB' : 'white',
            cursor: (onSlotClick || onSlotEdit) ? 'pointer' : 'default',
            transition:'box-shadow 120ms, transform 120ms',
            position:'relative',
          }}
          onMouseEnter={e => {
            if (!(onSlotClick || onSlotEdit)) return;
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.10)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = '';
          }}>
          {/* Fila 1: warn + room + flag + lang */}
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:5 }}>
            {noTeacher && (
              <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:15, height:15, borderRadius:3, background:'#F59E0B', color:'white', fontSize:9, fontWeight:900, flexShrink:0 }}>!</span>
            )}
            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', minWidth:22, height:18, paddingLeft:4, paddingRight:4, borderRadius:4, background:roomColor, color: s.room === 'A3' ? '#5C4100' : 'white', fontSize:10, fontWeight:800, flexShrink:0 }}>{s.room}</span>
            <span style={{ fontSize:14, lineHeight:1, flexShrink:0 }}>{lang.flag}</span>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--fg-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{lang.name}</span>
          </div>
          {/* Fila 2: nivel + barra + conteo */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontSize:11, color:'var(--fg-4)', flexShrink:0, minWidth:36 }}>{lvl.short}</span>
            <div style={{ flex:1, height:4, background:'var(--neutral-100)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ width:`${Math.min(pct*100,100)}%`, height:'100%', borderRadius:2, background:barColor }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:countColor, fontVariantNumeric:'tabular-nums', flexShrink:0 }}>{s.taken}/{s.cap}</span>
          </div>
          {/* Fila 3: asesor (con tooltip para nombres truncados) */}
          <div title={noTeacher ? 'Sin asesor asignado' : teacher?.name} style={{ fontSize:11, color: noTeacher ? '#B45309' : 'var(--fg-3)', fontWeight: noTeacher ? 700 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {noTeacher ? 'Sin asesor asignado' : teacher?.name}
          </div>
          {/* Edit mode: delete */}
          {mode === 'edit' && onSlotRemove && (
            <button onClick={e => { e.stopPropagation(); setConfirmDeleteId(s.id); }} title="Eliminar clase"
              style={{ position:'absolute', top:6, right:6, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--neutral-100)', border:'1px solid var(--border-1)', borderRadius:4, cursor:'pointer', color:'var(--fg-3)', fontSize:10, fontWeight:900 }}>✕</button>
          )}
        </div>
        {isConfirmingDelete && (
          <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:20, background:'white', border:'1px solid #FCA5A5', borderRadius:8, padding:'10px 12px', boxShadow:'0 6px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ fontWeight:700, color:'var(--red-700)', marginBottom:8, fontSize:12 }}>¿Eliminar esta clase?</div>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={() => { onSlotRemove(s.id); setConfirmDeleteId(null); }}
                style={{ flex:1, padding:'5px 0', background:'#CF2E2E', color:'white', border:'none', borderRadius:5, cursor:'pointer', fontFamily:'inherit', fontSize:11, fontWeight:700 }}>Sí, eliminar</button>
              <button onClick={() => setConfirmDeleteId(null)}
                style={{ flex:1, padding:'5px 0', background:'var(--neutral-100)', color:'var(--fg-2)', border:'none', borderRadius:5, cursor:'pointer', fontFamily:'inherit', fontSize:11 }}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── renderHourRow — una fila completa del grid (1 hora × 6 días) ──
  const renderHourRow = (h) => (
    <React.Fragment key={h}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'flex-end', paddingRight:8, paddingTop:14, fontSize:11, color:'var(--fg-3)', fontWeight:700, fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>{h}</div>

      {DAYS_KEYS.map(dk => {
        const key          = `${dk}-${h}`;
        const cellSlots    = byCell[key] || [];
        const visibleSlots = langFilter ? cellSlots.filter(s => s.lang === langFilter) : cellSlots;
        const ghostSlots   = langFilter ? cellSlots.filter(s => s.lang !== langFilter) : [];
        const isEmpty      = cellSlots.length === 0;
        const isExpanded   = !!expandedCells[key];
        const shownSlots   = isExpanded ? visibleSlots : visibleSlots.slice(0, MAX_VISIBLE);
        const hiddenCount  = visibleSlots.length - MAX_VISIBLE;
        const cellHasMissingTeacher = cellSlots.some(s => !s.teacher);
        const dimByFilter  = filterNoTeacher && !isEmpty && !cellHasMissingTeacher;

        return (
          <div key={dk} style={{ padding:3, transition:'opacity 150ms', opacity: dimByFilter ? 0.15 : 1 }}>
            {isEmpty ? (
              <div onClick={() => onCellClick && onCellClick(dk, h)}
                style={{ minHeight:64, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px dashed var(--neutral-200)', borderRadius:8, cursor: onCellClick ? 'pointer' : 'default', color:'var(--neutral-300)', fontSize:22, fontWeight:200, background: onCellClick ? 'var(--neutral-50)' : 'transparent', transition:'all 80ms', userSelect:'none' }}
                onMouseEnter={e => { if (onCellClick) { e.currentTarget.style.background='var(--cyan-50)'; e.currentTarget.style.color='var(--cyan-400)'; e.currentTarget.style.borderColor='var(--cyan-300)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = onCellClick ? 'var(--neutral-50)' : 'transparent'; e.currentTarget.style.color='var(--neutral-300)'; e.currentTarget.style.borderColor='var(--neutral-200)'; }}>
                {onCellClick ? '+' : ''}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {shownSlots.map(s => renderCard(s, false))}
                {ghostSlots.length > 0 && (
                  <div style={{ padding:'5px 8px', borderRadius:6, background:'var(--neutral-100)', border:'1px solid var(--neutral-200)', fontSize:10, color:'var(--fg-4)', fontStyle:'italic', textAlign:'center' }}>
                    {ghostSlots.length} clase{ghostSlots.length > 1 ? 's' : ''} · otro idioma
                  </div>
                )}
                {hiddenCount > 0 && !isExpanded && (
                  <button onClick={() => toggleExpand(key)} style={{ padding:'5px 8px', borderRadius:6, fontSize:10, fontWeight:700, color:'var(--cyan-700)', background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', cursor:'pointer', fontFamily:'inherit', textAlign:'center', width:'100%' }}>+ {hiddenCount} más</button>
                )}
                {isExpanded && visibleSlots.length > MAX_VISIBLE && (
                  <button onClick={() => toggleExpand(key)} style={{ padding:'5px 8px', borderRadius:6, fontSize:10, fontWeight:700, color:'var(--fg-3)', background:'var(--neutral-50)', border:'1px solid var(--border-1)', cursor:'pointer', fontFamily:'inherit', textAlign:'center', width:'100%' }}>Ver menos ↑</button>
                )}
                {cellSlots.length < 4 && onCellClick && (
                  <button onClick={() => onCellClick(dk, h)} style={{ padding:'5px 8px', borderRadius:6, fontSize:10, fontWeight:700, color:'var(--cyan-600)', background:'transparent', border:'1.5px dashed var(--cyan-300)', cursor:'pointer', fontFamily:'inherit', textAlign:'center', width:'100%' }}>+ Aula libre</button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </React.Fragment>
  );

  return (
    <div>
      {/* Cabecera de días */}
      <div style={{ display:'grid', gridTemplateColumns:'56px repeat(6, 1fr)', gap:4, marginBottom:6 }}>
        <div/>
        {DAYS_KEYS.map(dk => (
          <div key={dk} style={{ textAlign:'center', padding:'7px 4px 10px', borderRadius:8, background:'var(--neutral-50)', border:'1px solid var(--border-1)' }}>
            <div style={{ fontSize:10, color:'var(--fg-4)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>{dayLabels[dk]}</div>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--fg-1)', marginTop:2 }}>{dates[dk]}</div>
          </div>
        ))}
      </div>

      {/* Bloque mañana */}
      <div style={{ display:'grid', gridTemplateColumns:'56px repeat(6, 1fr)', gap:4, alignItems:'start' }}>
        {MORNING.map(h => renderHourRow(h))}
      </div>

      {/* Separador mañana / tarde */}
      <div style={{ display:'flex', alignItems:'center', gap:10, margin:'12px 0 10px', paddingLeft:56 }}>
        <div style={{ flex:1, height:1, background:'var(--neutral-200)' }}/>
        <span style={{ fontSize:10, fontWeight:700, color:'var(--fg-4)', textTransform:'uppercase', letterSpacing:'0.1em', flexShrink:0 }}>Tarde</span>
        <div style={{ flex:1, height:1, background:'var(--neutral-200)' }}/>
      </div>

      {/* Bloque tarde */}
      <div style={{ display:'grid', gridTemplateColumns:'56px repeat(6, 1fr)', gap:4, alignItems:'start' }}>
        {AFTERNOON.map(h => renderHourRow(h))}
      </div>
    </div>
  );
}

function EstudiantesTab() {
  const rows = [
    { name: 'Sebastián Ríos', prog: '🇬🇧 English B2', cycle: '5 de c/mes', status: 'Al día' },
    { name: 'Lucía Mendoza', prog: '🇫🇷 Français A2', cycle: '15 de c/mes', status: 'Al día' },
    { name: 'Diego Ortiz', prog: '🇯🇵 Japonés A1', cycle: '5 de c/mes', status: 'Pendiente' },
    { name: 'Camila Soto', prog: '🇨🇳 Mandarín A1', cycle: '10 de c/mes', status: 'Vencido' },
    { name: 'Andrés Quispe', prog: '🇩🇪 Deutsch B1', cycle: '5 de c/mes', status: 'Al día' },
  ];
  return (
    <Widget id="students" title="84 estudiantes activos"
            actions={<Button variant="primary" size="sm" icon={<IconPlus size={13}/>}>Nuevo</Button>}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-1)' }}>
            {['Nombre','Programa','Ciclo pago','Estado',''].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 6px', fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const tone = r.status === 'Vencido' ? 'danger' : r.status === 'Pendiente' ? 'warning' : 'success';
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                <td style={{ padding: '10px 6px', fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '10px 6px', color: 'var(--fg-2)' }}>{r.prog}</td>
                <td style={{ padding: '10px 6px', color: 'var(--fg-3)' }}>{r.cycle}</td>
                <td style={{ padding: '10px 6px' }}><Badge tone={tone} dot>{r.status}</Badge></td>
                <td style={{ padding: '10px 6px' }}><Button variant="ghost" size="sm">Ver</Button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Widget>
  );
}

function PagosTab() {
  return (
    <Widget id="payments" title="Cobros abril 2026">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        <StatTile label="Cobrado" value="S/ 22,180"/>
        <StatTile label="Pendiente" value="S/ 4,820"/>
        <StatTile label="Vencido" value="S/ 1,560" tone="down"/>
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
        Filtros: fecha · método · estado · estudiante — (placeholder — se expande)
      </div>
    </Widget>
  );
}

function ProfesoresTab() {
  return (
    <Widget id="teachers" title="Profesores">
      <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>Asignación, horarios, pagos por hora — placeholder.</div>
    </Widget>
  );
}

function ExcelTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Widget id="excel-import" eyebrow="Migración desde Excel" title="Sube tu Excel actual">
        <div style={{
          border: '2px dashed var(--cyan-300)', borderRadius: 10, padding: 28, textAlign: 'center',
          background: 'var(--cyan-50)',
        }}>
          <IconUpload size={28}/>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Arrastra tu .xlsx aquí</div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
            O da click para buscar · soportamos múltiples hojas · mapeamos columnas automáticamente
          </div>
          <Button variant="primary" size="sm" style={{ marginTop: 14 }}>Seleccionar archivo</Button>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Estudiantes', desc: 'Nombre, contacto, programa, ciclo de pago' },
            { label: 'Horarios', desc: 'Semana actual con aula y profesor' },
            { label: 'Pagos históricos', desc: 'Qué pagó cada uno el mes pasado' },
          ].map((x, i) => (
            <div key={i} style={{ padding: 10, border: '1px solid var(--border-1)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{x.label}</div>
              <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>{x.desc}</div>
            </div>
          ))}
        </div>
      </Widget>

      <Widget id="excel-export" eyebrow="Exportar" title="Descarga tus datos cuando quieras">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {[
            'Lista completa de estudiantes (con pagos)',
            'Horarios publicados · esta semana',
            'Asistencia abril 2026',
            'Cobros abril 2026',
          ].map((x, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', border: '1px solid var(--border-1)', borderRadius: 8,
            }}>
              <div style={{ fontSize: 13 }}>{x}</div>
              <Button variant="ghost" size="sm">Descargar .xlsx</Button>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 14, padding: 12, background: 'var(--amber-50, #FFF7E0)',
          border: '1px solid var(--amber-300, #FDD14D)', borderRadius: 8,
          fontSize: 12, color: '#8A6300', lineHeight: 1.5,
        }}>
          <strong>Modo tranquilidad:</strong> durante 3 meses después de migrar, te llega un excel semanal automático al correo con todos tus datos. Nunca los pierdes.
        </div>
      </Widget>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SlotDrawer — drawer lateral al hacer click en un slot del monitor
// Muestra: detalle del slot + roster de alumnos + acciones
// ──────────────────────────────────────────────────────────────────
function SlotDrawer({ slot, onClose }) {
  const D2 = window.BELIEVE_DATA;
  const lang = D2.langOf(slot.lang);
  const lvl  = D2.levelOf(slot.level);
  const dayNames = { lun:'Lunes', mar:'Martes', mie:'Miércoles', jue:'Jueves', vie:'Viernes', sab:'Sábado' };

  // Roster mock determinístico basado en taken del slot
  const ALL_STUDENTS = [
    'Sebastián Ríos', 'Lucía Mendoza', 'Diego Ortiz',
    'Camila Soto', 'Andrés Quispe', 'Valentina Cruz', 'Matías León',
  ];
  const [roster, setRoster] = useState_a(ALL_STUDENTS.slice(0, slot.taken));
  const [moveTarget, setMoveTarget] = useState_a(null);
  const [moveDestSlot, setMoveDestSlot] = useState_a(null);
  const [moveConfirmed, setMoveConfirmed] = useState_a(null);
  const [cancelPending, setCancelPending] = useState_a(false);
  const [expandedNote, setExpandedNote] = useState_a(null);
  const [notes, setNotes] = useState_a({});
  const [changingAsesor, setChangingAsesor] = useState_a(false);
  const [displayTeacherId, setDisplayTeacherId] = useState_a(slot.teacher);
  const [newAsesorId, setNewAsesorId] = useState_a('');
  const [cambioMotivo, setCambioMotivo] = useState_a('');
  const [cambioMotivoTexto, setCambioMotivoTexto] = useState_a('');
  const [asesorLog, setAsesorLog] = useState_a(null);

  const currentTeacher = D2.teacherOf(displayTeacherId);
  const availDestSlots = Object.values(D2.makeWeek(0)).filter(s =>
    s.lang === slot.lang && s.taken < s.cap && s.id !== slot.id
  );

  const removeStudent = (name) => setRoster(r => r.filter(s => s !== name));

  const confirmMove = () => {
    const destName = moveDestSlot
      ? `${({lun:'Lun',mar:'Mar',mie:'Mié',jue:'Jue',vie:'Vie',sab:'Sáb'})[moveDestSlot.day]} ${moveDestSlot.time} · Aula ${moveDestSlot.room}`
      : '';
    removeStudent(moveTarget);
    setMoveConfirmed(`${moveTarget} → ${destName}`);
    setMoveTarget(null);
    setMoveDestSlot(null);
    setTimeout(() => setMoveConfirmed(null), 4000);
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(2,3,129,0.35)', zIndex:200 }}/>
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:420, zIndex:201,
        background:'white', borderLeft:'1px solid var(--border-1)',
        display:'flex', flexDirection:'column', overflow:'hidden',
        animation:'slideIn 160ms ease',
      }}>
        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border-1)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'white' }}>
          <Eyebrow>Detalle del slot</Eyebrow>
          <button onClick={onClose} style={{ border:'1px solid var(--border-1)', borderRadius:6, background:'white', width:30, height:30, cursor:'pointer', fontSize:15, color:'var(--fg-3)' }}>✕</button>
        </div>

        {/* Identity card */}
        <div style={{ padding:'18px 22px', background:'var(--indigo-500)', color:'white' }}>
          <div style={{ fontSize:10, opacity:0.7, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
            {dayNames[slot.day]} · {slot.time}
          </div>
          <div style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.02em', marginTop:4, fontFamily:'var(--font-mono)' }}>
            Aula {slot.room}
          </div>
          <div style={{ fontSize:13, opacity:0.9, marginTop:6, display:'flex', gap:10, flexWrap:'wrap' }}>
            <span>{lang.flag} {lang.name}</span>
            <span>·</span>
            <span>{lvl.name}</span>
            <span>·</span>
            <span style={{ fontWeight:700 }}>{roster.length}/{slot.cap} alumnos</span>
          </div>
          <div style={{ marginTop:8 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
              <div style={{ fontSize:11, opacity:0.7 }}>
                Asesor: <span style={{ fontWeight: asesorLog ? 700 : 400 }}>{currentTeacher.name}</span>
                {asesorLog && <span style={{ marginLeft:6, fontSize:10, color:'#FCB900', fontWeight:700 }}>· Cambiado hoy</span>}
              </div>
              <button onClick={() => { setChangingAsesor(true); setNewAsesorId(''); setCambioMotivo(''); setCambioMotivoTexto(''); }}
                style={{ fontSize:10, fontWeight:700, background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.35)', borderRadius:6, color:'white', padding:'4px 10px', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                ↻ Cambiar asesor
              </button>
            </div>
          </div>
          {/* Barra de ocupación */}
          <div style={{ marginTop:12, height:4, background:'rgba(255,255,255,0.2)', borderRadius:2 }}>
            <div style={{ height:'100%', width:`${(roster.length/slot.cap)*100}%`, background: roster.length >= slot.cap ? 'var(--red-400)' : '#FCB900', borderRadius:2, transition:'width 300ms' }}/>
          </div>
        </div>

        {/* Roster */}
        <div style={{ flex:1, overflow:'auto', padding:'16px 22px' }}>
          {asesorLog && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:'var(--amber-50,#FFF7E0)', border:'1px solid var(--amber-300,#FDD14D)', borderRadius:7, fontSize:11, color:'#8A6300', marginBottom:10 }}>
              <span style={{ fontWeight:700 }}>Cambio de asesor:</span>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11 }}>{asesorLog}</span>
            </div>
          )}
          <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
            Alumnos inscritos
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {roster.map((name, i) => (
              <div key={i} style={{ border:`1px solid ${moveTarget===name ? 'var(--cyan-300)' : 'var(--border-1)'}`, borderRadius:8, overflow:'hidden' }}>
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'8px 12px',
                  background: moveTarget === name ? 'var(--cyan-50)' : 'white',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar name={name} size={28}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{name}</div>
                      <div style={{ fontSize:10, color: notes[name] ? 'var(--cyan-700)' : 'var(--fg-3)' }}>
                        {notes[name] ? `Nota: ${notes[name].slice(0,30)}${notes[name].length>30?'…':''}` : 'Confirmado'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    <button
                      onClick={() => setExpandedNote(expandedNote === name ? null : name)}
                      title="Agregar nota interna"
                      style={{ padding:'3px 8px', fontSize:10, border:'1px solid var(--border-1)', borderRadius:4, background: expandedNote===name||notes[name] ? 'var(--cyan-50)' : 'white', color:'var(--cyan-700)', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                      {notes[name] ? 'Nota ✓' : 'Nota'}
                    </button>
                    <button
                      onClick={() => setMoveTarget(moveTarget === name ? null : name)}
                      title="Mover a otro slot"
                      style={{ padding:'3px 8px', fontSize:10, border:'1px solid var(--border-1)', borderRadius:4, background: moveTarget === name ? 'var(--cyan-500)' : 'white', color: moveTarget === name ? 'white' : 'var(--fg-2)', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                      Mover
                    </button>
                    <button
                      onClick={() => removeStudent(name)}
                      title="Quitar del slot"
                      style={{ padding:'3px 8px', fontSize:10, border:'1px solid var(--border-1)', borderRadius:4, background:'white', color:'var(--red-700)', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
                      ✕
                    </button>
                  </div>
                </div>
                {expandedNote === name && (
                  <div style={{ padding:'8px 12px', borderTop:'1px solid var(--neutral-100)', background:'var(--neutral-50)' }}>
                    <div style={{ padding:'6px 10px', background:'#FFF8EC', border:'1px solid #F5E2B5', borderRadius:6, fontSize:11, color:'#8A6300', marginBottom:8 }}>
                      Esta nota es temporal — no se guarda al cerrar este panel.
                    </div>
                    <textarea
                      value={notes[name] || ''}
                      onChange={e => setNotes(n => ({...n, [name]: e.target.value}))}
                      placeholder="Nota interna (llega tarde, nivel adelantado, etc.)"
                      style={{ width:'100%', padding:'6px 8px', fontSize:11, border:'1px solid var(--border-1)', borderRadius:6, fontFamily:'inherit', resize:'vertical', minHeight:48, boxSizing:'border-box' }}
                    />
                    <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4 }}>
                      <button onClick={() => setExpandedNote(null)} style={{ fontSize:11, color:'var(--cyan-700)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                        Cerrar ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Cupos disponibles */}
            {Array.from({ length: slot.cap - roster.length }).map((_, i) => (
              <div key={'empty-'+i} style={{
                padding:'8px 12px', border:'1px dashed var(--cyan-200)', borderRadius:8,
                textAlign:'center', fontSize:12, color:'var(--cyan-600)', fontWeight:500,
                background:'var(--cyan-50)', cursor:'pointer',
              }}>
                + Cupo libre — agregar alumno
              </div>
            ))}
          </div>

          {/* Move confirmed toast */}
          {moveConfirmed && (
            <div style={{ marginTop:14, padding:'10px 14px', background:'#E6F5E9', border:'1px solid #B8E8D2', borderRadius:8, fontSize:12, fontWeight:600, color:'#0A7B47' }}>
              ✓ {moveConfirmed} — traslado registrado
            </div>
          )}
        </div>

        {/* Modal: Cambiar asesor urgente */}
        {changingAsesor && (
          <>
            <div onClick={() => setChangingAsesor(false)} style={{ position:'fixed', inset:0, background:'rgba(2,3,129,0.4)', zIndex:300 }}/>
            <div style={{
              position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              width:380, background:'white', borderRadius:16, padding:24, zIndex:301,
              boxShadow:'0 20px 60px rgba(2,3,129,0.25)',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:800 }}>Cambiar asesor</div>
                  <div style={{ fontSize:11, color:'var(--fg-3)', marginTop:2 }}>{lang.flag} {lang.name} · {dayNames[slot.day]} {slot.time} · Aula {slot.room}</div>
                </div>
                <button onClick={() => setChangingAsesor(false)} style={{ border:'1px solid var(--border-1)', borderRadius:6, background:'white', width:28, height:28, cursor:'pointer', fontSize:14, color:'var(--fg-3)' }}>✕</button>
              </div>
              <div style={{ padding:'8px 12px', background:'#FFF8EC', border:'1px solid #F5E2B5', borderRadius:8, fontSize:12, color:'#8A6300', marginBottom:14, lineHeight:1.5 }}>
                Asesor actual: <strong>{currentTeacher.name}</strong>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>Nuevo asesor</div>
                  <select value={newAsesorId} onChange={e => setNewAsesorId(e.target.value)}
                    style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                    <option value="">— Seleccionar —</option>
                    {D2.TEACHERS.filter(t => t.langs.includes(slot.lang) && t.id !== displayTeacherId).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>Motivo <span style={{ fontWeight:400, textTransform:'none' }}>(opcional)</span></div>
                  <select value={cambioMotivo} onChange={e => setCambioMotivo(e.target.value)}
                    style={{ width:'100%', padding:'9px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:13, background:'white' }}>
                    <option value="">— Seleccionar motivo —</option>
                    <option value="enfermedad">Docente enfermo</option>
                    <option value="emergencia">Emergencia personal</option>
                    <option value="horario">Cambio de horario propio</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                {cambioMotivo && (
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>Detalles adicionales (opcional)</div>
                    <textarea value={cambioMotivoTexto} onChange={e => setCambioMotivoTexto(e.target.value)}
                      placeholder="Ej. fiebre 38° — ingresó hoy a urgencias"
                      style={{ width:'100%', padding:'8px 10px', borderRadius:8, border:'1px solid var(--border-1)', fontFamily:'inherit', fontSize:12, resize:'vertical', minHeight:52, boxSizing:'border-box' }}/>
                  </div>
                )}
                {newAsesorId && (
                  <div style={{ padding:'10px 12px', background:'#FFF8EC', border:'1px solid #F5E2B5', borderRadius:8, fontSize:12, color:'#8A6300', lineHeight:1.5 }}>
                    Recuerda notificar manualmente a los <strong>{roster.length} alumno{roster.length !== 1 ? 's' : ''}</strong> inscritos que el asesor cambiará a <strong>{D2.teacherOf(newAsesorId).name}</strong>.
                  </div>
                )}
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <Button variant="ghost" block onClick={() => setChangingAsesor(false)}>Cancelar</Button>
                  <Button variant="primary" block
                    disabled={!newAsesorId}
                    onClick={() => {
                      const logEntry = `${new Date().toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'})} · Cambiado a ${D2.teacherOf(newAsesorId).name}${cambioMotivo ? ` — ${cambioMotivo}` : ' — sin especificar'}`;
                      setDisplayTeacherId(newAsesorId);
                      setAsesorLog(logEntry);
                      setChangingAsesor(false);
                    }}>
                    Confirmar cambio
                  </Button>
                </div>
                {asesorLog && (
                  <div style={{ fontSize:10, color:'var(--fg-3)', borderTop:'1px solid var(--neutral-100)', paddingTop:8 }}>
                    Historial: {asesorLog}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Actions — confirmación antes de acción destructiva */}
        {cancelPending ? (
          <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border-1)', background:'#FBE7E7' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--red-700)', marginBottom:4 }}>¿Confirmas cancelar esta clase?</div>
            <div style={{ fontSize:11, color:'var(--fg-3)', marginBottom:12, lineHeight:1.5 }}>
              {roster.length} alumno{roster.length !== 1 ? 's' : ''} inscrito{roster.length !== 1 ? 's' : ''} serán notificados. Esta acción no se puede deshacer.
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Button variant="ghost" block onClick={() => setCancelPending(false)}>No, mantener clase</Button>
              <Button variant="danger" block onClick={onClose}>Sí, cancelar clase</Button>
            </div>
          </div>
        ) : (
          <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border-1)', display:'flex', flexDirection:'column', gap:8 }}>
            <Button variant="primary" block onClick={onClose}>Cerrar</Button>
            <button onClick={() => setCancelPending(true)} style={{
              background:'transparent', border:'none', color:'var(--red-600)',
              fontSize:12, fontWeight:600, cursor:'pointer', padding:'4px',
              textDecoration:'underline', fontFamily:'inherit',
            }}>
              Cancelar esta clase
            </button>
          </div>
        )}
      </div>

      {/* Modal: Mover estudiante — selector de destino (no inline — evita scroll-blindness) */}
      {moveTarget && (
        <>
          <div onClick={() => { setMoveTarget(null); setMoveDestSlot(null); }} style={{ position:'fixed', inset:0, background:'rgba(2,3,129,0.45)', zIndex:310 }}/>
          <div style={{
            position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:360, maxHeight:'80vh', overflowY:'auto',
            background:'white', borderRadius:16, padding:24, zIndex:311,
            boxShadow:'0 20px 60px rgba(2,3,129,0.25)',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800 }}>Mover alumno</div>
                <div style={{ fontSize:12, color:'var(--fg-3)', marginTop:2 }}>
                  {moveTarget} → elige el nuevo horario
                </div>
              </div>
              <button onClick={() => { setMoveTarget(null); setMoveDestSlot(null); }}
                style={{ border:'1px solid var(--border-1)', borderRadius:6, background:'white', width:28, height:28, cursor:'pointer', fontSize:14, color:'var(--fg-3)', flexShrink:0 }}>✕</button>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
              Slots disponibles · {lang.flag} {lang.name}
            </div>
            {availDestSlots.length === 0 ? (
              <div style={{ padding:'12px 0', fontSize:12, color:'var(--fg-3)', lineHeight:1.6 }}>
                No hay slots de {lang.flag} {lang.name} con cupo libre esta semana.<br/>
                <span style={{ color:'var(--cyan-700)', fontWeight:600 }}>Puedes crear uno en la pestaña "Próxima parrilla".</span>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
                {availDestSlots.map(ds => {
                  const dayLabel = {lun:'Lun',mar:'Mar',mie:'Mié',jue:'Jue',vie:'Vie',sab:'Sáb'}[ds.day];
                  const sel = moveDestSlot?.id === ds.id;
                  return (
                    <button key={ds.id} onClick={() => setMoveDestSlot(sel ? null : ds)}
                      style={{
                        textAlign:'left', padding:'10px 12px', borderRadius:8, cursor:'pointer', fontFamily:'inherit',
                        border: sel ? '2px solid var(--cyan-500)' : '1px solid var(--border-1)',
                        background: sel ? 'var(--cyan-50)' : 'var(--neutral-50)', outline:'none',
                      }}>
                      <div style={{ fontSize:13, fontWeight: sel ? 700 : 500 }}>{dayLabel} {ds.time} · Aula {ds.room}</div>
                      <div style={{ fontSize:10, color:'var(--fg-3)', marginTop:2 }}>
                        {ds.taken}/{ds.cap} alumnos · {ds.cap - ds.taken} cupo{ds.cap - ds.taken !== 1 ? 's' : ''} libre{ds.cap - ds.taken !== 1 ? 's' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {moveDestSlot && (
              <>
                <div style={{ padding:'8px 12px', background:'var(--cyan-50)', border:'1px solid var(--cyan-200)', borderRadius:8, fontSize:12, color:'var(--cyan-700)', marginBottom:12, lineHeight:1.5 }}>
                  Mover <strong>{moveTarget}</strong> a <strong>{({lun:'Lun',mar:'Mar',mie:'Mié',jue:'Jue',vie:'Vie',sab:'Sáb'})[moveDestSlot.day]} {moveDestSlot.time} · Aula {moveDestSlot.room}</strong>.<br/>
                  <span style={{ fontSize:11, color:'var(--fg-3)' }}>Notificar al alumno manualmente si es necesario.</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Button variant="ghost" block onClick={() => { setMoveTarget(null); setMoveDestSlot(null); }}>Cancelar</Button>
                  <Button variant="primary" block onClick={confirmMove}>Confirmar traslado</Button>
                </div>
              </>
            )}
            {!moveDestSlot && availDestSlots.length > 0 && (
              <Button variant="ghost" block onClick={() => { setMoveTarget(null); setMoveDestSlot(null); }}>Cancelar</Button>
            )}
          </div>
        </>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// LangFilter — pill toggles para filtrar por idioma (compartido)
// ──────────────────────────────────────────────────────────────────
function LangFilter({ activeLangs, allLangs, onChange }) {
  return (
    <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', padding:'8px 0 4px' }}>
      <span style={{ fontSize:10, fontWeight:700, color:'var(--fg-3)', textTransform:'uppercase', letterSpacing:'0.06em', marginRight:2 }}>Filtrar:</span>
      <button onClick={() => onChange(null)}
        style={{ padding:'4px 10px', fontSize:11, fontWeight:700, borderRadius:999,
                 border: !activeLangs ? '1.5px solid var(--cyan-500)' : '1px solid var(--border-1)',
                 background: !activeLangs ? 'var(--cyan-50)' : 'white',
                 color: !activeLangs ? 'var(--cyan-700)' : 'var(--fg-3)',
                 cursor:'pointer', fontFamily:'inherit' }}>
        Todos
      </button>
      {allLangs.map(l => {
        const active = activeLangs === l.code;
        return (
          <button key={l.code} onClick={() => onChange(active ? null : l.code)}
            style={{ padding:'4px 10px', fontSize:11, fontWeight:700, borderRadius:999,
                     border: active ? '1.5px solid var(--cyan-500)' : '1px solid var(--border-1)',
                     background: active ? 'var(--cyan-50)' : 'white',
                     color: active ? 'var(--cyan-700)' : 'var(--fg-3)',
                     cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
            {l.flag} {l.name}
          </button>
        );
      })}
    </div>
  );
}

window.AdminHome = AdminHome;
