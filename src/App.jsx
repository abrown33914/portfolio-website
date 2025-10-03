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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 4200); return () => clearTimeout(t); }, []);

  return (
    <>
      <Preloader done={loaded} />
      <MouseCursor size={10} />
      <StarCanvas />
      <Nav />
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
