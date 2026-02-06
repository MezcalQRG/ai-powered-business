import { ai } from '../../config/genkit'
import { inventoryService } from '../../services/inventory.service'
import { z } from 'zod'

export const checkStockTool = ai.defineTool(
  {
    name: 'inventory_check_stock',
    description: 'Checks inventory stock levels for Pro Shop items',
    inputSchema: z.object({
      itemName: z.string().describe('The name of the item (e.g., "Gi", "Belt", "Rashguard")'),
      size: z.string().optional().describe('Optional size filter (e.g., "A2", "M", "Large")'),
      color: z.string().optional().describe('Optional color filter (e.g., "White", "Blue", "Black")'),
    }),
    outputSchema: z.object({
      available: z.boolean(),
      quantity: z.number(),
      price: z.number().optional(),
      message: z.string(),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
    }),
  },
  async ({ itemName, size, color }) => {
    const result = await inventoryService.checkStock(itemName, size, color)

    if (!result.item) {
      return {
        available: false,
        quantity: 0,
        message: `Sorry, we don't have "${itemName}" in our inventory. Would you like to hear about similar items?`,
      }
    }

    if (!result.available) {
      return {
        available: false,
        quantity: 0,
        price: result.item.price,
        message: size && color
          ? `Sorry, ${itemName} in size ${size} and color ${color} is currently out of stock.`
          : `Sorry, ${itemName} is currently out of stock.`,
        sizes: result.item.sizes,
        colors: result.item.colors,
      }
    }

    const sizeColorInfo = size && color
      ? ` in size ${size} and color ${color}`
      : size
      ? ` in size ${size}`
      : color
      ? ` in ${color}`
      : ''

    return {
      available: true,
      quantity: result.quantity,
      price: result.item.price,
      message: `Yes, we have ${result.quantity} ${itemName}${sizeColorInfo} available for $${result.item.price}.`,
      sizes: result.item.sizes,
      colors: result.item.colors,
    }
  }
)
