import { getDb } from '../config/firebase'
import type { InventoryItem } from '../types'

export class InventoryService {
  private db = getDb()

  async checkStock(
    itemName: string,
    size?: string,
    color?: string
  ): Promise<{
    available: boolean
    quantity: number
    item: InventoryItem | null
  }> {
    const snapshot = await this.db
      .collection('inventory')
      .where('name', '==', itemName)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return { available: false, quantity: 0, item: null }
    }

    const doc = snapshot.docs[0]
    const item = { id: doc.id, ...doc.data() } as InventoryItem

    if (!size && !color) {
      const totalStock = item.stock.reduce((sum, s) => sum + s.quantity, 0)
      return {
        available: totalStock > 0,
        quantity: totalStock,
        item,
      }
    }

    const matchingStock = item.stock.find(
      s => (!size || s.size === size) && (!color || s.color === color)
    )

    if (!matchingStock) {
      return { available: false, quantity: 0, item }
    }

    return {
      available: matchingStock.quantity > 0,
      quantity: matchingStock.quantity,
      item,
    }
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const snapshot = await this.db.collection('inventory').get()

    const lowStockItems: InventoryItem[] = []

    for (const doc of snapshot.docs) {
      const item = { id: doc.id, ...doc.data() } as InventoryItem
      const totalStock = item.stock.reduce((sum, s) => sum + s.quantity, 0)

      if (totalStock <= (item.lowStockThreshold || 5)) {
        lowStockItems.push(item)
      }
    }

    return lowStockItems
  }

  async updateStock(
    itemId: string,
    size: string,
    color: string,
    quantityChange: number
  ): Promise<void> {
    const docRef = this.db.collection('inventory').doc(itemId)
    const doc = await docRef.get()

    if (!doc.exists) {
      throw new Error('Item not found')
    }

    const item = doc.data() as InventoryItem
    const stockIndex = item.stock.findIndex(s => s.size === size && s.color === color)

    if (stockIndex === -1) {
      throw new Error('Stock variant not found')
    }

    item.stock[stockIndex].quantity += quantityChange

    if (item.stock[stockIndex].quantity < 0) {
      item.stock[stockIndex].quantity = 0
    }

    await docRef.update({ stock: item.stock })
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<string> {
    const docRef = await this.db.collection('inventory').add(item)
    return docRef.id
  }

  async getAllItems(category?: InventoryItem['category']): Promise<InventoryItem[]> {
    let query = this.db.collection('inventory')

    if (category) {
      query = query.where('category', '==', category) as any
    }

    const snapshot = await query.get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as InventoryItem))
  }
}

export const inventoryService = new InventoryService()
