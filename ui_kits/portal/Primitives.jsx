// Shared components for Believe Portal UI Kit
// Loaded into window so all screens can consume.

const { useState, useEffect } = React;

// =============== Icons (inline SVG, Lucide-style 1.75 stroke) ===============
const Icon = ({ d, size = 20, fill = 'none', className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
       fill={fill} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
       className={className}>{d}</svg>
);
const IconHome = p => <Icon {...p} d={<><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></>} />;
const IconCal  = p => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>} />;
const IconCard = p => <Icon {...p} d={<><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></>} />;
const IconUser = p => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></>} />;
const IconQR   = p => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3"/></>} />;
const IconUpload = p => <Icon {...p} d={<><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 17v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/></>} />;
const IconCheck  = p => <Icon {...p} d={<path d="m5 12 5 5L20 7"/>} />;
const IconBell   = p => <Icon {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7"/><path d="M10 21a2 2 0 0 0 4 0"/></>} />;
const IconChev   = p => <Icon {...p} d={<path d="m9 6 6 6-6 6"/>} />;
const IconPlus   = p => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />;
const IconClock  = p => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />;
const IconMapPin = p => <Icon {...p} d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></>} />;
const IconBook   = p => <Icon {...p} d={<><path d="M4 4h10a4 4 0 0 1 4 4v13H8a4 4 0 0 1-4-4z"/><path d="M8 2h10v13"/></>} />;
const IconLogout = p => <Icon {...p} d={<><path d="M10 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/><path d="m15 17 5-5-5-5M20 12H9"/></>} />;
const IconSearch = p => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />;
const IconDots   = p => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>} />;
const IconChart  = p => <Icon {...p} d={<><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></>} />;
const IconWallet = p => <Icon {...p} d={<><path d="M3 7a2 2 0 0 1 2-2h14v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M15 12h4"/></>} />;
const IconCamera = p => <Icon {...p} d={<><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></>} />;

// =============== Language meta ===============
const LANGS = {
  ingles:     { flag: '🇬🇧', name: 'Inglés',    color: '#0693E3', bg: '#E6F5FD', fg: '#025C9B' },
  frances:    { flag: '🇫🇷', name: 'Francés',   color: '#025C9B', bg: '#E6E6F5', fg: '#020381' },
  aleman:     { flag: '🇩🇪', name: 'Alemán',    color: '#2A313B', bg: '#EEF1F6', fg: '#2A313B' },
  italiano:   { flag: '🇮🇹', name: 'Italiano',  color: '#16A34A', bg: '#E6F5E9', fg: '#0E6E31' },
  portugues:  { flag: '🇧🇷', name: 'Portugués', color: '#FCB900', bg: '#FFF7E0', fg: '#8A6300' },
  mandarin:   { flag: '🇨🇳', name: 'Mandarín',  color: '#CF2E2E', bg: '#FBE7E7', fg: '#971F1F' },
  japones:    { flag: '🇯🇵', name: 'Japonés',   color: '#971F1F', bg: '#FBE7E7', fg: '#971F1F' },
  espanol:    { flag: '🇪🇸', name: 'Español',   color: '#FCB900', bg: '#FFF7E0', fg: '#8A6300' },
};

// =============== Primitives ===============
function Logo({ invert, height = 26 }) {
  return (
    <img src="../../assets/logo-believe.svg" alt="Believe" 
         style={{ height, filter: invert ? 'brightness(0) invert(1)' : 'none' }} />
  );
}

function Button({ variant = 'primary', size = 'md', children, onClick, icon, style, disabled, block }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'inherit', fontWeight: 600, border: '1px solid transparent',
    borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 140ms ease',
    opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    width: block ? '100%' : 'auto',
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '10px 18px', fontSize: 14 },
    lg: { padding: '14px 24px', fontSize: 15 },
  };
  const variants = {
    primary:   { background: 'var(--cyan-500)', color: 'white' },
    secondary: { background: 'var(--indigo-500)', color: 'white' },
    ghost:     { background: 'transparent', color: 'var(--cyan-700)', borderColor: 'var(--border-1)' },
    quiet:     { background: 'var(--neutral-100)', color: 'var(--fg-1)' },
    danger:    { background: 'var(--red-500)', color: 'white' },
    dark:      { background: 'var(--neutral-900)', color: 'white' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
            style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {icon}{children}
    </button>
  );
}

function Badge({ tone = 'neutral', children, dot }) {
  const tones = {
    success: { bg: '#E6F5E9', fg: '#16A34A' },
    warning: { bg: '#FFF7E0', fg: '#8A6300' },
    danger:  { bg: '#FBE7E7', fg: '#971F1F' },
    info:    { bg: '#E6F5FD', fg: '#025C9B' },
    neutral: { bg: 'var(--neutral-100)', fg: 'var(--fg-2)' },
    indigo:  { bg: 'var(--indigo-500)', fg: 'white' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
      background: t.bg, color: t.fg,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg }}/>}
      {children}
    </span>
  );
}

