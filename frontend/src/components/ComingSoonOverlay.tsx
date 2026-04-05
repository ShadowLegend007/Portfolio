import styles from './ComingSoonOverlay.module.css';

const ComingSoonOverlay = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.textContainer}>
        <span className={styles.stamp}>Notice</span>
        <h2 className={styles.text}>Coming Soon</h2>
      </div>
    </div>
  );
};

export default ComingSoonOverlay;
