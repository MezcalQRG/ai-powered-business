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
  CurrencyDollar,
  ShieldCheck,
  Target,
  ShoppingCart,
  GraduationCap
} from '@phosphor-icons/react'
import type { User, Campaign, Conversation, Call, LandingPage, BusinessConfig, APICredentials } from '@/lib/types'
import CampaignManager from '@/components/CampaignManager'
import SettingsManager from '@/components/SettingsManager'
import StudentManagement from '@/components/StudentManagement'
import KPIDashboard from '@/components/KPIDashboard'
import InventoryManager from '@/components/InventoryManager'

interface DashboardProps {
  user: User
  onSignOut: () => void
}

type View = 'overview' | 'students' | 'kpis' | 'campaigns' | 'messages' | 'calls' | 'landing-pages' | 'inventory' | 'settings'

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [currentView, setCurrentView] = useState<View>('overview')
  const [businessConfig] = useKV<BusinessConfig | null>('business-config', null)
  const [apiCredentials] = useKV<APICredentials | null>('api-credentials', null)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          user={user}
          onSignOut={onSignOut}
        />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/30">
          <div className="p-6 md:p-8">
            {currentView === 'overview' && <OverviewView user={user} />}
            {currentView === 'students' && <StudentManagement />}
            {currentView === 'kpis' && <KPIDashboard />}
            {currentView === 'campaigns' && businessConfig && apiCredentials && (
              <CampaignManager 
                businessConfig={businessConfig}
                apiCredentials={apiCredentials}
              />
            )}
            {currentView === 'messages' && <MessagesView />}
            {currentView === 'calls' && <CallsView />}
            {currentView === 'landing-pages' && <LandingPagesView />}
            {currentView === 'inventory' && <InventoryManager />}
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
    { view: 'overview', label: 'INICIO', icon: <ChartLine size={20} weight="fill" /> },
    { view: 'students', label: 'ESTUDIANTES', icon: <GraduationCap size={20} weight="fill" /> },
    { view: 'kpis', label: 'KPIs', icon: <Target size={20} weight="fill" /> },
    { view: 'campaigns', label: 'CAMPAÑAS', icon: <MegaphoneSimple size={20} weight="fill" /> },
    { view: 'messages', label: 'MENSAJES', icon: <ChatCircle size={20} weight="fill" /> },
    { view: 'calls', label: 'LLAMADAS', icon: <Phone size={20} weight="fill" /> },
    { view: 'landing-pages', label: 'LANDING PAGES', icon: <Link size={20} weight="fill" /> },
    { view: 'inventory', label: 'PRO SHOP', icon: <ShoppingCart size={20} weight="fill" /> },
    { view: 'settings', label: 'CONFIGURACIÓN', icon: <GearSix size={20} weight="fill" /> },
  ]

  return (
    <aside className="w-64 border-r-4 border-primary bg-secondary text-secondary-foreground flex flex-col">
      <div className="p-6 border-b-4 border-primary">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 bg-primary flex items-center justify-center">
            <ShieldCheck weight="fill" className="text-primary-foreground" size={28} />
          </div>
          <div>
            <div className="brand-heading text-xl text-primary-foreground leading-none">GRACIE BARRA</div>
            <div className="text-xs opacity-75 uppercase tracking-wide">Automatización</div>
          </div>
        </div>
        <p className="text-sm font-bold mt-3 uppercase tracking-wide">{user.businessName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all uppercase tracking-wide ${
              currentView === item.view
                ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]'
                : 'text-secondary-foreground hover:bg-foreground/10'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t-4 border-primary">
        <Button variant="ghost" className="w-full justify-start text-secondary-foreground hover:bg-foreground/10 font-bold uppercase" onClick={onSignOut}>
          <SignOut size={20} className="mr-3" weight="fill" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}

function OverviewView({ user }: { user: User }) {
  const stats = [
    { label: 'Conversaciones Activas', value: '23', change: '+12%', icon: <ChatCircle size={24} weight="fill" />, trend: 'up' },
    { label: 'Llamadas Hoy', value: '8', change: '+5%', icon: <Phone size={24} weight="fill" />, trend: 'up' },
    { label: 'Campañas Activas', value: '3', change: '0%', icon: <MegaphoneSimple size={24} weight="fill" />, trend: 'neutral' },
    { label: 'Conversiones', value: '15', change: '+25%', icon: <CurrencyDollar size={24} weight="fill" />, trend: 'up' },
  ]

  return (
    <div className="space-y-8">
      <div className="border-l-8 border-primary pl-6 py-2">
        <h1 className="text-5xl font-black mb-2">
          ¡BIENVENIDO!
        </h1>
        <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
          {user.businessName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(215,25,33,1)] hover:border-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </CardTitle>
              <div className="text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' && <TrendUp size={16} className="text-primary" weight="fill" />}
                <span className={`text-sm font-bold uppercase ${stat.trend === 'up' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground uppercase">vs. semana pasada</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase">Conversaciones Recientes</CardTitle>
            <CardDescription className="uppercase text-xs">Últimas interacciones con clientes</CardDescription>
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

        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase">Acciones Rápidas</CardTitle>
            <CardDescription className="uppercase text-xs">Gestiona tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase" size="lg">
              <Plus size={20} className="mr-2" weight="bold" />
              Crear Campaña Publicitaria
            </Button>
            <Button variant="outline" className="w-full justify-start border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase" size="lg">
              <Plus size={20} className="mr-2" weight="bold" />
              Nueva Landing Page
            </Button>
            <Button variant="outline" className="w-full justify-start border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase" size="lg">
              <ChatCircle size={20} className="mr-2" weight="fill" />
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
    <div className="flex items-start gap-3 p-3 border-2 border-foreground hover:border-primary hover:shadow-[2px_2px_0px_0px_rgba(215,25,33,0.5)] transition-all cursor-pointer">
      <div className="relative">
        <div className="w-10 h-10 bg-muted flex items-center justify-center border-2 border-foreground">
          <Users size={20} weight="fill" className="text-foreground" />
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${channelColors[channel]} border-2 border-card`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-sm uppercase">{name}</span>
          <span className="text-xs text-muted-foreground uppercase">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>
      {unread && (
        <div className="w-3 h-3 bg-primary mt-2 border-2 border-foreground" />
      )}
    </div>
  )
}

function MessagesView() {
  return (
    <div className="space-y-6">
      <div className="border-l-8 border-primary pl-6 py-2">
        <h1 className="text-5xl font-black mb-2">MENSAJES</h1>
        <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">Conversaciones multicanal con IA</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase">Conversaciones</CardTitle>
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

        <Card className="lg:col-span-2 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardContent className="p-0">
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              <div className="text-center">
                <ChatCircle size={64} className="mx-auto mb-4 opacity-50" weight="fill" />
                <p className="font-bold uppercase">Selecciona una conversación para ver los mensajes</p>
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
      <div className="border-l-8 border-primary pl-6 py-2">
        <h1 className="text-5xl font-black mb-2">LLAMADAS</h1>
        <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">Registro de llamadas con IA de voz</p>
      </div>

      <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="uppercase">Historial de Llamadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Phone size={64} className="mx-auto mb-4 opacity-50" weight="fill" />
            <p className="font-bold uppercase">No hay llamadas registradas</p>
            <p className="text-sm mt-2 uppercase">Las llamadas aparecerán aquí una vez configurado Twilio y ElevenLabs</p>
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
        <div className="border-l-8 border-primary pl-6 py-2">
          <h1 className="text-5xl font-black mb-2">LANDING PAGES</h1>
          <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">Páginas de conversión con pago integrado</p>
        </div>
        <Button size="lg" className="border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase">
          <Plus size={20} className="mr-2" weight="bold" />
          Nueva Landing Page
        </Button>
      </div>

      <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="uppercase">Tus Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Link size={64} className="mx-auto mb-4 opacity-50" weight="fill" />
            <p className="font-bold uppercase">No tienes landing pages creadas</p>
            <p className="text-sm mt-2 uppercase">Crea una landing page para comenzar a convertir visitantes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
