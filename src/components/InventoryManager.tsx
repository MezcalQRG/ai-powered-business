import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ShoppingCart,
  MagnifyingGlass,
  Plus,
  Warning,
  TrendUp,
  Package
} from '@phosphor-icons/react'
import type { InventoryItem, Sale } from '@/lib/types'

export default function InventoryManager() {
  const [inventory] = useKV<InventoryItem[]>('inventory', [])
  const [sales] = useKV<Sale[]>('sales', [])
  const [searchQuery, setSearchQuery] = useState('')

  const lowStockItems = (inventory || []).filter(item => item.quantity <= item.reorderLevel)
  const outOfStockItems = (inventory || []).filter(item => item.quantity === 0)

  const totalInventoryValue = (inventory || []).reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const monthlySales = (sales || [])
    .filter(sale => {
      const saleDate = new Date(sale.timestamp)
      const now = new Date()
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, sale) => sum + sale.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="border-l-8 border-primary pl-6 py-2">
          <h1 className="text-5xl font-black mb-2">PRO SHOP</h1>
          <p className="text-muted-foreground text-lg font-bold uppercase tracking-wide">
            Gestión de inventario y ventas
          </p>
        </div>
        <Button
          size="lg"
          className="border-4 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all font-bold uppercase"
        >
          <Plus size={20} className="mr-2" weight="bold" />
          Agregar Producto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Package size={24} weight="fill" />}
          label="Total Productos"
          value={(inventory || []).length}
          color="primary"
        />
        <StatCard
          icon={<ShoppingCart size={24} weight="fill" />}
          label="Ventas del Mes"
          value={`$${monthlySales.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          icon={<Warning size={24} weight="fill" />}
          label="Stock Bajo"
          value={lowStockItems.length}
          color="yellow"
          alert={lowStockItems.length > 0}
        />
        <StatCard
          icon={<Warning size={24} weight="fill" />}
          label="Agotados"
          value={outOfStockItems.length}
          color="red"
          alert={outOfStockItems.length > 0}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            weight="bold"
          />
          <Input
            placeholder="BUSCAR PRODUCTOS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-4 border-foreground font-bold uppercase placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {lowStockItems.length > 0 && (
          <Card className="border-4 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="uppercase flex items-center gap-2">
                <Warning size={24} weight="fill" className="text-destructive" />
                Productos con Stock Bajo
              </CardTitle>
              <CardDescription className="uppercase text-xs">
                Requieren reabastecimiento inmediato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <InventoryItemCard key={item.id} item={item} lowStock />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="uppercase">Inventario Completo</CardTitle>
            <CardDescription className="uppercase text-xs">
              Todos los productos del Pro Shop
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(inventory || []).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package size={64} className="mx-auto mb-4 opacity-50" weight="fill" />
                <p className="font-bold uppercase">No hay productos en el inventario</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(inventory || []).map((item) => (
                  <InventoryItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
  value: number | string
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

function InventoryItemCard({ item, lowStock }: { item: InventoryItem; lowStock?: boolean }) {
  const categoryLabels = {
    gi: 'Gi',
    belt: 'Cinturón',
    rashguard: 'Rashguard',
    shorts: 'Shorts',
    accessories: 'Accesorios',
    other: 'Otro'
  }

  const profitMargin = item.price > 0 ? ((item.price - item.cost) / item.price * 100) : 0

  return (
    <div className="flex items-center justify-between p-4 border-4 border-foreground hover:border-primary hover:shadow-[2px_2px_0px_0px_rgba(215,25,33,0.5)] transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 bg-muted border-2 border-foreground flex items-center justify-center">
          <Package size={32} weight="fill" className="text-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold uppercase">{item.name}</h3>
            <Badge variant="secondary" className="uppercase text-xs">
              {categoryLabels[item.category]}
            </Badge>
            {item.quantity === 0 && (
              <Badge variant="destructive" className="uppercase text-xs">
                Agotado
              </Badge>
            )}
            {item.quantity > 0 && item.quantity <= item.reorderLevel && (
              <Badge variant="destructive" className="uppercase text-xs">
                Stock Bajo
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-bold">SKU: {item.sku}</span>
            <span>Stock: {item.quantity}</span>
            <span>Precio: ${item.price.toFixed(2)}</span>
            <span className="text-primary">Margen: {profitMargin.toFixed(0)}%</span>
          </div>
          {lowStock && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <Warning size={16} weight="fill" />
              <span className="text-xs font-bold uppercase">
                Reabastecer: {item.reorderQuantity} unidades
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-foreground font-bold uppercase"
        >
          Editar
        </Button>
        <Button
          size="sm"
          className="border-2 border-foreground font-bold uppercase"
        >
          Vender
        </Button>
      </div>
    </div>
  )
}
