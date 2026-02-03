import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lightning, ArrowRight, ArrowLeft, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { BusinessConfig, APICredentials } from '@/lib/types'

interface OnboardingWizardProps {
  onComplete: (config: BusinessConfig, credentials: APICredentials) => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>({
    businessName: '',
    description: '',
    products: '',
    tone: '',
    hours: '',
    location: '',
    policies: '',
    faqs: ''
  })

  const [credentials, setCredentials] = useState<APICredentials>({})

  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step === 1) {
      if (!businessConfig.businessName || !businessConfig.description || !businessConfig.products) {
        toast.error('Por favor completa todos los campos obligatorios')
        return
      }
    }
    
    if (step === 2) {
      if (!credentials.aiProvider?.provider || !credentials.aiProvider?.apiKey) {
        toast.error('Debes configurar al menos un proveedor de IA')
        return
      }
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      toast.success('¡Configuración completada!')
      onComplete(businessConfig, credentials)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_oklch(0.75_0.15_195_/_0.15)_0%,_transparent_50%),_radial-gradient(circle_at_70%_80%,_oklch(0.48_0.18_285_/_0.15)_0%,_transparent_50%)]" />
      
      <div className="relative max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Lightning weight="bold" className="text-primary-foreground" size={28} />
          </div>
          <span className="text-3xl font-bold tracking-tight">AutomateAI</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Paso {step} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          {step === 1 && (
            <BusinessInfoStep 
              config={businessConfig}
              onChange={setBusinessConfig}
            />
          )}
          
          {step === 2 && (
            <CredentialsStep
              credentials={credentials}
              onChange={setCredentials}
            />
          )}
          
          {step === 3 && (
            <ReviewStep
              config={businessConfig}
              credentials={credentials}
            />
          )}

          <div className="p-6 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2" size={16} />
              Anterior
            </Button>
            
            <Button onClick={handleNext}>
              {step === totalSteps ? (
                <>
                  <Check className="mr-2" size={16} weight="bold" />
                  Finalizar
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="ml-2" size={16} />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function BusinessInfoStep({ config, onChange }: { 
  config: BusinessConfig
  onChange: (config: BusinessConfig) => void 
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Información del Negocio</CardTitle>
        <CardDescription>
          Esta información ayudará a la IA a entender tu negocio y responder apropiadamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Nombre del Negocio *</Label>
          <Input
            id="businessName"
            value={config.businessName}
            onChange={(e) => onChange({ ...config, businessName: e.target.value })}
            placeholder="Mi Empresa SA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción del Negocio *</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => onChange({ ...config, description: e.target.value })}
            placeholder="Describe qué hace tu negocio, tu propuesta de valor..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="products">Productos o Servicios *</Label>
          <Textarea
            id="products"
            value={config.products}
            onChange={(e) => onChange({ ...config, products: e.target.value })}
            placeholder="Lista tus productos/servicios principales con precios si aplica"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tono de Comunicación</Label>
          <Input
            id="tone"
            value={config.tone}
            onChange={(e) => onChange({ ...config, tone: e.target.value })}
            placeholder="Ej: Profesional y amigable, casual, formal..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hours">Horarios de Atención</Label>
            <Input
              id="hours"
              value={config.hours}
              onChange={(e) => onChange({ ...config, hours: e.target.value })}
              placeholder="Lun-Vie 9am-6pm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={config.location}
              onChange={(e) => onChange({ ...config, location: e.target.value })}
              placeholder="Ciudad, País"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="policies">Políticas Importantes</Label>
          <Textarea
            id="policies"
            value={config.policies}
            onChange={(e) => onChange({ ...config, policies: e.target.value })}
            placeholder="Políticas de devolución, envío, garantías..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faqs">Preguntas Frecuentes</Label>
          <Textarea
            id="faqs"
            value={config.faqs}
            onChange={(e) => onChange({ ...config, faqs: e.target.value })}
            placeholder="¿Preguntas comunes que tus clientes hacen? Agrégalas aquí..."
            rows={3}
          />
        </div>
      </CardContent>
    </>
  )
}

function CredentialsStep({ credentials, onChange }: {
  credentials: APICredentials
  onChange: (credentials: APICredentials) => void
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Conecta tus Servicios</CardTitle>
        <CardDescription>
          Conecta las APIs que usarás. Puedes agregar más tarde desde configuración.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Proveedor de IA *</h3>
            <span className="text-xs text-muted-foreground">Requerido</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aiProvider">Proveedor</Label>
              <Select
                value={credentials.aiProvider?.provider}
                onValueChange={(value) => onChange({
                  ...credentials,
                  aiProvider: { 
                    ...credentials.aiProvider, 
                    provider: value as any,
                    apiKey: credentials.aiProvider?.apiKey || '',
                    model: credentials.aiProvider?.model || ''
                  }
                })}
              >
                <SelectTrigger id="aiProvider">
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
              <Label htmlFor="aiApiKey">API Key</Label>
              <Input
                id="aiApiKey"
                type="password"
                value={credentials.aiProvider?.apiKey || ''}
                onChange={(e) => onChange({
                  ...credentials,
                  aiProvider: { 
                    ...credentials.aiProvider!, 
                    apiKey: e.target.value 
                  }
                })}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiModel">Modelo</Label>
              <Input
                id="aiModel"
                value={credentials.aiProvider?.model || ''}
                onChange={(e) => onChange({
                  ...credentials,
                  aiProvider: { 
                    ...credentials.aiProvider!, 
                    model: e.target.value 
                  }
                })}
                placeholder="gpt-4, claude-3-opus, gemini-pro..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Meta (Facebook/Instagram)</h3>
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaToken">Access Token</Label>
              <Input
                id="metaToken"
                type="password"
                value={credentials.meta?.accessToken || ''}
                onChange={(e) => onChange({
                  ...credentials,
                  meta: { 
                    ...credentials.meta!, 
                    accessToken: e.target.value,
                    appId: credentials.meta?.appId || '',
                    appSecret: credentials.meta?.appSecret || ''
                  }
                })}
                placeholder="EAAxxxxx..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Twilio (SMS/Llamadas)</h3>
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twilioSid">Account SID</Label>
              <Input
                id="twilioSid"
                value={credentials.twilio?.accountSid || ''}
                onChange={(e) => onChange({
                  ...credentials,
                  twilio: { 
                    ...credentials.twilio!,
                    accountSid: e.target.value,
                    authToken: credentials.twilio?.authToken || '',
                    phoneNumber: credentials.twilio?.phoneNumber || ''
                  }
                })}
                placeholder="ACxxxxx..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">ElevenLabs (Voz IA)</h3>
            <span className="text-xs text-muted-foreground">Opcional</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="elevenLabsKey">API Key</Label>
              <Input
                id="elevenLabsKey"
                type="password"
                value={credentials.elevenLabs?.apiKey || ''}
                onChange={(e) => onChange({
                  ...credentials,
                  elevenLabs: { 
                    ...credentials.elevenLabs!,
                    apiKey: e.target.value,
                    voiceId: credentials.elevenLabs?.voiceId || ''
                  }
                })}
                placeholder="xxxxx..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}

function ReviewStep({ config, credentials }: {
  config: BusinessConfig
  credentials: APICredentials
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Resumen de Configuración</CardTitle>
        <CardDescription>
          Revisa tu configuración antes de finalizar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Información del Negocio</h3>
          <div className="grid gap-3">
            <InfoRow label="Negocio" value={config.businessName} />
            <InfoRow label="Descripción" value={config.description} />
            <InfoRow label="Productos/Servicios" value={config.products} />
            {config.tone && <InfoRow label="Tono" value={config.tone} />}
            {config.hours && <InfoRow label="Horarios" value={config.hours} />}
            {config.location && <InfoRow label="Ubicación" value={config.location} />}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Servicios Conectados</h3>
          <div className="grid gap-2">
            <ServiceStatus 
              name="Proveedor de IA" 
              connected={!!credentials.aiProvider?.apiKey}
              details={credentials.aiProvider?.provider}
            />
            <ServiceStatus 
              name="Meta (Facebook/Instagram)" 
              connected={!!credentials.meta?.accessToken}
            />
            <ServiceStatus 
              name="Twilio (SMS/Llamadas)" 
              connected={!!credentials.twilio?.accountSid}
            />
            <ServiceStatus 
              name="ElevenLabs (Voz IA)" 
              connected={!!credentials.elevenLabs?.apiKey}
            />
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>¡Listo para comenzar!</strong> Podrás modificar esta configuración en cualquier momento desde el panel de control.
          </p>
        </div>
      </CardContent>
    </>
  )
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-sm text-muted-foreground min-w-[140px]">{label}:</span>
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
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-accent' : 'bg-muted-foreground'}`} />
        <span className="text-sm font-medium">{name}</span>
        {details && <span className="text-xs text-muted-foreground">({details})</span>}
      </div>
      <span className="text-xs text-muted-foreground">
        {connected ? 'Conectado' : 'No configurado'}
      </span>
    </div>
  )
}
