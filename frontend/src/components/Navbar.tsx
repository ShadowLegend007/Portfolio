import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePageTransition } from '../hooks/usePageTransition';
import { navbarBg as bg, logoWhite as logoW } from '../assets/assets';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routerNavigate = useNavigate();
  const { navigate } = usePageTransition();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'SKILL', path: '/skills' },
    { name: 'EDUCATION', path: '/education' },
    { name: 'EXPERIENCE', path: '/experience' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (location.pathname === path) return;
    setIsOpen(false);
    navigate(path, () => routerNavigate(path));
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') return;
    setIsOpen(false);
    navigate('/', () => routerNavigate('/'));
  };

  return (
    <nav className={styles.navbar} style={{ backgroundImage: `url(${bg})` }}>
      <div className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
        <a href="/" onClick={handleLogoClick} className={styles.logoIcon}>
          <img src={logoW} alt="Logo" style={{ height: '32px', width: 'auto' }} />
        </a>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className={`${styles.link} ${location.pathname === link.path ? styles.activeLink : ''}`}
            onClick={(e) => handleNavClick(e, link.path)}
          >
            {link.name}
          </a>
        ))}
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>
    </nav>
  );
};

export default Navbar;
