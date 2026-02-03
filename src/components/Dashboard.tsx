import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lightning, 
  ChartLine, 
  ChatCircle, 
  Phone, 
  Link, 
  GearSix,
  MegaphoneSimple,
  SignOut,
  Plus,
  TrendUp,
  Users,
  CurrencyDollar
} from '@phosphor-icons/react'
import type { User, Campaign, Conversation, Call, LandingPage, BusinessConfig, APICredentials } from '@/lib/types'
import CampaignManager from '@/components/CampaignManager'
import SettingsManager from '@/components/SettingsManager'

interface DashboardProps {
  user: User
  onSignOut: () => void
}

type View = 'overview' | 'campaigns' | 'messages' | 'calls' | 'landing-pages' | 'settings'

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [currentView, setCurrentView] = useState<View>('overview')
  const [businessConfig] = useKV<BusinessConfig | null>('business-config', null)
  const [apiCredentials] = useKV<APICredentials | null>('api-credentials', null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="flex h-screen">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          user={user}
          onSignOut={onSignOut}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {currentView === 'overview' && <OverviewView user={user} />}
            {currentView === 'campaigns' && businessConfig && apiCredentials && (
              <CampaignManager 
                businessConfig={businessConfig}
                apiCredentials={apiCredentials}
              />
            )}
            {currentView === 'messages' && <MessagesView />}
            {currentView === 'calls' && <CallsView />}
            {currentView === 'landing-pages' && <LandingPagesView />}
            {currentView === 'settings' && <SettingsManager user={user} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ currentView, onViewChange, user, onSignOut }: {
  currentView: View
  onViewChange: (view: View) => void
  user: User
  onSignOut: () => void
}) {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'overview', label: 'Inicio', icon: <ChartLine size={20} weight="duotone" /> },
    { view: 'campaigns', label: 'Campañas', icon: <MegaphoneSimple size={20} weight="duotone" /> },
    { view: 'messages', label: 'Mensajes', icon: <ChatCircle size={20} weight="duotone" /> },
    { view: 'calls', label: 'Llamadas', icon: <Phone size={20} weight="duotone" /> },
    { view: 'landing-pages', label: 'Landing Pages', icon: <Link size={20} weight="duotone" /> },
    { view: 'settings', label: 'Configuración', icon: <GearSix size={20} weight="duotone" /> },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Lightning weight="bold" className="text-primary-foreground" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">AutomateAI</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{user.businessName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentView === item.view
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={onSignOut}>
          <SignOut size={20} className="mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}

function OverviewView({ user }: { user: User }) {
  const stats = [
    { label: 'Conversaciones Activas', value: '23', change: '+12%', icon: <ChatCircle size={24} weight="duotone" />, trend: 'up' },
    { label: 'Llamadas Hoy', value: '8', change: '+5%', icon: <Phone size={24} weight="duotone" />, trend: 'up' },
    { label: 'Campañas Activas', value: '3', change: '0%', icon: <MegaphoneSimple size={24} weight="duotone" />, trend: 'neutral' },
    { label: 'Conversiones', value: '15', change: '+25%', icon: <CurrencyDollar size={24} weight="duotone" />, trend: 'up' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          ¡Bienvenido, {user.businessName}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Aquí está el resumen de tu automatización
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg hover:shadow-primary/5 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' && <TrendUp size={16} className="text-accent" weight="bold" />}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-accent' : 'text-muted-foreground'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground">vs. semana pasada</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversaciones Recientes</CardTitle>
            <CardDescription>Últimas interacciones con clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConversationItem 
              name="María González"
              channel="whatsapp"
              message="¿Tienen disponibilidad para mañana?"
              time="Hace 5 min"
              unread
            />
            <ConversationItem 
              name="Carlos López"
              channel="messenger"
              message="Gracias por la información"
              time="Hace 15 min"
            />
            <ConversationItem 
              name="Ana Martínez"
              channel="sms"
              message="¿Cuál es el precio del servicio?"
              time="Hace 1 hora"
              unread
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg">
              <Plus size={20} className="mr-2" weight="bold" />
              Crear Campaña Publicitaria
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Plus size={20} className="mr-2" weight="bold" />
              Nueva Landing Page
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <ChatCircle size={20} className="mr-2" weight="duotone" />
              Ver Todas las Conversaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ConversationItem({ name, channel, message, time, unread }: {
  name: string
  channel: 'whatsapp' | 'messenger' | 'sms'
  message: string
  time: string
  unread?: boolean
}) {
  const channelColors = {
    whatsapp: 'bg-green-500',
    messenger: 'bg-blue-500',
    sms: 'bg-purple-500'
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Users size={20} weight="duotone" className="text-primary" />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${channelColors[channel]} rounded-full border-2 border-card`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>
      {unread && (
        <div className="w-2 h-2 bg-accent rounded-full mt-2" />
      )}
    </div>
  )
}

function MessagesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Mensajes</h1>
        <p className="text-muted-foreground text-lg">Conversaciones multicanal con IA</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ConversationItem 
              name="María González"
              channel="whatsapp"
              message="¿Tienen disponibilidad para mañana?"
              time="Hace 5 min"
              unread
            />
            <ConversationItem 
              name="Carlos López"
              channel="messenger"
              message="Gracias por la información"
              time="Hace 15 min"
            />
            <ConversationItem 
              name="Ana Martínez"
              channel="sms"
              message="¿Cuál es el precio del servicio?"
              time="Hace 1 hora"
              unread
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              <div className="text-center">
                <ChatCircle size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
                <p>Selecciona una conversación para ver los mensajes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CallsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Llamadas</h1>
        <p className="text-muted-foreground text-lg">Registro de llamadas con IA de voz</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Llamadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Phone size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
            <p>No hay llamadas registradas</p>
            <p className="text-sm mt-2">Las llamadas aparecerán aquí una vez configurado Twilio y ElevenLabs</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LandingPagesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Landing Pages</h1>
          <p className="text-muted-foreground text-lg">Páginas de conversión con pago integrado</p>
        </div>
        <Button size="lg">
          <Plus size={20} className="mr-2" weight="bold" />
          Nueva Landing Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Link size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
            <p>No tienes landing pages creadas</p>
            <p className="text-sm mt-2">Crea una landing page para comenzar a convertir visitantes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
