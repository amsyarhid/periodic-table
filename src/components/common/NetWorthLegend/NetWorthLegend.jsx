import { NET_WORTH_COLORS } from '../../../utils/constants';
import styles from './NetWorthLegend.module.css';

const gradient = `linear-gradient(to right, ${NET_WORTH_COLORS.low}, ${NET_WORTH_COLORS.medium}, ${NET_WORTH_COLORS.high})`;

function NetWorthLegend() {
  return (
    <div className={styles.legend} aria-label="Net worth colour scale from low to high">
      <span>LOW</span>
      <span className={styles.bar} style={{ background: gradient }} />
      <span>HIGH</span>
    </div>
  );
}

export default NetWorthLegend;
