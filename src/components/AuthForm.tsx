import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, ArrowLeft } from '@phosphor-icons/react'
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_oklch(0.85_0_0_/_0.05)_0px,_oklch(0.85_0_0_/_0.05)_1px,_transparent_1px,_transparent_100px)]" />
      
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-foreground mb-4">
            <ShieldCheck weight="fill" className="text-primary-foreground" size={36} />
          </div>
          <div className="brand-heading text-3xl text-primary text-center">GRACIE BARRA</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Automatización Comercial</div>
        </div>

        <Card className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-foreground">
          <CardHeader>
            <CardTitle className="text-3xl uppercase font-black">
              {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription className="uppercase text-xs font-bold">
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
                  <Label htmlFor="businessName" className="uppercase font-bold text-xs">Nombre del Negocio</Label>
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
                <Label htmlFor="email" className="uppercase font-bold text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="uppercase font-bold text-xs">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-foreground"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase" disabled={loading}>
                {loading ? 'Procesando...' : mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground uppercase font-bold">
                  {mode === 'signin' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                </span>{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-primary hover:underline font-bold uppercase"
                >
                  {mode === 'signin' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </div>

              <Button type="button" variant="outline" onClick={onBack} className="w-full border-2 border-foreground font-bold uppercase hover:bg-secondary hover:text-secondary-foreground">
                <ArrowLeft size={16} className="mr-2" weight="bold" />
                Volver
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
