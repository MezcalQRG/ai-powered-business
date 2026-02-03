import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import LandingPage from '@/components/LandingPage'
import AuthForm from '@/components/AuthForm'
import OnboardingWizard from '@/components/OnboardingWizard'
import Dashboard from '@/components/Dashboard'
import type { User, BusinessConfig, APICredentials } from '@/lib/types'

type AppState = 'landing' | 'auth' | 'onboarding' | 'dashboard'

function App() {
  const [appState, setAppState] = useState<AppState>('landing')
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [businessConfig, setBusinessConfig] = useKV<BusinessConfig | null>('business-config', null)
  const [apiCredentials, setApiCredentials] = useKV<APICredentials | null>('api-credentials', null)

  useEffect(() => {
    if (currentUser) {
      if (businessConfig && apiCredentials) {
        setAppState('dashboard')
      } else {
        setAppState('onboarding')
      }
    } else {
      setAppState('landing')
    }
  }, [currentUser, businessConfig, apiCredentials])

  const handleGetStarted = () => {
    setAppState('auth')
  }

  const handleSignIn = (email: string, password: string) => {
    const user: User = {
      id: Date.now().toString(),
      email,
      businessName: 'Mi Negocio',
      createdAt: new Date().toISOString()
    }
    
    setCurrentUser(user)
    toast.success('¡Bienvenido de vuelta!')
  }

  const handleSignUp = (email: string, password: string, businessName: string) => {
    const user: User = {
      id: Date.now().toString(),
      email,
      businessName,
      createdAt: new Date().toISOString()
    }
    
    setCurrentUser(user)
    toast.success('¡Cuenta creada exitosamente!')
  }

  const handleOnboardingComplete = (config: BusinessConfig, credentials: APICredentials) => {
    setBusinessConfig(config)
    setApiCredentials(credentials)
    toast.success('¡Configuración completada! Bienvenido a AutomateAI')
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    setBusinessConfig(null)
    setApiCredentials(null)
    setAppState('landing')
    toast.info('Sesión cerrada')
  }

  return (
    <>
      {appState === 'landing' && (
        <LandingPage 
          onGetStarted={handleGetStarted}
          onSignIn={() => setAppState('auth')}
        />
      )}

      {appState === 'auth' && (
        <AuthForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onBack={() => setAppState('landing')}
        />
      )}

      {appState === 'onboarding' && currentUser && (
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      )}

      {appState === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onSignOut={handleSignOut} />
      )}

      <Toaster position="top-right" />
    </>
  )
}

export default App