import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import DualIdentity from './components/DualIdentity'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Preloader from './components/Preloader'

export default function App() {
  return (
    <Preloader>
      <Cursor />
      <Navbar />
      <Hero />
      <About />
      <DualIdentity />
      <Skills />
      <Projects />
      <Experience />
      <Contact />

    </Preloader>
  )
}
