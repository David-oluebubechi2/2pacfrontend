export type DeliveryZone = {
  id: string
  name: string
  fee: number
}

export const deliveryZones: DeliveryZone[] = [
  { id: 'within-state', name: 'Within State', fee: 3000 },
  { id: 'south-west', name: 'South West', fee: 4000 },
  { id: 'south-east', name: 'South East', fee: 4500 },
  { id: 'south-south', name: 'South South', fee: 4500 },
  { id: 'north-central', name: 'North Central', fee: 5000 },
  { id: 'north-east', name: 'North East', fee: 5500 },
  { id: 'north-west', name: 'North West', fee: 5500 },
]

export const stateZoneMap: Record<string, string> = {
  'Lagos': 'within-state',

  'Ogun': 'south-west',
  'Oyo': 'south-west',
  'Osun': 'south-west',
  'Ondo': 'south-west',
  'Ekiti': 'south-west',

  'Abia': 'south-east',
  'Anambra': 'south-east',
  'Ebonyi': 'south-east',
  'Enugu': 'south-east',
  'Imo': 'south-east',

  'Akwa Ibom': 'south-south',
  'Bayelsa': 'south-south',
  'Cross River': 'south-south',
  'Delta': 'south-south',
  'Edo': 'south-south',
  'Rivers': 'south-south',

  'Abuja (FCT)': 'north-central',
  'Benue': 'north-central',
  'Kogi': 'north-central',
  'Kwara': 'north-central',
  'Nasarawa': 'north-central',
  'Niger': 'north-central',
  'Plateau': 'north-central',

  'Adamawa': 'north-east',
  'Bauchi': 'north-east',
  'Borno': 'north-east',
  'Gombe': 'north-east',
  'Taraba': 'north-east',
  'Yobe': 'north-east',

  'Jigawa': 'north-west',
  'Kaduna': 'north-west',
  'Kano': 'north-west',
  'Katsina': 'north-west',
  'Kebbi': 'north-west',
  'Sokoto': 'north-west',
  'Zamfara': 'north-west',
}

export const allStates = Object.keys(stateZoneMap)

export function getZoneByState(state: string) {
  const zoneId = stateZoneMap[state]
  return deliveryZones.find((z) => z.id === zoneId)
}

export type PaymentMethod = {
  id: string
  name: string
  description: string
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Card Payment', description: 'Debit or credit card (secure checkout)' },
  { id: 'transfer', name: 'Bank Transfer', description: 'Pay via direct bank transfer to our account' },
]
