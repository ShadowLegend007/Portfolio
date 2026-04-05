
import styles from './PageStyles.module.css';
import { profilePic as myPic, signature } from '../assets/assets';

const About = () => {
  return (
    <div className={styles.pageContent}>
      <div className={styles.header}>
        <span className={styles.number}>01</span>
        <div>
          <h2 className={styles.subheading}>Know</h2>
          <h1 className={styles.heading}>About me</h1>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.textColumn}>
          <p className={styles.paragraph}>
            Appropriately maintain standards compliant total linkage with cutting-edge action items. Enthusiastically create seamless synergy rather than excellent value. Quickly promote premium strategic theme areas vis-a-vis.
          </p>
          <p className={styles.paragraph}>
            Appropriately maintain standards compliant total linkage with cutting-edge action items. Enthusiastically create seamless synergy rather than excellent value.
          </p>
          <img src={signature} alt="Signature" className={styles.signature} />
        </div>
        <div className={styles.imageColumn}>
          <div className={styles.portraitFrame}>
            <img src={myPic} alt="Subhodeep Mondal" className={styles.portraitImage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
