import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightning } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AuthFormProps {
  onSignIn: (email: string, password: string) => void
  onSignUp: (email: string, password: string, businessName: string) => void
  onBack: () => void
}

export default function AuthForm({ onSignIn, onSignUp, onBack }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (mode === 'signup' && !businessName) {
      toast.error('Por favor ingresa el nombre de tu negocio')
      return
    }

    setLoading(true)
    
    setTimeout(() => {
      if (mode === 'signin') {
        onSignIn(email, password)
      } else {
        onSignUp(email, password, businessName)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.75_0.15_195_/_0.15)_0%,_transparent_50%),_radial-gradient(circle_at_70%_80%,_oklch(0.48_0.18_285_/_0.15)_0%,_transparent_50%)]" />
      
      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Lightning weight="bold" className="text-primary-foreground" size={28} />
          </div>
          <span className="text-3xl font-bold tracking-tight">AutomateAI</span>
        </div>

        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle className="text-2xl">
              {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Ingresa a tu cuenta para gestionar tu automatización' 
                : 'Comienza a automatizar tu negocio hoy'
              }
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del Negocio</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Mi Empresa SA"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {mode === 'signin' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === 'signin' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </div>

              <Button type="button" variant="ghost" onClick={onBack} className="w-full">
                Volver
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
