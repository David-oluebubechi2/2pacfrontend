import type { ApiProduct } from '../api'

export type Category = {
  id: string
  name: string
  description: string
}

export type Product = ApiProduct

export const defaultCategories: Category[] = [
  { id: 'bags', name: 'Bags', description: 'Travel bags, pouches and everyday carry' },
  { id: 'shoes', name: 'Shoes', description: 'Loafers, sneakers and formal shoes' },
  { id: 'slides-sandals', name: 'Slides & Sandals', description: 'Slides, loafers and sandals' },
  { id: 'trousers', name: 'Trousers & Pants', description: 'Formal trousers, chinos and casual pants' },
  { id: 'joggers-jorts', name: 'Joggers & Jorts', description: 'Streetwear bottoms' },
  { id: 'hoodies', name: 'Hoodies', description: 'Warmups and streetwear hoodies' },
  { id: 'shirts', name: 'Shirts', description: 'T-shirts and corporate shirts' },
  { id: 'suits', name: 'Suits & Blazers', description: 'Two-piece suits, blazers and sets' },
  { id: 'caps', name: 'Caps & Headwear', description: 'Face caps, beanies and headwarmers' },
  { id: 'belts', name: 'Belts', description: 'Leather and casual belts' },
  { id: 'underwear', name: 'Underwear', description: 'Briefs and boxers' },
]

export function getProduct(id: string, list: Product[]) {
  return list.find((p) => p.id === id)
}

export function getCategory(id: string, list: Category[]) {
  return list.find((c) => c.id === id)
}

export function getProductsByCategory(slug: string, list: Product[]) {
  return list.filter((p) => p.category === slug)
}

export function formatPrice(value: number) {
  return `₦${value.toLocaleString('en-NG')}`
}
