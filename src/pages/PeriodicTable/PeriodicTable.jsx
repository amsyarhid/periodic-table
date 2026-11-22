import { useEffect, useRef, useState } from 'react';
import { usePeople } from '../../hooks/usePeople';
import { useCss3dScene } from '../../hooks/useCss3dScene';
import { LAYOUTS } from '../../utils/layouts';
import { createTileElement } from '../../components/common/Tile/Tile';
import NetWorthLegend from '../../components/common/NetWorthLegend/NetWorthLegend';
import LayoutControls from '../../components/common/LayoutControls/LayoutControls';
import Header from '../../components/layout/Header/Header';
import styles from './PeriodicTable.module.css';

function PeriodicTable() {
  const containerRef = useRef(null);
  const [activeLayoutId, setActiveLayoutId] = useState(LAYOUTS[0].id);
  const { people, loading, error, retry } = usePeople();

  const { transform } = useCss3dScene(containerRef, people, createTileElement);

  useEffect(() => {
    const layout = LAYOUTS.find(({ id }) => id === activeLayoutId);
    if (layout && people.length > 0) {
      transform(layout.create(people.length));
    }
  }, [activeLayoutId, people, transform]);

  return (
    <div className={styles.page}>
      <div ref={containerRef} className={styles.scene} />

      <div className={styles.header}>
        <Header />
      </div>

      {(loading || error) && (
        <div className={styles.status} role="status">
          {loading && <p>Loading people…</p>}
          {error && (
            <>
              <p className={styles.error}>Couldn&apos;t load people: {error}</p>
              <button type="button" className={styles.retryButton} onClick={retry}>
                Retry
              </button>
            </>
          )}
        </div>
      )}

      <div className={styles.controls}>
        <LayoutControls layouts={LAYOUTS} activeId={activeLayoutId} onSelect={setActiveLayoutId} />
      </div>

      <div className={styles.legend}>
        <NetWorthLegend />
      </div>
    </div>
  );
}

export default PeriodicTable;
