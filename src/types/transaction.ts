export interface Transaction {
  hash: string
  blockNumber: number
  position: number
  createdAt: string
}

export interface TransactionConnection {
  items: Transaction[]
  totalCount: number
}