function Card({ children, hoverable, style, onClick, accent }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
         onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
         style={{
           background: 'var(--bg-surface)',
           border: '1px solid ' + (h && hoverable ? 'var(--cyan-300)' : 'var(--border-1)'),
           borderRadius: 12, padding: 20,
           transition: 'border-color 140ms ease',
           cursor: onClick ? 'pointer' : 'default',
           borderTop: accent ? `3px solid ${accent}` : undefined,
           ...style,
         }}>
      {children}
    </div>
  );
}

function Eyebrow({ children, color = 'var(--cyan-700)' }) {
  return <div style={{
    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', color,
  }}>{children}</div>;
}

function Sidebar({ role, active, onNav }) {
  const roleMeta = {
    estudiante: { name: 'Estudiante',      color: 'var(--indigo-500)' },
    profesor:   { name: 'Profesor',        color: 'var(--cyan-500)' },
    admin:      { name: 'Administración',  color: 'var(--neutral-900)' },
  };
  const navs = {
    estudiante: [
      { id: 'home', label: 'Inicio', icon: <IconHome size={18}/> },
      { id: 'reservar', label: 'Reservar', icon: <IconCal size={18}/> },
      { id: 'asistencia', label: 'Asistencia', icon: <IconQR size={18}/> },
      { id: 'pagos', label: 'Pagos', icon: <IconCard size={18}/> },
      { id: 'perfil', label: 'Perfil', icon: <IconUser size={18}/> },
    ],
    profesor: [
      { id: 'home', label: 'Hoy', icon: <IconHome size={18}/> },
      { id: 'agenda', label: 'Agenda', icon: <IconCal size={18}/> },
      { id: 'estudiantes', label: 'Estudiantes', icon: <IconUser size={18}/> },
      { id: 'recursos', label: 'Recursos', icon: <IconBook size={18}/> },
    ],
    admin: [
      { id: 'home', label: 'Panel', icon: <IconHome size={18}/> },
      { id: 'reservas', label: 'Reservas & slots', icon: <IconCal size={18}/> },
      { id: 'estudiantes', label: 'Estudiantes', icon: <IconUser size={18}/> },
      { id: 'pagos', label: 'Pagos & cobros', icon: <IconWallet size={18}/> },
      { id: 'profesores', label: 'Profesores', icon: <IconBook size={18}/> },
      { id: 'excel', label: 'Importar/Exportar', icon: <IconUpload size={18}/> },
    ],
  };
  const items = navs[role] || [];
  const rm = roleMeta[role];
  return (
    <aside style={{
      width: 240, background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-1)', padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0, height: '100vh',
      position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '4px 8px 12px' }}><Logo height={22}/></div>
      <div style={{
        background: rm.color, color: rm.fg || 'white',
        borderRadius: 12, padding: '10px 14px',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        Portal · {rm.name}
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const isActive = it.id === active;
          return (
            <button key={it.id} onClick={() => onNav && onNav(it.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                background: isActive ? 'var(--cyan-50)' : 'transparent',
                color: isActive ? 'var(--cyan-700)' : 'var(--fg-2)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 14, fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                borderLeft: isActive ? '3px solid var(--cyan-500)' : '3px solid transparent',
                paddingLeft: isActive ? 11 : 14,
                transition: 'all 140ms',
              }}>
              {it.icon}{it.label}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-1)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
          background: 'transparent', border: 'none', color: 'var(--fg-3)',
          fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
        }}><IconLogout size={16}/> Cerrar sesión</button>
      </div>
    </aside>
  );
}

function TopBar({ title, eyebrow, right }) {
  return (
    <header style={{
      padding: '20px 32px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderBottom: '1px solid var(--border-1)',
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{right}</div>
    </header>
  );
}

function Avatar({ name, size = 36, color = 'var(--indigo-500)' }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

function StatTile({ label, value, delta, tone }) {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--border-1)',
      borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: tone === 'down' ? 'var(--red-700)' : 'var(--semantic-success)', fontWeight: 600 }}>{delta}</div>}
    </div>
  );
}

Object.assign(window, {
  LANGS, Logo, Button, Badge, Card, Eyebrow, Sidebar, TopBar, Avatar, StatTile,
  IconHome, IconCal, IconCard, IconUser, IconQR, IconUpload, IconCheck, IconBell,
  IconChev, IconPlus, IconClock, IconMapPin, IconBook, IconLogout, IconSearch,
  IconDots, IconChart, IconWallet, IconCamera,
});
