
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginForm'
import RegisterForm from './pages/RegisterForm'
import MainLayout from './Layouts/MainLayout'
import AuthLayout from './Layouts/AuthLayout'
import FormPreview from './pages/FormPreview'
import TemplateEditor from './pages/TemplateEditor'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import FormList from './components/FormList'
import FormSuccess from './components/FormSuccess'
import HomePage from './components/HomePage'
import SearchResultsPage from './components/SearchResultsPage'
import PublicTemplateView from './components/PublicTemplateView'
import TemplateResponses from './components/TemplateResponses'
import Dashboard from './components/Dashboard'
import UserProfile from './components/UserProfile'
import HelpButton from './components/HelpButton'


function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/:templateId" element={<PublicTemplateView />} />
            <Route path="/templates/:templateId" element={
              <PrivateRoute>
                <FormPreview />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          
            <Route path="/forms" element={
              <PrivateRoute>
                <FormList />
              </PrivateRoute>
            } />

            <Route path="/forms/:id/success" element={
              <PrivateRoute>
                <FormSuccess />
              </PrivateRoute>
            } />

            <Route path="/template" element={<PrivateRoute>
              <TemplateEditor />
            </PrivateRoute>} />
            <Route path="/templates/:id/edit" element={<PrivateRoute><TemplateEditor /></PrivateRoute>} />
            <Route path="/templates/:templateId/responses" element={<PrivateRoute><TemplateResponses /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          </Route>

          <Route element={<AuthLayout />}>

            <Route path="/login" element={<LoginForm />} />

            <Route path="/register" element={<RegisterForm />} />

          </Route>

        </Routes>
           <HelpButton />
      </AuthProvider>

    </BrowserRouter>
  )
}

export default App