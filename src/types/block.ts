export interface Block {
  number: number
  timestamp: number
  transactionCount: number
  createdAt: string
}

export interface BlockDetail {
  number: number
  timestamp: number
  transactionCount: number
  createdAt: string
  parentHash?: string
  gasUsed?: number
  gasLimit?: number
  miner?: string
  difficulty?: string
  totalDifficulty?: string
  size?: number
  extraData?: string
  logsBloom?: string
  mixHash?: string
  nonce?: string
  baseFeePerGas?: number
  blockProcessedAt?: string
}

export interface BlockConnection {
  items: Block[]
  totalCount: number
}
