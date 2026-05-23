import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Catalog from './pages/Catalog'
import StoryDetail from './pages/StoryDetail'
import ReadingView from './pages/ReadingView'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateStory from './pages/CreateStory'
import EditStory from './pages/EditStory'
import MyStories from './pages/MyStories'
import Favorites from './pages/Favorites'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStories from './pages/admin/AdminStories'
import AdminCategories from './pages/admin/AdminCategories'

function AppShell() {
  const { pathname } = useLocation()
  const noShell = ['/login', '/register'].includes(pathname) || pathname.includes('/read/')
  const isAdmin = pathname.startsWith('/panel')

  return (
    <>
      {!noShell && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Immersive reading — public, no navbar/footer */}
        <Route path="/stories/:id/read/:chapterId" element={<ReadingView />} />

        {/* Authenticated */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/create-story" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
        <Route path="/edit-story/:id" element={<ProtectedRoute><EditStory /></ProtectedRoute>} />
        <Route path="/my-stories" element={<ProtectedRoute><MyStories /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />

        {/* Admin panel — /panel to avoid conflict with Django's /admin/ */}
        <Route path="/panel" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="stories" element={<AdminStories />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
      {!noShell && !isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
