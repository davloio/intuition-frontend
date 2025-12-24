export interface Address {
  address: string
  transactionCount?: number
  balance?: string
  isContract?: boolean
  lastSeenAt?: string
}

export interface AddressDetail {
  address: string
  firstSeenBlock: number
  lastSeenBlock: number
  createdAt: string
  updatedAt: string
  transactionCountOut?: number
  transactionCountIn?: number
  totalSent?: string
  totalReceived?: string
  balance?: string
  isContract?: boolean
}

export interface AddressConnection {
  items: Address[]
  totalCount: number
}
