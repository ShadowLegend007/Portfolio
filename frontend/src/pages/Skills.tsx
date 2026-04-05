import { 
  SiFigma, 
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiBootstrap,
  SiMongodb,
  SiMysql,
  SiPython,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiC,
  SiCplusplus,
  SiLatex,
  SiGithub,
  SiEclipseide,
  SiJupyter,
  SiPostman,
  SiCanva
} from 'react-icons/si';

import { FaJava } from 'react-icons/fa6';

import { TbBrandVscode } from 'react-icons/tb';

import styles from './Skills.module.css';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "HTML", icon: <SiHtml5 color="#E34F26" /> },
        { name: "CSS", icon: <SiCss color="#1572B6" /> },
        { name: "JavaScript", icon: <SiJavascript color="#F7DF1E" /> },
        { name: "React.js", icon: <SiReact color="#61DAFB" /> },
        { name: "Bootstrap", icon: <SiBootstrap color="#7952B3" /> },
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "MongoDB", icon: <SiMongodb color="#47A248" /> },
        { name: "MYSQL", icon: <SiMysql color="#4479A1" /> },
        { name: "Python", icon: <SiPython color="#3776AB" /> },
      ]
    },
    {
      title: "Data Science",
      skills: [
        { name: "NumPy", icon: <SiNumpy color="#013243" /> },
        { name: "Pandas", icon: <SiPandas color="#150458" /> },
        { name: "Matplotlib", icon: <div style={{fontWeight: '900', fontSize: '0.45rem', color: '#11557c', textAlign: 'center', lineHeight: '1'}}>MATPLOT<br/>LIB</div> },
        { name: "Scikit-Learn", icon: <SiScikitlearn color="#F7931E" /> },
      ]
    },
    {
      title: "Programming Language",
      skills: [
        { name: "C", icon: <SiC color="#A8B9CC" /> },
        { name: "C++", icon: <SiCplusplus color="#00599C" /> },
        { name: "Java", icon: <FaJava color="#007396" /> },
        { name: "Python", icon: <SiPython color="#3776AB" /> },
        { name: "LATEX", icon: <SiLatex color="#008080" /> },
      ]
    },
    {
      title: "Tools & Services",
      skills: [
        { name: "Github", icon: <SiGithub color="#181717" /> },
        { name: "VS Code", icon: <TbBrandVscode color="#007ACC" /> },
        { name: "Eclipse", icon: <SiEclipseide color="#2C2255" /> },
        { name: "Jupyter Notebook", icon: <SiJupyter color="#F37626" /> },
        { name: "Postman", icon: <SiPostman color="#FF6C37" /> },
        { name: "Canva", icon: <SiCanva color="#00C4CC" /> },
        { name: "Figma", icon: <SiFigma color="#F24E1E" /> },
      ]
    }
  ];

  return (
    <div className={styles.skillsContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.number}>02</div>
          <div className={styles.subheading}>KNOW</div>
          <div className={styles.headingWrapper}>
            <div className={styles.brushBgImage}></div>
            <h1 className={styles.heading}>Skills</h1>
          </div>
        </div>

        <p className={styles.description}>
          Here are some of the technologies and tools I work with:
        </p>

        <div className={styles.skillsGrid}>
          {skillCategories.map((category, index) => (
            <div key={index} className={styles.skillCategory}>
              <div className={styles.categoryTitleWrapper}>
                <div className={styles.categoryBrushBg}></div>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
              </div>
              <div className={styles.skillsList}>
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className={styles.skillItem} title={skill.name}>
                    {skill.icon}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
