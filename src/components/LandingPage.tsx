import { Button } from '@/components/ui/button'
import { Lightning, ChartLine, ChatCircle, CreditCard, ShieldCheck } from '@phosphor-icons/react'

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export default function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_oklch(0.98_0_0)_0%,_oklch(0.96_0_0)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_oklch(0.85_0_0_/_0.05)_0px,_oklch(0.85_0_0_/_0.05)_1px,_transparent_1px,_transparent_100px)]" />
      
      <div className="relative">
        <header className="border-b-4 border-primary bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <ShieldCheck weight="fill" className="text-primary-foreground" size={28} />
                </div>
                <div>
                  <div className="brand-heading text-2xl text-primary leading-none">GRACIE BARRA</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Automatización Comercial</div>
                </div>
              </div>
              <Button variant="outline" onClick={onSignIn} className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase">
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2 mb-8 uppercase text-sm font-bold tracking-wider">
              <ShieldCheck className="text-primary" size={20} weight="fill" />
              <span>Automatización Comercial con IA</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 text-foreground leading-[0.9]">
              TU NEGOCIO EN<br />
              <span className="text-primary">PILOTO AUTOMÁTICO</span>
            </h1>
            
            <p className="text-lg text-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Automatiza marketing, atención a clientes y cobros con IA. 
              Sin agencias. Sin múltiples herramientas. Todo en una plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button size="lg" onClick={onGetStarted} className="text-base px-10 py-6 font-bold uppercase tracking-wide border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Comenzar Gratis
              </Button>
              <Button size="lg" variant="outline" className="text-base px-10 py-6 font-bold uppercase tracking-wide border-4 border-secondary bg-background hover:bg-secondary hover:text-secondary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Ver Demo
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <FeatureCard 
                icon={<ChartLine size={32} weight="fill" />}
                title="Publicidad Inteligente"
                description="Crea anuncios en Meta con IA que genera imágenes y textos optimizados"
              />
              <FeatureCard 
                icon={<ChatCircle size={32} weight="fill" />}
                title="Atención 24/7"
                description="IA responde en WhatsApp, Messenger y SMS automáticamente"
              />
              <FeatureCard 
                icon={<Lightning size={32} weight="fill" />}
                title="Llamadas con IA"
                description="Agente de voz que atiende y califica leads por teléfono"
              />
              <FeatureCard 
                icon={<CreditCard size={32} weight="fill" />}
                title="Landing Pages"
                description="Páginas de pago listas para convertir visitantes en clientes"
              />
            </div>
          </section>

          <section className="py-16 border-t-4 border-primary">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black mb-4">¿CÓMO FUNCIONA?</h2>
              <p className="text-muted-foreground text-lg font-medium uppercase tracking-wide">Simple, rápido y poderoso</p>
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

        <footer className="border-t-4 border-secondary bg-secondary text-secondary-foreground mt-20 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="brand-heading text-2xl mb-2">GRACIE BARRA</div>
            <div className="text-sm font-medium uppercase tracking-wide opacity-80">© 2024 Gracie Barra. Todos los derechos reservados.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-card border-4 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(215,25,33,1)] hover:border-primary transition-all duration-200">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 uppercase">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-primary-foreground text-4xl font-black mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-foreground">
          {number}
        </div>
        <h3 className="font-bold text-xl mb-3 uppercase">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
