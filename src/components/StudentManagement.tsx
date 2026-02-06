import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  MagnifyingGlass,
  Plus,
  Phone,
  Envelope,
  Calendar,
  Warning,
  CheckCircle,
  TrendUp,
  UserPlus
} from '@phosphor-icons/react'
import type { Student, Lead } from '@/lib/types'

export default function StudentManagement() {
  const [students] = useKV<Student[]>('students', [])
  const [leads] = useKV<Lead[]>('leads', [])
  const [searchQuery, setSearchQuery] = useState('')

  const activeStudents = (students || []).filter(s => s.status === 'active')
  const delinquentStudents = (students || []).filter(s => s.status === 'delinquent')
  const frozenStudents = (students || []).filter(s => s.status === 'frozen')
  const atRiskStudents = (students || []).filter(s => s.absenceCount >= 3)

  const qualifiedLeads = (leads || []).filter(l => l.status === 'qualified' || l.status === 'lessonScheduled')
  const newLeads = (leads || []).filter(l => l.status === 'new')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-8 border-primary pl-6 py-2">
          <h1 className="text-5xl font-black mb-2">ESTUDIANTES</h1>
          <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
            Gestión de alumnos y prospectos
          </p>
        </div>
        <Button
          size="lg"
          className="border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase"
        >
          <Plus size={20} className="mr-2" weight="bold" />
          Nuevo Estudiante
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users size={24} weight="fill" />}
          label="Estudiantes Activos"
          value={activeStudents.length}
          color="primary"
        />
        <StatCard
          icon={<UserPlus size={24} weight="fill" />}
          label="Leads Nuevos"
          value={newLeads.length}
          color="blue"
        />
        <StatCard
          icon={<Warning size={24} weight="fill" />}
          label="En Riesgo"
          value={atRiskStudents.length}
          color="yellow"
          alert={atRiskStudents.length > 0}
        />
        <StatCard
          icon={<Warning size={24} weight="fill" />}
          label="Morosos"
          value={delinquentStudents.length}
          color="red"
          alert={delinquentStudents.length > 0}
        />
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="border-4 border-foreground">
          <TabsTrigger value="students" className="font-bold uppercase">
            Estudiantes Activos
          </TabsTrigger>
          <TabsTrigger value="leads" className="font-bold uppercase">
            Prospectos
          </TabsTrigger>
          <TabsTrigger value="atrisk" className="font-bold uppercase">
            En Riesgo
          </TabsTrigger>
          <TabsTrigger value="delinquent" className="font-bold uppercase">
            Morosos
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              weight="bold"
            />
            <Input
              placeholder="BUSCAR POR NOMBRE, EMAIL O TELÉFONO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-4 border-foreground font-bold uppercase placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <TabsContent value="students" className="space-y-4">
          <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="uppercase">Estudiantes Activos</CardTitle>
              <CardDescription className="uppercase text-xs">
                Total: {activeStudents.length} estudiantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeStudents.length === 0 ? (
                <EmptyState message="No hay estudiantes activos registrados" />
              ) : (
                <div className="space-y-3">
                  {activeStudents.slice(0, 10).map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="uppercase">Prospectos Activos</CardTitle>
              <CardDescription className="uppercase text-xs">
                Total: {(leads || []).length} prospectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(leads || []).length === 0 ? (
                <EmptyState message="No hay prospectos en el sistema" />
              ) : (
                <div className="space-y-3">
                  {(leads || []).slice(0, 10).map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atrisk" className="space-y-4">
          <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="uppercase flex items-center gap-2">
                <Warning size={24} weight="fill" className="text-yellow-600" />
                Estudiantes en Riesgo
              </CardTitle>
              <CardDescription className="uppercase text-xs">
                Estudiantes con 3+ ausencias consecutivas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {atRiskStudents.length === 0 ? (
                <EmptyState
                  message="No hay estudiantes en riesgo"
                  icon={<CheckCircle size={48} weight="fill" className="text-primary" />}
                />
              ) : (
                <div className="space-y-3">
                  {atRiskStudents.map((student) => (
                    <StudentCard key={student.id} student={student} showAlert />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delinquent" className="space-y-4">
          <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="uppercase flex items-center gap-2">
                <Warning size={24} weight="fill" className="text-destructive" />
                Cuentas Morosas
              </CardTitle>
              <CardDescription className="uppercase text-xs">
                Estudiantes con pagos pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {delinquentStudents.length === 0 ? (
                <EmptyState
                  message="No hay cuentas morosas"
                  icon={<CheckCircle size={48} weight="fill" className="text-primary" />}
                />
              ) : (
                <div className="space-y-3">
                  {delinquentStudents.map((student) => (
                    <StudentCard key={student.id} student={student} showBalance />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
  alert
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  alert?: boolean
}) {
  const colorClasses = {
    primary: 'text-primary',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-destructive'
  }

  return (
    <Card
      className={`border-4 ${alert ? 'border-destructive' : 'border-foreground'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(215,25,33,1)] hover:border-primary transition-all`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </CardTitle>
        <div className={colorClasses[color as keyof typeof colorClasses]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black">{value}</div>
      </CardContent>
    </Card>
  )
}

function StudentCard({
  student,
  showAlert,
  showBalance
}: {
  student: Student
  showAlert?: boolean
  showBalance?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-4 border-4 border-foreground hover:border-primary hover:shadow-[2px_2px_0px_0px_rgba(215,25,33,0.5)] transition-all cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center border-2 border-foreground">
          <Users size={24} weight="fill" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold uppercase">{student.name}</h3>
            <Badge
              variant={student.status === 'active' ? 'default' : 'destructive'}
              className="uppercase text-xs"
            >
              {student.belt}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {student.phone && (
              <div className="flex items-center gap-1">
                <Phone size={14} weight="fill" />
                <span>{student.phone}</span>
              </div>
            )}
            {student.email && (
              <div className="flex items-center gap-1">
                <Envelope size={14} weight="fill" />
                <span>{student.email}</span>
              </div>
            )}
          </div>
          {showAlert && (
            <div className="flex items-center gap-2 mt-2 text-yellow-600">
              <Warning size={16} weight="fill" />
              <span className="text-xs font-bold uppercase">
                {student.absenceCount} ausencias consecutivas
              </span>
            </div>
          )}
          {showBalance && student.accountBalance > 0 && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <Warning size={16} weight="fill" />
              <span className="text-xs font-bold uppercase">
                Adeuda: ${student.accountBalance.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-2 border-foreground font-bold uppercase"
      >
        Ver Perfil
      </Button>
    </div>
  )
}

function LeadCard({ lead }: { lead: Lead }) {
  const statusColors = {
    new: 'bg-blue-600',
    contacted: 'bg-yellow-600',
    qualified: 'bg-green-600',
    lessonScheduled: 'bg-purple-600',
    lessonCompleted: 'bg-primary',
    enrolled: 'bg-primary',
    lost: 'bg-muted'
  }

  const statusLabels = {
    new: 'Nuevo',
    contacted: 'Contactado',
    qualified: 'Calificado',
    lessonScheduled: 'Clase Programada',
    lessonCompleted: 'Clase Completada',
    enrolled: 'Inscrito',
    lost: 'Perdido'
  }

  return (
    <div className="flex items-center justify-between p-4 border-4 border-foreground hover:border-primary hover:shadow-[2px_2px_0px_0px_rgba(215,25,33,0.5)] transition-all cursor-pointer">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-12 h-12 bg-secondary text-secondary-foreground flex items-center justify-center border-2 border-foreground">
            <UserPlus size={24} weight="fill" />
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[lead.status]} border-2 border-card`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold uppercase">{lead.name}</h3>
            <Badge variant="secondary" className="uppercase text-xs">
              {statusLabels[lead.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone size={14} weight="fill" />
              <span>{lead.phone}</span>
            </div>
            {lead.scheduledLesson && (
              <div className="flex items-center gap-1 text-primary">
                <Calendar size={14} weight="fill" />
                <span className="font-bold">
                  {new Date(lead.scheduledLesson.date).toLocaleDateString('es-MX')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-2 border-foreground font-bold uppercase"
      >
        Gestionar
      </Button>
    </div>
  )
}

function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      {icon || <Users size={64} className="mx-auto mb-4 opacity-50" weight="fill" />}
      <p className="font-bold uppercase">{message}</p>
    </div>
  )
}
