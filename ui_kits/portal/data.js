// Believe Academy — datos compartidos del portal
// Fuente única de verdad: niveles, idiomas, parrilla, perfil del alumno demo.

window.BELIEVE_DATA = (function() {

  // ─── Idiomas ofrecidos ───────────────────────────────────────
  const LANGUAGES = [
    { code: 'en', name: 'Inglés',     flag: '🇬🇧' },
    { code: 'fr', name: 'Francés',    flag: '🇫🇷' },
    { code: 'pt', name: 'Portugués',  flag: '🇵🇹' },
    { code: 'de', name: 'Alemán',     flag: '🇩🇪' },
    { code: 'zh', name: 'Chino',      flag: '🇨🇳' },
    { code: 'ja', name: 'Japonés',    flag: '🇯🇵' },
    { code: 'it', name: 'Italiano',   flag: '🇮🇹' },
    { code: 'es', name: 'Castellano', flag: '🇪🇸' },
  ];

  // ─── Niveles Oxford (orden ascendente) ───────────────────────
  // Aplica para todos los idiomas; Believe alinea su currícula al estándar Oxford.
  const LEVELS = [
    { code: 'beginner',  name: 'Beginner',          short: 'Beg' },
    { code: 'elem',      name: 'Elementary',        short: 'Elem' },
    { code: 'preint',    name: 'Pre-Intermediate',  short: 'Pre-Int' },
    { code: 'int',       name: 'Intermediate',      short: 'Int' },
    { code: 'upperint',  name: 'Upper-Intermediate',short: 'Upper-Int' },
    { code: 'adv',       name: 'Advanced',          short: 'Adv' },
  ];

  // ─── Aulas físicas ───────────────────────────────────────────
  const ROOMS = ['A1', 'A2', 'A3', 'A4'];

  // ─── Profesores (asesores académicos rotativos) ──────────────
  const TEACHERS = [
    { id: 't1', name: 'María José Pereda',  initials: 'MJ', langs: ['en','fr'] },
    { id: 't2', name: 'Carlos Mendoza',     initials: 'CM', langs: ['en','pt'] },
    { id: 't3', name: 'Yuki Tanaka',        initials: 'YT', langs: ['ja','en'] },
    { id: 't4', name: 'Lukas Schmidt',      initials: 'LS', langs: ['de','en'] },
    { id: 't5', name: 'Wei Chen',           initials: 'WC', langs: ['zh','en'] },
    { id: 't6', name: 'Giulia Rossi',       initials: 'GR', langs: ['it','en'] },
  ];

  // ─── Perfil del alumno demo ──────────────────────────────────
  const STUDENT = {
    name: 'Sebastián Ríos',
    firstName: 'Sebastián',
    language: 'en',
    level: 'elem',           // <-- "Estás en Elementary"
    classesPerWeek: 4,
    membershipMonth: 'abril 2026',
  };

  // ─── Reglas operativas ───────────────────────────────────────
  const RULES = {
    classesPerWeek: 4,
    slotCapacity: 7,
    bookingWindow: {
      // Viernes 9-12 y 14-18 — reservas para la semana siguiente
      day: 5,             // 0=Dom, 5=Vie
      morning: [9, 12],
      afternoon: [14, 18],
    },
    cancellationHoursBefore: 2,    // ≥2h antes para reprogramar
  };

  // ─── Genera parrilla semanal (slots × días) ──────────────────
  // Cada slot: día, hora, aula, idioma, nivel, profe (rotativo), capacidad, ocupados.
  function makeWeek(weekId = 0) {
    const HOURS = ['08:30','09:30','10:30','11:30','15:00','16:00','17:00'];
    const DAYS_KEYS = ['lun','mar','mie','jue','vie','sab'];
    const out = {};

    DAYS_KEYS.forEach((dk, di) => {
      HOURS.forEach((h, hi) => {
        const idx = di * HOURS.length + hi;
        const seed = (idx * 13 + weekId * 31) % 100;
        // ~22% slots no abiertos esa hora
        if (seed < 22) return;

        // Asigna idioma + nivel deterministicamente — alumno solo ve su nivel,
        // pero la grilla tiene mezcla.
        const langIdx = (idx + weekId) % LANGUAGES.length;
        const lvlIdx  = (idx * 3 + weekId * 2) % LEVELS.length;
        const roomIdx = idx % ROOMS.length;
        const teacherIdx = (idx * 7 + weekId * 11) % TEACHERS.length;

        // Cupo
        const cap = RULES.slotCapacity;
        const taken = (idx * 7 + weekId * 13) % (cap + 2); // a veces lleno
        const id = `w${weekId}-${dk}-${h}-${roomIdx}`;

        out[id] = {
          id,
          day: dk, dayIdx: di,
          time: h,
          room: ROOMS[roomIdx],
          lang: LANGUAGES[langIdx].code,
          level: LEVELS[lvlIdx].code,
          teacher: TEACHERS[teacherIdx].id,
          cap,
          taken: Math.min(taken, cap),
          weekId,
        };
      });
    });

    // ─── Garantiza slots para el alumno demo (Inglés Elementary) ───
    // Override determinístico de ~10 slots distribuidos por la semana.
    // Mantiene IDs estables para reservas existentes.
    const STUDENT_GUARANTEED = [
      { day: 'lun', time: '08:30', room: 0, taken: 4, teacherId: 't1' },
      { day: 'lun', time: '09:30', room: 0, taken: 7, teacherId: 't1' }, // lleno
      { day: 'mar', time: '10:30', room: 1, taken: 5, teacherId: 't3' },
      { day: 'mar', time: '16:00', room: 0, taken: 2, teacherId: 't2' },
      { day: 'mie', time: '08:30', room: 1, taken: 6, teacherId: 't1' }, // 1 libre
      { day: 'mie', time: '15:00', room: 2, taken: 3, teacherId: 't4' },
      { day: 'jue', time: '11:30', room: 0, taken: 7, teacherId: 't1' }, // lleno
      { day: 'jue', time: '17:00', room: 1, taken: 1, teacherId: 't2' },
      { day: 'vie', time: '09:30', room: 2, taken: 4, teacherId: 't3' },
      { day: 'vie', time: '15:00', room: 0, taken: 0, teacherId: 't1' },
      { day: 'sab', time: '10:30', room: 1, taken: 6, teacherId: 't2' }, // 1 libre
      { day: 'sab', time: '11:30', room: 0, taken: 5, teacherId: 't1' },
    ];
    STUDENT_GUARANTEED.forEach(g => {
      const id = `w${weekId}-${g.day}-${g.time}-${g.room}`;
      // Solo elimina el slot en la MISMA aula — permite multi-idioma en otras aulas
      delete out[id];
      out[id] = {
        id,
        day: g.day, dayIdx: DAYS_KEYS.indexOf(g.day),
        time: g.time,
        room: ROOMS[g.room],
        lang: 'en',
        level: 'elem',
        teacher: g.teacherId,
        cap: RULES.slotCapacity,
        taken: g.taken,
        weekId,
      };
    });

    // ─── Slots multi-idioma: mismo horario, distinta aula ────────────
    // Caso real: lunes 08:30 puede tener Inglés en A1 y Francés en A2
    // El admin ve ambos en la misma celda del grid; puede filtrar por idioma.
    const MULTI_LANG_SLOTS = [
      { day:'lun', time:'08:30', room:1, lang:'fr', level:'preint',   taken:3, teacherId:'t1' },
      { day:'mar', time:'16:00', room:2, lang:'de', level:'int',      taken:5, teacherId:'t4' },
      { day:'mie', time:'15:00', room:3, lang:'ja', level:'beginner', taken:2, teacherId:'t3' },
      { day:'vie', time:'09:30', room:3, lang:'zh', level:'elem',     taken:4, teacherId:'t5' },
      { day:'jue', time:'11:30', room:2, lang:'it', level:'upperint', taken:6, teacherId:'t6' },
      { day:'sab', time:'10:30', room:2, lang:'fr', level:'adv',      taken:1, teacherId:'t1' },
    ];
    MULTI_LANG_SLOTS.forEach(g => {
      const id = `w${weekId}-${g.day}-${g.time}-${g.room}-ml`;
      if (!out[id]) {
        out[id] = {
          id,
          day: g.day, dayIdx: DAYS_KEYS.indexOf(g.day),
          time: g.time,
          room: ROOMS[g.room],
          lang: g.lang,
          level: g.level,
          teacher: g.teacherId,
          cap: RULES.slotCapacity,
          taken: g.taken,
          weekId,
          multiLang: true,
        };
      }
    });

    return out;
  }

  // ─── Estado de ventana de reserva ────────────────────────────
  // Devuelve uno de: 'closed-future' | 'open-am' | 'lunch' | 'open-pm' | 'closed-locked'
  // En la demo, exponemos un override mediante window.__BELIEVE_WINDOW_STATE.
  function getWindowState(now = new Date()) {
    if (window.__BELIEVE_WINDOW_STATE) return window.__BELIEVE_WINDOW_STATE;
    const day = now.getDay();
    const h = now.getHours();
    if (day !== 5) return day < 5 ? 'closed-future' : 'closed-locked';
    if (h < 9) return 'closed-future';
    if (h < 12) return 'open-am';
    if (h < 14) return 'lunch';
    if (h < 18) return 'open-pm';
    return 'closed-locked';
  }

  // ─── Helpers de formateo ─────────────────────────────────────
  function langOf(code) { return LANGUAGES.find(l => l.code === code) || LANGUAGES[0]; }
  function levelOf(code) { return LEVELS.find(l => l.code === code) || LEVELS[0]; }
  function teacherOf(id) { return TEACHERS.find(t => t.id === id) || TEACHERS[0]; }

  return {
    LANGUAGES, LEVELS, ROOMS, TEACHERS, STUDENT, RULES,
    makeWeek, getWindowState,
    langOf, levelOf, teacherOf,
  };
})();
