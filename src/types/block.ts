export interface Block {
  number: number
  timestamp: number
  transactionCount: number
  createdAt: string
}

export interface BlockConnection {
  items: Block[]
  totalCount: number
}
