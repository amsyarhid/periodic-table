import styles from './LayoutControls.module.css';

function LayoutControls({ layouts, activeId, onSelect }) {
  return (
    <nav className={styles.controls} aria-label="Layouts">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          type="button"
          className={styles.button}
          aria-pressed={layout.id === activeId}
          onClick={() => onSelect(layout.id)}
        >
          {layout.label}
        </button>
      ))}
    </nav>
  );
}

export default LayoutControls;
