import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  TrendUp,
  TrendDown,
  CurrencyDollar,
  UserPlus,
  Users,
  Warning,
  CheckCircle,
  ShoppingCart,
  Target
} from '@phosphor-icons/react'
import type { KPIMetrics } from '@/lib/types'

export default function KPIDashboard() {
  const [kpiData] = useKV<KPIMetrics>('kpi-metrics', {
    period: new Date().toISOString().slice(0, 7),
    revenue: { target: 50000, actual: 42500, percentageOfTarget: 85 },
    enrollments: { target: 10, actual: 8, newThisMonth: 8 },
    leadConversion: {
      totalLeads: 50,
      qualified: 42,
      lessonScheduled: 35,
      lessonCompleted: 30,
      enrolled: 25,
      dropRate: 18
    },
    attendance: {
      totalActiveStudents: 120,
      absenteeCount: 28,
      absenteeRate: 23.3,
      thresholdBreached: false
    },
    delinquency: {
      totalInvoices: 120,
      delinquentCount: 9,
      delinquentRate: 7.5,
      totalDelinquentAmount: 2700,
      thresholdBreached: false
    },
    retention: {
      freezeRequests: 3,
      cancellations: 2,
      retentionWorkflowsExecuted: 5,
      successfulRetentions: 3
    },
    inventory: {
      lowStockItems: 4,
      stockoutsThisMonth: 1,
      totalSales: 8500,
      profitMargin: 45
    }
  })

  const metrics = kpiData || {
    period: new Date().toISOString().slice(0, 7),
    revenue: { target: 50000, actual: 0, percentageOfTarget: 0 },
    enrollments: { target: 10, actual: 0, newThisMonth: 0 },
    leadConversion: {
      totalLeads: 0,
      qualified: 0,
      lessonScheduled: 0,
      lessonCompleted: 0,
      enrolled: 0,
      dropRate: 0
    },
    attendance: {
      totalActiveStudents: 0,
      absenteeCount: 0,
      absenteeRate: 0,
      thresholdBreached: false
    },
    delinquency: {
      totalInvoices: 0,
      delinquentCount: 0,
      delinquentRate: 0,
      totalDelinquentAmount: 0,
      thresholdBreached: false
    },
    retention: {
      freezeRequests: 0,
      cancellations: 0,
      retentionWorkflowsExecuted: 0,
      successfulRetentions: 0
    },
    inventory: {
      lowStockItems: 0,
      stockoutsThisMonth: 0,
      totalSales: 0,
      profitMargin: 0
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-l-8 border-primary pl-6 py-2">
        <h1 className="text-5xl font-black mb-2">KPIs Y MÉTRICAS</h1>
        <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
          Monitoreo de desempeño de la academia
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={<CurrencyDollar size={28} weight="fill" />}
          label="Ingresos del Mes"
          value={`$${metrics.revenue.actual.toLocaleString()}`}
          target={`Meta: $${metrics.revenue.target.toLocaleString()}`}
          percentage={metrics.revenue.percentageOfTarget}
          trend={metrics.revenue.percentageOfTarget >= 100 ? 'up' : 'neutral'}
          alert={metrics.revenue.percentageOfTarget < 70}
        />
        <KPICard
          icon={<UserPlus size={28} weight="fill" />}
          label="Nuevos Inscritos"
          value={metrics.enrollments.actual.toString()}
          target={`Meta: ${metrics.enrollments.target}/mes`}
          percentage={(metrics.enrollments.actual / metrics.enrollments.target) * 100}
          trend={metrics.enrollments.actual >= metrics.enrollments.target ? 'up' : 'neutral'}
          alert={metrics.enrollments.actual < metrics.enrollments.target * 0.5}
        />
        <KPICard
          icon={<Users size={28} weight="fill" />}
          label="Tasa de Ausentismo"
          value={`${metrics.attendance.absenteeRate.toFixed(1)}%`}
          target="Límite: 25%"
          percentage={100 - (metrics.attendance.absenteeRate / 25) * 100}
          trend={metrics.attendance.absenteeRate < 25 ? 'up' : 'down'}
          alert={metrics.attendance.thresholdBreached}
          invert
        />
        <KPICard
          icon={<Warning size={28} weight="fill" />}
          label="Tasa de Morosidad"
          value={`${metrics.delinquency.delinquentRate.toFixed(1)}%`}
          target="Límite: 8%"
          percentage={100 - (metrics.delinquency.delinquentRate / 8) * 100}
          trend={metrics.delinquency.delinquentRate < 8 ? 'up' : 'down'}
          alert={metrics.delinquency.thresholdBreached}
          invert
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase flex items-center gap-2">
              <Target size={24} weight="fill" className="text-primary" />
              Embudo de Conversión
            </CardTitle>
            <CardDescription className="uppercase text-xs">
              Seguimiento de prospectos a estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConversionStage
              label="Leads Totales"
              value={metrics.leadConversion.totalLeads}
              percentage={100}
            />
            <ConversionStage
              label="Calificados"
              value={metrics.leadConversion.qualified}
              percentage={
                (metrics.leadConversion.qualified / metrics.leadConversion.totalLeads) * 100
              }
              dropRate={
                ((metrics.leadConversion.totalLeads - metrics.leadConversion.qualified) /
                  metrics.leadConversion.totalLeads) *
                100
              }
            />
            <ConversionStage
              label="Clase Programada"
              value={metrics.leadConversion.lessonScheduled}
              percentage={
                (metrics.leadConversion.lessonScheduled / metrics.leadConversion.totalLeads) * 100
              }
              dropRate={
                ((metrics.leadConversion.qualified - metrics.leadConversion.lessonScheduled) /
                  metrics.leadConversion.qualified) *
                100
              }
            />
            <ConversionStage
              label="Clase Completada"
              value={metrics.leadConversion.lessonCompleted}
              percentage={
                (metrics.leadConversion.lessonCompleted / metrics.leadConversion.totalLeads) * 100
              }
              dropRate={
                ((metrics.leadConversion.lessonScheduled -
                  metrics.leadConversion.lessonCompleted) /
                  metrics.leadConversion.lessonScheduled) *
                100
              }
            />
            <ConversionStage
              label="Inscritos"
              value={metrics.leadConversion.enrolled}
              percentage={
                (metrics.leadConversion.enrolled / metrics.leadConversion.totalLeads) * 100
              }
              dropRate={
                ((metrics.leadConversion.lessonCompleted - metrics.leadConversion.enrolled) /
                  metrics.leadConversion.lessonCompleted) *
                100
              }
            />
            <div className="pt-4 border-t-4 border-foreground">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-sm">Tasa de Caída Promedio</span>
                <Badge
                  variant={metrics.leadConversion.dropRate > 20 ? 'destructive' : 'default'}
                  className="text-sm uppercase"
                >
                  {metrics.leadConversion.dropRate.toFixed(1)}%
                </Badge>
              </div>
              {metrics.leadConversion.dropRate > 20 && (
                <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
                  <Warning size={16} weight="fill" />
                  <span className="font-bold uppercase">Supera el límite del 20%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase flex items-center gap-2">
              <Users size={24} weight="fill" className="text-primary" />
              Retención y Asistencia
            </CardTitle>
            <CardDescription className="uppercase text-xs">
              Estado de los estudiantes activos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Estudiantes Activos</span>
                <span className="text-3xl font-black">{metrics.attendance.totalActiveStudents}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Ausentes (últimas 3 clases)</span>
                <span className="text-2xl font-black">{metrics.attendance.absenteeCount}</span>
              </div>
              <Progress
                value={(metrics.attendance.absenteeCount / metrics.attendance.totalActiveStudents) * 100}
                className="h-3 border-2 border-foreground"
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-muted-foreground uppercase">
                  Tasa: {metrics.attendance.absenteeRate.toFixed(1)}%
                </span>
                {metrics.attendance.thresholdBreached ? (
                  <span className="text-destructive font-bold uppercase flex items-center gap-1">
                    <Warning size={14} weight="fill" />
                    Sobre límite
                  </span>
                ) : (
                  <span className="text-primary font-bold uppercase flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" />
                    Dentro del límite
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Solicitudes de Congelamiento</span>
                <span className="text-2xl font-black">{metrics.retention.freezeRequests}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Cancelaciones</span>
                <span className="text-2xl font-black">{metrics.retention.cancellations}</span>
              </div>
            </div>

            <div className="pt-4 border-t-4 border-foreground">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-sm">Workflows de Retención</span>
                <span className="text-lg font-black">
                  {metrics.retention.successfulRetentions}/{metrics.retention.retentionWorkflowsExecuted}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 uppercase">
                Tasa de éxito:{' '}
                {metrics.retention.retentionWorkflowsExecuted > 0
                  ? ((metrics.retention.successfulRetentions / metrics.retention.retentionWorkflowsExecuted) * 100).toFixed(0)
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase flex items-center gap-2">
              <Warning size={24} weight="fill" className="text-destructive" />
              Morosidad y Cobros
            </CardTitle>
            <CardDescription className="uppercase text-xs">
              Estado de cuentas por cobrar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Total de Facturas</span>
                <span className="text-3xl font-black">{metrics.delinquency.totalInvoices}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Cuentas Morosas</span>
                <span className="text-2xl font-black">{metrics.delinquency.delinquentCount}</span>
              </div>
              <Progress
                value={(metrics.delinquency.delinquentCount / metrics.delinquency.totalInvoices) * 100}
                className="h-3 border-2 border-foreground"
              />
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-muted-foreground uppercase">
                  Tasa: {metrics.delinquency.delinquentRate.toFixed(1)}%
                </span>
                {metrics.delinquency.thresholdBreached ? (
                  <span className="text-destructive font-bold uppercase flex items-center gap-1">
                    <Warning size={14} weight="fill" />
                    Sobre límite (8%)
                  </span>
                ) : (
                  <span className="text-primary font-bold uppercase flex items-center gap-1">
                    <CheckCircle size={14} weight="fill" />
                    Dentro del límite
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t-4 border-foreground">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-sm">Total Adeudado</span>
                <span className="text-2xl font-black text-destructive">
                  ${metrics.delinquency.totalDelinquentAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase flex items-center gap-2">
              <ShoppingCart size={24} weight="fill" className="text-primary" />
              Pro Shop & Inventario
            </CardTitle>
            <CardDescription className="uppercase text-xs">
              Rendimiento de ventas y stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Ventas del Mes</span>
                <span className="text-3xl font-black">
                  ${metrics.inventory.totalSales.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Margen de Ganancia</span>
                <span className="text-2xl font-black">{metrics.inventory.profitMargin}%</span>
              </div>
              <Progress
                value={metrics.inventory.profitMargin}
                className="h-3 border-2 border-foreground"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Productos con Stock Bajo</span>
                <Badge
                  variant={metrics.inventory.lowStockItems > 0 ? 'destructive' : 'default'}
                  className="text-lg"
                >
                  {metrics.inventory.lowStockItems}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-sm">Agotados Este Mes</span>
                <Badge
                  variant={metrics.inventory.stockoutsThisMonth > 0 ? 'destructive' : 'default'}
                  className="text-lg"
                >
                  {metrics.inventory.stockoutsThisMonth}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({
  icon,
  label,
  value,
  target,
  percentage,
  trend,
  alert,
  invert
}: {
  icon: React.ReactNode
  label: string
  value: string
  target: string
  percentage: number
  trend: 'up' | 'down' | 'neutral'
  alert?: boolean
  invert?: boolean
}) {
  const effectiveTrend = invert && trend !== 'neutral' ? (trend === 'up' ? 'down' : 'up') : trend

  return (
    <Card
      className={`border-4 ${alert ? 'border-destructive' : 'border-foreground'} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(215,25,33,1)] hover:border-primary transition-all`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </CardTitle>
        <div className={alert ? 'text-destructive' : 'text-primary'}>{icon}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-black">{value}</div>
        <div>
          <Progress
            value={Math.min(100, Math.max(0, percentage))}
            className="h-2 border-2 border-foreground"
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground uppercase font-bold">{target}</span>
            <div className="flex items-center gap-1">
              {effectiveTrend === 'up' && (
                <TrendUp size={16} className="text-primary" weight="fill" />
              )}
              {effectiveTrend === 'down' && (
                <TrendDown size={16} className="text-destructive" weight="fill" />
              )}
              <span
                className={`text-xs font-bold uppercase ${effectiveTrend === 'up' ? 'text-primary' : effectiveTrend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}
              >
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConversionStage({
  label,
  value,
  percentage,
  dropRate
}: {
  label: string
  value: number
  percentage: number
  dropRate?: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold uppercase text-sm">{label}</span>
        <span className="text-xl font-black">{value}</span>
      </div>
      <Progress value={percentage} className="h-2 border-2 border-foreground" />
      <div className="flex items-center justify-between mt-1 text-xs">
        <span className="text-muted-foreground uppercase">{percentage.toFixed(0)}% del total</span>
        {dropRate !== undefined && dropRate > 0 && (
          <span
            className={`font-bold uppercase ${dropRate > 20 ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            Caída: {dropRate.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  )
}
