// Widget framework + Excel Bridge components
// Componible: cualquier contenido va dentro de <Widget>.
// Sirve para academia de idiomas, música, tenis — lo que sea.

const { useState: useState_w } = React;

function Widget({ id, title, eyebrow, size = '1x1', children, removable, onRemove, actions, accent, compact }) {
  const gridClass = {
    '1x1': { gridColumn: 'span 1', gridRow: 'span 1' },
    '1x2': { gridColumn: 'span 1', gridRow: 'span 2' },
    '2x1': { gridColumn: 'span 2', gridRow: 'span 1' },
    '2x2': { gridColumn: 'span 2', gridRow: 'span 2' },
    '3x1': { gridColumn: 'span 3', gridRow: 'span 1' },
  }[size];
  return (
    <div data-widget-id={id} style={{
      background: 'white', border: '1px solid var(--border-1)', borderRadius: 12,
      padding: compact ? 14 : 18, display: 'flex', flexDirection: 'column', gap: 10,
      borderTop: accent ? `3px solid ${accent}` : undefined,
      ...gridClass,
    }}>
      {(title || eyebrow || actions || removable) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <div style={{ fontSize: 15, fontWeight: 700, marginTop: eyebrow ? 2 : 0, color: 'var(--fg-1)' }}>{title}</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {actions}
            {removable && (
              <button onClick={onRemove} title="Quitar widget" style={{
                width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer',
                color: 'var(--fg-4)', borderRadius: 6,
              }}>✕</button>
            )}
          </div>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

// Excel import/export widget — visible en Admin, sticky
function ExcelBridge({ context = 'Estudiantes' }) {
  const [state, setState] = useState_w('idle'); // idle, imported
  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--neutral-0) 0%, var(--cyan-50) 100%)',
      border: '1px solid var(--cyan-200)', borderRadius: 12, padding: 16,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: '#217346', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-mono)',
      }}>XL</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Puente Excel · {context}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
          {state === 'idle'
            ? 'Sube tu Excel actual o descarga los datos cuando quieras.'
            : '✓ Importados 84 registros · última sincronización hace 2 min'}
        </div>
      </div>
      <Button variant="ghost" size="sm" icon={<IconUpload size={14}/>} onClick={() => setState('imported')}>
        Importar .xlsx
      </Button>
      <Button variant="quiet" size="sm">Descargar .xlsx</Button>
    </div>
  );
}

window.Widget = Widget;
window.ExcelBridge = ExcelBridge;
