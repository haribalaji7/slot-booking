export interface Offer {
  id: string
  businessId: string
  businessName: string
  title: string
  description: string
  category: string
  originalPrice: number
  offerPrice: number
  discountPercentage: number
  imageUrl?: string
  startDate: string
  endDate: string
  termsAndConditions?: string
  status: string
  totalSlots: number
  availableSlots: number
  createdAt: string
}

export interface Slot {
  id: string
  offerId: string
  slotDate: string
  startTime: string
  endTime: string
  capacity: number
  bookedCount: number
  availableCount: number
  status: string
}

export interface Booking {
  id: string
  bookingReference: string
  offerId: string
  offerTitle: string
  slotId: string
  slotDate: string
  slotStartTime: string
  slotEndTime: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  peopleCount: number
  specialNote?: string
  status: string
  createdAt: string
}

export interface Business {
  id: string
  name: string
  businessType: string
  ownerName: string
  phone: string
  email: string
  address: string
  city: string
  openingTime: string
  closingTime: string
}

export interface Dashboard {
  totalOffers: number
  activeOffers: number
  totalBookings: number
  todayBookings: number
  totalSlots: number
  conversionRate: number
}

export interface LoginResponse {
  token: string
  name: string
  email: string
}
