import { useEffect, useState } from "react";
import StarCanvas from "./components/StarCanvas";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import MouseCursor from "./components/MouseCursor";

// App: top-level composition of the single-page portfolio
// - manages a small 'loaded' flag for the preloader
// - composes the decorative canvas, nav, and main page sections
export default function App() {
  // preload simulation: flip to true after a fixed timeout
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 4200); return () => clearTimeout(t); }, []);

  return (
    <>
      {/* Preloader component; receives done flag */}
      <Preloader done={loaded} />

      {/* Custom cursor (decorative), starfield (background) and top nav */}
      <MouseCursor size={10} />
      <StarCanvas />
      <Nav />

      {/* main content: stacked sections for the single-page site */}
      <main className="relative z-10 isolate">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
