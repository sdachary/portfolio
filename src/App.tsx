import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'

const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const ManacitraSection = lazy(() => import('./components/ManacitraSection'))
const Blog = lazy(() => import('./components/Blog'))
const RecentActivity = lazy(() => import('./components/RecentActivity'))
const WorkWithMe = lazy(() => import('./components/WorkWithMe'))
const Contact = lazy(() => import('./components/Contact'))

function SectionFallback() {
  return <div className="section" style={{ minHeight: 200 }} />
}

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Suspense fallback={<SectionFallback />}>
        <Experience />
        <Skills />
        <Projects />
        <ManacitraSection />
        <Blog />
        <RecentActivity />
        <WorkWithMe />
        <Contact />
      </Suspense>
    </>
  )
}
