import { Button } from '@/components/ui/button'
import { Lightning, ChartLine, ChatCircle, CreditCard } from '@phosphor-icons/react'

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.75_0.15_195_/_0.15)_0%,_transparent_50%),_radial-gradient(circle_at_70%_80%,_oklch(0.48_0.18_285_/_0.15)_0%,_transparent_50%)]" />
      
      <div className="relative">
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Lightning weight="bold" className="text-primary-foreground" size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight">AutomateAI</span>
              </div>
              <Button variant="ghost" onClick={onSignIn}>
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Lightning className="text-primary" size={16} weight="fill" />
              <span className="text-sm font-medium text-foreground">Automatización Comercial con IA</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Tu negocio en piloto automático
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Automatiza marketing, atención a clientes y cobros con IA. 
              Sin agencias. Sin múltiples herramientas. Todo en una plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" onClick={onGetStarted} className="text-base px-8 shadow-lg shadow-primary/25">
                Comenzar Gratis
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                Ver Demo
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              <FeatureCard 
                icon={<ChartLine size={28} weight="duotone" />}
                title="Publicidad Inteligente"
                description="Crea anuncios en Meta con IA que genera imágenes y textos optimizados"
              />
              <FeatureCard 
                icon={<ChatCircle size={28} weight="duotone" />}
                title="Atención 24/7"
                description="IA responde en WhatsApp, Messenger y SMS automáticamente"
              />
              <FeatureCard 
                icon={<Lightning size={28} weight="duotone" />}
                title="Llamadas con IA"
                description="Agente de voz que atiende y califica leads por teléfono"
              />
              <FeatureCard 
                icon={<CreditCard size={28} weight="duotone" />}
                title="Landing Pages"
                description="Páginas de pago listas para convertir visitantes en clientes"
              />
            </div>
          </section>

          <section className="py-16 border-t border-border/50">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
              <p className="text-muted-foreground text-lg">Simple, rápido y poderoso</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard 
                number="1"
                title="Conecta tus cuentas"
                description="Meta, Twilio, ElevenLabs y tu modelo de IA favorito"
              />
              <StepCard 
                number="2"
                title="Define tu negocio"
                description="La IA aprende sobre tus productos, tono y políticas"
              />
              <StepCard 
                number="3"
                title="Activa la automatización"
                description="La IA vende, responde y cobra por ti"
              />
            </div>
          </section>
        </main>

        <footer className="border-t border-border/50 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            © 2024 AutomateAI. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold mb-4 shadow-lg shadow-primary/25">
          {number}
        </div>
        <h3 className="font-semibold text-xl mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
