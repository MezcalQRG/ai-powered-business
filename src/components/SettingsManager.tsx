import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GearSix, 
  Key, 
  CheckCircle, 
  Warning,
  Pencil,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { User, BusinessConfig, APICredentials } from '@/lib/types'
import { MetaAdsAPI } from '@/lib/meta-ads-api'

interface SettingsManagerProps {
  user: User
}

export default function SettingsManager({ user }: SettingsManagerProps) {
  const [businessConfig, setBusinessConfig] = useKV<BusinessConfig | null>('business-config', null)
  const [apiCredentials, setApiCredentials] = useKV<APICredentials | null>('api-credentials', null)
  const [showEditBusinessDialog, setShowEditBusinessDialog] = useState(false)
  const [showEditCredentialsDialog, setShowEditCredentialsDialog] = useState(false)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  const testMetaConnection = async () => {
    if (!apiCredentials?.meta?.accessToken) {
      toast.error('No hay token de acceso configurado')
      return
    }

    setTestingConnection('meta')
    try {
      const api = new MetaAdsAPI(apiCredentials.meta.accessToken)
      const accounts = await api.getAdAccounts()
      
      if (accounts.data.length > 0) {
        toast.success(`Conexión exitosa! ${accounts.data.length} cuenta(s) encontrada(s)`)
      } else {
        toast.warning('Conexión exitosa pero no se encontraron cuentas publicitarias')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al conectar con Meta')
      console.error(error)
    } finally {
      setTestingConnection(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Configuración</h1>
        <p className="text-muted-foreground text-lg">Gestiona tu cuenta y servicios</p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList>
          <TabsTrigger value="business">Información del Negocio</TabsTrigger>
          <TabsTrigger value="credentials">Credenciales de API</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
              <CardDescription>
                Esta información es usada por la IA para personalizar las respuestas y contenido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessConfig ? (
                <>
                  <InfoRow label="Nombre del Negocio" value={businessConfig.businessName} />
                  <InfoRow label="Descripción" value={businessConfig.description} />
                  <InfoRow label="Productos/Servicios" value={businessConfig.products} />
                  {businessConfig.tone && <InfoRow label="Tono de Comunicación" value={businessConfig.tone} />}
                  {businessConfig.hours && <InfoRow label="Horarios" value={businessConfig.hours} />}
                  {businessConfig.location && <InfoRow label="Ubicación" value={businessConfig.location} />}
                  {businessConfig.policies && <InfoRow label="Políticas" value={businessConfig.policies} />}
                  {businessConfig.faqs && <InfoRow label="FAQs" value={businessConfig.faqs} />}
                  
                  <div className="pt-4">
                    <Button onClick={() => setShowEditBusinessDialog(true)}>
                      <Pencil size={16} className="mr-2" />
                      Editar Información
                    </Button>
                  </div>
                </>
              ) : (
                <Alert>
                  <Info size={20} />
                  <AlertDescription>
                    No hay información del negocio configurada
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-6">
          <Alert>
            <Info size={20} />
            <AlertDescription>
              Las credenciales se almacenan de forma segura. Nunca compartas tus API keys.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Proveedor de IA</CardTitle>
              <CardDescription>Modelo de IA para generar contenido y responder clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceStatus 
                name="Proveedor de IA"
                connected={!!apiCredentials?.aiProvider?.apiKey}
                details={apiCredentials?.aiProvider?.provider}
              />
              {apiCredentials?.aiProvider && (
                <div className="mt-4 space-y-2">
                  <InfoRow label="Proveedor" value={apiCredentials.aiProvider.provider} />
                  <InfoRow label="Modelo" value={apiCredentials.aiProvider.model || 'No especificado'} />
                  <InfoRow label="API Key" value="••••••••" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meta (Facebook/Instagram)</CardTitle>
                  <CardDescription>Crea y gestiona campañas publicitarias</CardDescription>
                </div>
                {apiCredentials?.meta?.accessToken && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={testMetaConnection}
                    disabled={testingConnection === 'meta'}
                  >
                    {testingConnection === 'meta' ? 'Probando...' : 'Probar Conexión'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ServiceStatus 
                name="Meta API"
                connected={!!apiCredentials?.meta?.accessToken}
              />
              {apiCredentials?.meta?.accessToken && (
                <div className="mt-4 space-y-2">
                  <InfoRow label="Access Token" value="••••••••" />
                  {apiCredentials.meta.appId && <InfoRow label="App ID" value={apiCredentials.meta.appId} />}
                </div>
              )}
              
              <Alert className="mt-4">
                <Info size={20} />
                <AlertDescription>
                  <strong>Cómo obtener tu Access Token de Meta:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Ve a <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook for Developers</a></li>
                    <li>Crea una app o selecciona una existente</li>
                    <li>Agrega el producto "Marketing API"</li>
                    <li>Ve a Tools → Graph API Explorer</li>
                    <li>Genera un Access Token con permisos: ads_management, ads_read, business_management</li>
                    <li>Copia el token y pégalo aquí</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twilio (SMS/Llamadas)</CardTitle>
              <CardDescription>Envía SMS y gestiona llamadas telefónicas</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceStatus 
                name="Twilio"
                connected={!!apiCredentials?.twilio?.accountSid}
              />
              {apiCredentials?.twilio && (
                <div className="mt-4 space-y-2">
                  <InfoRow label="Account SID" value={apiCredentials.twilio.accountSid ? '••••••••' : 'No configurado'} />
                  <InfoRow label="Auth Token" value={apiCredentials.twilio.authToken ? '••••••••' : 'No configurado'} />
                  <InfoRow label="Número de Teléfono" value={apiCredentials.twilio.phoneNumber || 'No configurado'} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ElevenLabs (Voz IA)</CardTitle>
              <CardDescription>Genera voz realista para llamadas automatizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceStatus 
                name="ElevenLabs"
                connected={!!apiCredentials?.elevenLabs?.apiKey}
              />
              {apiCredentials?.elevenLabs && (
                <div className="mt-4 space-y-2">
                  <InfoRow label="API Key" value={apiCredentials.elevenLabs.apiKey ? '••••••••' : 'No configurado'} />
                  <InfoRow label="Voice ID" value={apiCredentials.elevenLabs.voiceId || 'No configurado'} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setShowEditCredentialsDialog(true)}>
              <Key size={16} className="mr-2" />
              Editar Credenciales
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {showEditBusinessDialog && businessConfig && (
        <EditBusinessDialog
          open={showEditBusinessDialog}
          onClose={() => setShowEditBusinessDialog(false)}
          config={businessConfig}
          onSave={setBusinessConfig}
        />
      )}

      {showEditCredentialsDialog && (
        <EditCredentialsDialog
          open={showEditCredentialsDialog}
          onClose={() => setShowEditCredentialsDialog(false)}
          credentials={apiCredentials || {}}
          onSave={setApiCredentials}
        />
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ServiceStatus({ name, connected, details }: { 
  name: string
  connected: boolean
  details?: string
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
      <div className="flex items-center gap-3">
        {connected ? (
          <CheckCircle size={24} className="text-accent" weight="fill" />
        ) : (
          <Warning size={24} className="text-muted-foreground" />
        )}
        <div>
          <p className="font-medium">{name}</p>
          {details && <p className="text-sm text-muted-foreground capitalize">{details}</p>}
        </div>
      </div>
      <Badge variant={connected ? 'default' : 'secondary'}>
        {connected ? 'Conectado' : 'Desconectado'}
      </Badge>
    </div>
  )
}

function EditBusinessDialog({
  open,
  onClose,
  config,
  onSave
}: {
  open: boolean
  onClose: () => void
  config: BusinessConfig
  onSave: (config: BusinessConfig) => void
}) {
  const [formData, setFormData] = useState(config)

  const handleSave = () => {
    if (!formData.businessName || !formData.description || !formData.products) {
      toast.error('Por favor completa los campos obligatorios')
      return
    }

    onSave(formData)
    toast.success('Información actualizada')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Información del Negocio</DialogTitle>
          <DialogDescription>
            Actualiza la información que usa la IA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-businessName">Nombre del Negocio *</Label>
            <Input
              id="edit-businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción del Negocio *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-products">Productos o Servicios *</Label>
            <Textarea
              id="edit-products"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tone">Tono de Comunicación</Label>
            <Input
              id="edit-tone"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-hours">Horarios</Label>
              <Input
                id="edit-hours"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Ubicación</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-policies">Políticas</Label>
            <Textarea
              id="edit-policies"
              value={formData.policies}
              onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-faqs">Preguntas Frecuentes</Label>
            <Textarea
              id="edit-faqs"
              value={formData.faqs}
              onChange={(e) => setFormData({ ...formData, faqs: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditCredentialsDialog({
  open,
  onClose,
  credentials,
  onSave
}: {
  open: boolean
  onClose: () => void
  credentials: APICredentials
  onSave: (credentials: APICredentials) => void
}) {
  const [formData, setFormData] = useState(credentials)

  const handleSave = () => {
    onSave(formData)
    toast.success('Credenciales actualizadas')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Credenciales de API</DialogTitle>
          <DialogDescription>
            Actualiza las credenciales de tus servicios externos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Proveedor de IA</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-aiProvider">Proveedor</Label>
              <Select
                value={formData.aiProvider?.provider}
                onValueChange={(value: any) => setFormData({
                  ...formData,
                  aiProvider: { 
                    ...formData.aiProvider!, 
                    provider: value 
                  }
                })}
              >
                <SelectTrigger id="edit-aiProvider">
                  <SelectValue placeholder="Selecciona un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                  <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                  <SelectItem value="google">Google AI (Gemini)</SelectItem>
                  <SelectItem value="meta">Meta AI (Llama)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-aiApiKey">API Key</Label>
              <Input
                id="edit-aiApiKey"
                type="password"
                value={formData.aiProvider?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aiProvider: { 
                    ...formData.aiProvider!, 
                    apiKey: e.target.value 
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-aiModel">Modelo</Label>
              <Input
                id="edit-aiModel"
                value={formData.aiProvider?.model || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  aiProvider: { 
                    ...formData.aiProvider!, 
                    model: e.target.value 
                  }
                })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Meta (Facebook/Instagram)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-metaToken">Access Token</Label>
              <Input
                id="edit-metaToken"
                type="password"
                value={formData.meta?.accessToken || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  meta: { 
                    ...formData.meta!,
                    accessToken: e.target.value,
                    appId: formData.meta?.appId || '',
                    appSecret: formData.meta?.appSecret || ''
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-metaAppId">App ID (Opcional)</Label>
              <Input
                id="edit-metaAppId"
                value={formData.meta?.appId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  meta: { 
                    ...formData.meta!,
                    appId: e.target.value
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-metaAppSecret">App Secret (Opcional)</Label>
              <Input
                id="edit-metaAppSecret"
                type="password"
                value={formData.meta?.appSecret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  meta: { 
                    ...formData.meta!,
                    appSecret: e.target.value
                  }
                })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Twilio (SMS/Llamadas)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-twilioSid">Account SID</Label>
              <Input
                id="edit-twilioSid"
                value={formData.twilio?.accountSid || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  twilio: { 
                    ...formData.twilio!,
                    accountSid: e.target.value,
                    authToken: formData.twilio?.authToken || '',
                    phoneNumber: formData.twilio?.phoneNumber || ''
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-twilioToken">Auth Token</Label>
              <Input
                id="edit-twilioToken"
                type="password"
                value={formData.twilio?.authToken || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  twilio: { 
                    ...formData.twilio!,
                    authToken: e.target.value
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-twilioPhone">Número de Teléfono</Label>
              <Input
                id="edit-twilioPhone"
                value={formData.twilio?.phoneNumber || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  twilio: { 
                    ...formData.twilio!,
                    phoneNumber: e.target.value
                  }
                })}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">ElevenLabs (Voz IA)</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-elevenLabsKey">API Key</Label>
              <Input
                id="edit-elevenLabsKey"
                type="password"
                value={formData.elevenLabs?.apiKey || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  elevenLabs: { 
                    ...formData.elevenLabs!,
                    apiKey: e.target.value,
                    voiceId: formData.elevenLabs?.voiceId || ''
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-elevenLabsVoice">Voice ID</Label>
              <Input
                id="edit-elevenLabsVoice"
                value={formData.elevenLabs?.voiceId || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  elevenLabs: { 
                    ...formData.elevenLabs!,
                    voiceId: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
