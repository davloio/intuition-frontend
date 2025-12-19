export const GET_STATS = `
  query GetStats {
    stats {
      currentBlockHeight
      totalTransactions
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
  query GetTransactions($limit: Int, $offset: Int, $blockNumber: Int) {
    transactions(limit: $limit, offset: $offset, blockNumber: $blockNumber) {
      items {
        hash
        blockNumber
        position
        createdAt
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
