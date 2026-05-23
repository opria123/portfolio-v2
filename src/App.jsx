import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LeftDock from './components/LeftDock'
import RightDock from './components/RightDock'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ExperiencesPage from './pages/ExperiencesPage'
import SkillsPage from './pages/SkillsPage'
import EducationsPage from './pages/EducationsPage'
import PostsPage from './pages/PostsPage'
import PostDetailPage from './pages/PostDetailPage'
import { SkillModalProvider } from './components/SkillModal'
import { ProjectModalProvider } from './components/ProjectModal'
import { TrophiesProvider } from './components/TrophiesProvider'
import { NotificationsProvider } from './components/NotificationsProvider'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
  return (
    <BrowserRouter basename={basename}>
      <NotificationsProvider>
        <TrophiesProvider>
          <SkillModalProvider>
            <ProjectModalProvider>
            <ScrollToTop />
            <LeftDock />
            <RightDock />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/educations" element={<EducationsPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/:slug" element={<PostDetailPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
            </ProjectModalProvider>
          </SkillModalProvider>
        </TrophiesProvider>
      </NotificationsProvider>
    </BrowserRouter>
  )
}
