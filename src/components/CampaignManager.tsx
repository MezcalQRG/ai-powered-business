import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MegaphoneSimple, 
  Plus, 
  Play, 
  Pause, 
  Trash,
  Sparkle,
  Image as ImageIcon,
  Target,
  CurrencyDollar,
  TrendUp,
  Eye,
  MouseSimple,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Campaign, BusinessConfig, APICredentials } from '@/lib/types'
import { MetaAdsAPI, generateAdCopyWithAI, generateAdImageWithAI, type MetaAdAccount } from '@/lib/meta-ads-api'

interface CampaignManagerProps {
  businessConfig: BusinessConfig
  apiCredentials: APICredentials
}

export default function CampaignManager({ businessConfig, apiCredentials }: CampaignManagerProps) {
  const [campaigns, setCampaigns] = useKV<Campaign[]>('campaigns', [])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const activeCampaigns = campaigns?.filter(c => c.status === 'active') || []
  const totalSpend = campaigns?.reduce((sum, c) => sum + (c.budget || 0), 0) || 0
  const totalImpressions = campaigns?.reduce((sum, c) => sum + (c.impressions || 0), 0) || 0
  const totalClicks = campaigns?.reduce((sum, c) => sum + (c.clicks || 0), 0) || 0

  const handleCreateCampaign = (newCampaign: Campaign) => {
    setCampaigns((current) => [...(current || []), newCampaign])
    setShowCreateDialog(false)
    toast.success('Campaña creada exitosamente')
  }

  const handleUpdateCampaignStatus = (campaignId: string, newStatus: Campaign['status']) => {
    setCampaigns((current) =>
      (current || []).map(c => c.id === campaignId ? { ...c, status: newStatus } : c)
    )
    toast.success(`Campaña ${newStatus === 'active' ? 'activada' : 'pausada'}`)
  }

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns((current) => (current || []).filter(c => c.id !== campaignId))
    toast.success('Campaña eliminada')
  }

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setShowDetailsDialog(true)
  }

  if (!apiCredentials.meta?.accessToken) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Campañas Publicitarias</h1>
          <p className="text-muted-foreground text-lg">Gestiona tus anuncios en Meta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conecta tu cuenta de Meta</CardTitle>
            <CardDescription>Necesitas configurar tu Access Token de Meta para crear campañas</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Warning size={20} />
              <AlertDescription>
                Ve a Configuración para agregar tus credenciales de Meta (Facebook/Instagram)
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Campañas Publicitarias</h1>
          <p className="text-muted-foreground text-lg">Gestiona tus anuncios en Meta</p>
        </div>
        <Button size="lg" onClick={() => setShowCreateDialog(true)}>
          <Plus size={20} className="mr-2" weight="bold" />
          Nueva Campaña
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Campañas Activas"
          value={activeCampaigns.length.toString()}
          icon={<MegaphoneSimple size={24} weight="duotone" />}
        />
        <StatCard 
          label="Gasto Total"
          value={`$${totalSpend.toFixed(2)}`}
          icon={<CurrencyDollar size={24} weight="duotone" />}
        />
        <StatCard 
          label="Impresiones"
          value={totalImpressions.toLocaleString()}
          icon={<Eye size={24} weight="duotone" />}
        />
        <StatCard 
          label="Clicks"
          value={totalClicks.toLocaleString()}
          icon={<MouseSimple size={24} weight="duotone" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          {!campaigns || campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MegaphoneSimple size={48} className="mx-auto mb-4 opacity-50" weight="duotone" />
              <p>No tienes campañas activas</p>
              <p className="text-sm mt-2">Crea tu primera campaña para comenzar a generar leads</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onToggleStatus={handleUpdateCampaignStatus}
                  onDelete={handleDeleteCampaign}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showCreateDialog && (
        <CreateCampaignDialog
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreate={handleCreateCampaign}
          businessConfig={businessConfig}
          apiCredentials={apiCredentials}
        />
      )}

      {showDetailsDialog && selectedCampaign && (
        <CampaignDetailsDialog
          open={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          campaign={selectedCampaign}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function CampaignCard({
  campaign,
  onToggleStatus,
  onDelete,
  onViewDetails
}: {
  campaign: Campaign
  onToggleStatus: (id: string, status: Campaign['status']) => void
  onDelete: (id: string) => void
  onViewDetails: (campaign: Campaign) => void
}) {
  const statusColors = {
    draft: 'bg-muted-foreground',
    active: 'bg-accent',
    paused: 'bg-yellow-500',
    completed: 'bg-blue-500'
  }

  const ctr = campaign.impressions && campaign.clicks 
    ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
    : '0'

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
      <div className="flex items-start gap-4">
        {campaign.imageUrl && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={campaign.imageUrl} 
              alt={campaign.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                  <div className={`w-2 h-2 rounded-full ${statusColors[campaign.status]} mr-1`} />
                  {campaign.status === 'active' ? 'Activa' : 
                   campaign.status === 'paused' ? 'Pausada' : 
                   campaign.status === 'draft' ? 'Borrador' : 'Completada'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {campaign.platform === 'both' ? 'Facebook e Instagram' : 
                   campaign.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {(campaign.status === 'active' || campaign.status === 'paused') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleStatus(campaign.id, campaign.status === 'active' ? 'paused' : 'active')}
                >
                  {campaign.status === 'active' ? (
                    <><Pause size={16} className="mr-1" /> Pausar</>
                  ) : (
                    <><Play size={16} className="mr-1" /> Activar</>
                  )}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(campaign)}
              >
                Ver Detalles
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(campaign.id)}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>

          {campaign.adCopy && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.adCopy}</p>
          )}

          <div className="grid grid-cols-4 gap-4">
            <MetricItem label="Presupuesto" value={`$${campaign.budget}/día`} />
            <MetricItem label="Impresiones" value={campaign.impressions?.toLocaleString() || '0'} />
            <MetricItem label="Clicks" value={campaign.clicks?.toLocaleString() || '0'} />
            <MetricItem label="CTR" value={`${ctr}%`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  )
}

function CreateCampaignDialog({
  open,
  onClose,
  onCreate,
  businessConfig,
  apiCredentials
}: {
  open: boolean
  onClose: () => void
  onCreate: (campaign: Campaign) => void
  businessConfig: BusinessConfig
  apiCredentials: APICredentials
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [adAccounts, setAdAccounts] = useState<MetaAdAccount[]>([])
  const [selectedAdAccount, setSelectedAdAccount] = useState('')
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    objective: 'OUTCOME_LEADS' as const,
    platform: 'both' as Campaign['platform'],
    budget: 10,
    targetAudience: '',
    locations: [] as string[],
    ageMin: 18,
    ageMax: 65,
  })

  const [creativeData, setCreativeData] = useState({
    headline: '',
    primaryText: '',
    description: '',
    cta: 'LEARN_MORE',
    imageUrl: '',
    landingPageUrl: ''
  })

  const [generatingAI, setGeneratingAI] = useState(false)

  useEffect(() => {
    if (open && apiCredentials.meta?.accessToken) {
      loadAdAccounts()
    }
  }, [open])

  const loadAdAccounts = async () => {
    try {
      const api = new MetaAdsAPI(apiCredentials.meta!.accessToken)
      const result = await api.getAdAccounts()
      setAdAccounts(result.data)
      if (result.data.length > 0) {
        setSelectedAdAccount(result.data[0].id)
      }
    } catch (error) {
      toast.error('Error al cargar cuentas publicitarias')
      console.error(error)
    }
  }

  const handleGenerateAICopy = async () => {
    if (!creativeData.landingPageUrl) {
      toast.error('Por favor ingresa la URL de destino primero')
      return
    }

    setGeneratingAI(true)
    try {
      const businessContext = `${businessConfig.description}\nProductos: ${businessConfig.products}\nTono: ${businessConfig.tone}`
      const copy = await generateAdCopyWithAI(businessContext, campaignData.objective)
      
      setCreativeData(prev => ({
        ...prev,
        headline: copy.headline,
        primaryText: copy.primaryText,
        description: copy.description,
        cta: copy.cta
      }))
      
      toast.success('Texto generado con IA')
    } catch (error) {
      toast.error('Error al generar texto con IA')
      console.error(error)
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleGenerateAIImage = async () => {
    setGeneratingAI(true)
    try {
      const businessContext = `${businessConfig.description}\nProductos: ${businessConfig.products}`
      const imageUrl = await generateAdImageWithAI(businessContext)
      
      setCreativeData(prev => ({
        ...prev,
        imageUrl
      }))
      
      toast.success('Imagen generada con IA')
    } catch (error) {
      toast.error('Error al generar imagen con IA')
      console.error(error)
    } finally {
      setGeneratingAI(false)
    }
  }

  const handleCreateCampaign = async () => {
    if (!selectedAdAccount) {
      toast.error('Selecciona una cuenta publicitaria')
      return
    }

    setLoading(true)
    try {
      const api = new MetaAdsAPI(apiCredentials.meta!.accessToken)
      
      const campaignResult = await api.createCampaign(selectedAdAccount, {
        name: campaignData.name,
        objective: campaignData.objective,
        status: 'PAUSED',
        special_ad_categories: []
      })

      const adSetResult = await api.createAdSet(selectedAdAccount, {
        name: `${campaignData.name} - Ad Set`,
        campaign_id: campaignResult.id,
        daily_budget: campaignData.budget * 100,
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'REACH',
        targeting: {
          geo_locations: {
            countries: campaignData.locations.length > 0 ? campaignData.locations : ['US']
          },
          age_min: campaignData.ageMin,
          age_max: campaignData.ageMax
        },
        status: 'PAUSED'
      })

      const newCampaign: Campaign = {
        id: campaignResult.id,
        name: campaignData.name,
        status: 'paused',
        platform: campaignData.platform,
        budget: campaignData.budget,
        createdAt: new Date().toISOString(),
        imageUrl: creativeData.imageUrl,
        adCopy: creativeData.primaryText,
        impressions: 0,
        clicks: 0,
        conversions: 0
      }

      onCreate(newCampaign)
      onClose()
      toast.success('¡Campaña creada en Meta! Actívala cuando estés listo.')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear campaña')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear Nueva Campaña</DialogTitle>
          <DialogDescription>
            Configura tu campaña publicitaria con ayuda de IA
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Paso {step} de 3</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nombre de la Campaña *</Label>
              <Input
                id="campaign-name"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Campaña de Verano 2024"
              />
            </div>

            {adAccounts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="ad-account">Cuenta Publicitaria *</Label>
                <Select value={selectedAdAccount} onValueChange={setSelectedAdAccount}>
                  <SelectTrigger id="ad-account">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {adAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.currency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo de la Campaña *</Label>
              <Select
                value={campaignData.objective}
                onValueChange={(value: any) => setCampaignData(prev => ({ ...prev, objective: value }))}
              >
                <SelectTrigger id="objective">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUTCOME_LEADS">Generar Leads</SelectItem>
                  <SelectItem value="OUTCOME_TRAFFIC">Tráfico al Sitio Web</SelectItem>
                  <SelectItem value="OUTCOME_ENGAGEMENT">Interacción</SelectItem>
                  <SelectItem value="OUTCOME_SALES">Ventas</SelectItem>
                  <SelectItem value="OUTCOME_AWARENESS">Reconocimiento de Marca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select
                value={campaignData.platform}
                onValueChange={(value: any) => setCampaignData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger id="platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Facebook e Instagram</SelectItem>
                  <SelectItem value="facebook">Solo Facebook</SelectItem>
                  <SelectItem value="instagram">Solo Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Presupuesto Diario (USD) *</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                value={campaignData.budget}
                onChange={(e) => setCampaignData(prev => ({ ...prev, budget: Number(e.target.value) }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="landing-url">URL de Destino *</Label>
              <Input
                id="landing-url"
                type="url"
                value={creativeData.landingPageUrl}
                onChange={(e) => setCreativeData(prev => ({ ...prev, landingPageUrl: e.target.value }))}
                placeholder="https://tusitioweb.com"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkle size={20} className="text-primary" weight="fill" />
                <span className="font-medium">Generar texto publicitario con IA</span>
              </div>
              <Button 
                onClick={handleGenerateAICopy} 
                disabled={generatingAI || !creativeData.landingPageUrl}
                size="sm"
              >
                {generatingAI ? 'Generando...' : 'Generar'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Titular *</Label>
              <Input
                id="headline"
                value={creativeData.headline}
                onChange={(e) => setCreativeData(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="Atrae la atención con un titular impactante"
                maxLength={40}
              />
              <p className="text-xs text-muted-foreground">{creativeData.headline.length}/40 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-text">Texto Principal *</Label>
              <Textarea
                id="primary-text"
                value={creativeData.primaryText}
                onChange={(e) => setCreativeData(prev => ({ ...prev, primaryText: e.target.value }))}
                placeholder="Describe tu oferta y beneficios"
                rows={3}
                maxLength={125}
              />
              <p className="text-xs text-muted-foreground">{creativeData.primaryText.length}/125 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                value={creativeData.description}
                onChange={(e) => setCreativeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalle adicional"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">{creativeData.description.length}/30 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta">Llamado a la Acción *</Label>
              <Select
                value={creativeData.cta}
                onValueChange={(value) => setCreativeData(prev => ({ ...prev, cta: value }))}
              >
                <SelectTrigger id="cta">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARN_MORE">Más Información</SelectItem>
                  <SelectItem value="SHOP_NOW">Comprar Ahora</SelectItem>
                  <SelectItem value="SIGN_UP">Registrarse</SelectItem>
                  <SelectItem value="CONTACT_US">Contactar</SelectItem>
                  <SelectItem value="GET_QUOTE">Obtener Cotización</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkle size={20} className="text-primary" weight="fill" />
                <span className="font-medium">Generar imagen con IA</span>
              </div>
              <Button 
                onClick={handleGenerateAIImage} 
                disabled={generatingAI}
                size="sm"
              >
                {generatingAI ? 'Generando...' : 'Generar'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-url">URL de Imagen *</Label>
              <Input
                id="image-url"
                type="url"
                value={creativeData.imageUrl}
                onChange={(e) => setCreativeData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/imagen.jpg"
              />
              <p className="text-xs text-muted-foreground">Tamaño recomendado: 1200x628px</p>
            </div>

            {creativeData.imageUrl && (
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Vista Previa</p>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={creativeData.imageUrl} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="font-semibold">Resumen de la Campaña</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{campaignData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Presupuesto:</span>
                  <span className="font-medium">${campaignData.budget}/día</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plataforma:</span>
                  <span className="font-medium">
                    {campaignData.platform === 'both' ? 'Facebook e Instagram' : 
                     campaignData.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                Anterior
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!campaignData.name || !selectedAdAccount)) ||
                  (step === 2 && (!creativeData.headline || !creativeData.primaryText || !creativeData.description || !creativeData.landingPageUrl))
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={handleCreateCampaign} 
                disabled={loading || !creativeData.imageUrl}
              >
                {loading ? 'Creando...' : 'Crear Campaña'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CampaignDetailsDialog({
  open,
  onClose,
  campaign
}: {
  open: boolean
  onClose: () => void
  campaign: Campaign
}) {
  const ctr = campaign.impressions && campaign.clicks 
    ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
    : '0'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{campaign.name}</DialogTitle>
          <DialogDescription>Detalles y rendimiento de la campaña</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="creative">Creatividad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                  {campaign.status === 'active' ? 'Activa' : 
                   campaign.status === 'paused' ? 'Pausada' : 
                   campaign.status === 'draft' ? 'Borrador' : 'Completada'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Plataforma</p>
                <p className="font-medium">
                  {campaign.platform === 'both' ? 'Facebook e Instagram' : 
                   campaign.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Presupuesto Diario</p>
                <p className="font-medium">${campaign.budget}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creada</p>
                <p className="font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Métricas de Rendimiento</h3>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Impresiones" value={campaign.impressions?.toLocaleString() || '0'} />
                <MetricCard label="Clicks" value={campaign.clicks?.toLocaleString() || '0'} />
                <MetricCard label="CTR" value={`${ctr}%`} />
                <MetricCard label="Conversiones" value={campaign.conversions?.toString() || '0'} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="creative" className="space-y-4">
            {campaign.imageUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Imagen del Anuncio</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <img 
                    src={campaign.imageUrl} 
                    alt={campaign.name}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {campaign.adCopy && (
              <div>
                <p className="text-sm font-medium mb-2">Texto del Anuncio</p>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm">{campaign.adCopy}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-secondary/30 rounded-lg">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
