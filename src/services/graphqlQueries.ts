export const GET_STATS = `
  query GetStats {
    stats {
      currentBlockHeight
      totalTransactions
      totalAddresses
    }
  }
`

export const GET_BLOCKS = `
  query GetBlocks($limit: Int, $offset: Int) {
    blocks(limit: $limit, offset: $offset) {
      items {
        number
        timestamp
        transactionCount
        createdAt
      }
      totalCount
    }
  }
`

export const GET_TRANSACTIONS = `
  query GetTransactions($limit: Int, $offset: Int, $blockNumber: Int, $address: String) {
    transactions(limit: $limit, offset: $offset, blockNumber: $blockNumber, address: $address) {
      items {
        hash
        blockNumber
        position
        createdAt
        fromAddress
        toAddress
        value
        status
      }
      totalCount
    }
  }
`

export const SUBSCRIBE_STATS = `
  subscription OnStatsUpdate {
    stats {
      currentBlockHeight
      totalTransactions
      totalAddresses
    }
  }
`

export const SUBSCRIBE_BLOCKS = `
  subscription OnNewBlock {
    blocks {
      number
      timestamp
      transactionCount
      createdAt
    }
  }
`

export const SUBSCRIBE_TRANSACTIONS = `
  subscription OnNewTransaction {
    transactions {
      hash
      blockNumber
      position
      createdAt
    }
  }
`

export const GET_BLOCK = `
  query GetBlock($identifier: String!) {
    block(identifier: $identifier) {
      number
      timestamp
      transactionCount
      createdAt
    }
  }
`

export const GET_TRANSACTION = `
  query GetTransaction($hash: String!) {
    transaction(hash: $hash) {
      hash
      blockNumber
      position
      createdAt
    }
  }
`

export const GET_BLOCK_DETAIL = `
  query GetBlockDetail($number: Int!) {
    blockDetail(number: $number) {
      number
      timestamp
      transactionCount
      createdAt
      parentHash
      gasUsed
      gasLimit
      miner
      difficulty
      totalDifficulty
      size
      extraData
      logsBloom
      mixHash
      nonce
      baseFeePerGas
      blockProcessedAt
    }
  }
`

export const GET_TRANSACTION_DETAIL = `
  query GetTransactionDetail($hash: String!) {
    transactionDetail(hash: $hash) {
      hash
      blockNumber
      position
      createdAt
      fromAddress
      toAddress
      value
      gasUsed
      gasPrice
      maxFeePerGas
      maxPriorityFeePerGas
      effectiveGasPrice
      cumulativeGasUsed
      transactionFee
      nonce
      inputData
      status
      contractAddress
      logsCount
      methodId
      transactionType
      isBridgeTransaction
      bridgeDirection
      txProcessedAt
    }
  }
`

export const GET_ADDRESSES = `
  query GetAddresses($limit: Int, $offset: Int) {
    addresses(limit: $limit, offset: $offset) {
      items {
        address
        transactionCount
        balance
        isContract
        lastSeenAt
      }
      totalCount
    }
  }
`

export const GET_ADDRESS_DETAIL = `
  query GetAddressDetail($address: String!) {
    addressDetail(address: $address) {
      address
      firstSeenBlock
      lastSeenBlock
      createdAt
      updatedAt
      transactionCountOut
      transactionCountIn
      totalSent
      totalReceived
      balance
      isContract
    }
  }
`
