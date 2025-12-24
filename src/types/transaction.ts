export interface Transaction {
  hash: string
  blockNumber: number
  position: number
  createdAt: string
  fromAddress?: string
  toAddress?: string
  value?: string
  status?: number
}

export interface TransactionDetail {
  hash: string
  blockNumber: number
  position: number
  createdAt: string
  fromAddress?: string
  toAddress?: string
  value?: string
  gasUsed?: number
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  effectiveGasPrice?: string
  cumulativeGasUsed?: number
  transactionFee?: string
  nonce?: number
  inputData?: string
  status?: number
  contractAddress?: string
  logsCount?: number
  methodId?: string
  transactionType?: number
  isBridgeTransaction?: boolean
  bridgeDirection?: string
  txProcessedAt?: string
}

export interface TransactionConnection {
  items: Transaction[]
  totalCount: number
}
