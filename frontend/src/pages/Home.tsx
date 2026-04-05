import styles from './Home.module.css';
import { usePageTransition } from '../hooks/usePageTransition';
import { useNavigate } from 'react-router-dom';
import { Github, FileText } from 'lucide-react';
import { profilePic as myPic, cvPdf as cv } from '../assets/assets';

const Home = () => {
  const { navigate } = usePageTransition();
  const routerNavigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.line}></div>
        <h2 className={styles.nameLabel}>Subhodeep Mondal</h2>
        <h1 className={styles.title}>UI &amp; UX Designer</h1>
        <p className={styles.subtitle}>
          Crafting digital experiences with the precision of code and the fluidity of ink.
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={() => navigate('/projects', () => routerNavigate('/projects'))} className={styles.primaryButton}>
            View Work <div className={styles.inkSplash}></div>
          </button>
          <a href="https://github.com/ShadowLegend007" target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
            <Github size={20} /> GitHub
          </a>
          <a href={cv} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
            <FileText size={20} /> Resume
          </a>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <img src={myPic} alt="Subhodeep Mondal" className={styles.profilePic} />
      </div>
    </div>
  );
};

export default Home;
