import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PageTransitionOverlay from "./components/PageTransitionOverlay";
import Home from "./pages/Home";

import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { TransitionProvider } from "./context/TransitionContext";
import ComingSoonOverlay from "./components/ComingSoonOverlay";
import SiteLoader from "./components/SiteLoader";

const App = () => {
  const location = useLocation();
  const allowedPaths = ['/', '/skills', '/education', '/experience', '/projects', '/contact'];
  const showComingSoon = !allowedPaths.includes(location.pathname);

  return (
    <>
      <SiteLoader />
      <TransitionProvider>
        <PageTransitionOverlay />
        <Navbar />
        <div className="page-container">
          <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {showComingSoon && <ComingSoonOverlay />}
      </div>
    </TransitionProvider>
    </>
  );
};

export default App;
