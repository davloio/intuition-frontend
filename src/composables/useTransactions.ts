import { computed } from 'vue'
import { useQuery, useSubscription } from 'villus'
import { GET_TRANSACTIONS, GET_TRANSACTION, GET_TRANSACTION_DETAIL, SUBSCRIBE_TRANSACTIONS } from '@/services/graphqlQueries'
import type { Transaction, TransactionDetail, TransactionConnection } from '@/types/transaction'

interface TransactionsQueryResult {
  transactions: TransactionConnection
}

export function useTransactions(
  limit: number = 20,
  offset: number = 0,
  blockNumber?: number,
  address?: string
) {
  const variables: { limit: number; offset: number; blockNumber?: number; address?: string } = {
    limit,
    offset
  }
  
  if (blockNumber !== undefined) {
    variables.blockNumber = blockNumber
  }
  
  if (address !== undefined) {
    variables.address = address
  }

  const { data, isFetching, error, execute } = useQuery<TransactionsQueryResult>({
    query: GET_TRANSACTIONS,
    variables
  })

  const transactions = computed(() => data.value?.transactions.items || [])
  const totalCount = computed(() => data.value?.transactions.totalCount || 0)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch transactions'
  })

  const refetch = async (
    newLimit?: number,
    newOffset?: number,
    newBlockNumber?: number,
    newAddress?: string
  ) => {
    const newVariables: {
      limit?: number
      offset?: number
      blockNumber?: number
      address?: string
    } = {}
    if (newLimit !== undefined) newVariables.limit = newLimit
    if (newOffset !== undefined) newVariables.offset = newOffset
    if (newBlockNumber !== undefined) newVariables.blockNumber = newBlockNumber
    if (newAddress !== undefined) newVariables.address = newAddress
    await execute({ variables: newVariables })
  }

  return {
    transactions,
    totalCount,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useTransactionsSubscription() {
  const { data } = useSubscription(
    { query: SUBSCRIBE_TRANSACTIONS },
    ({ data }) => data?.transactions
  )

  const latestTransaction = computed(() => data.value)

  return {
    latestTransaction
  }
}

interface TransactionQueryResult {
  transaction: Transaction | null
}

export function useFetchTransaction() {
  const fetchTransactionByHash = async (hash: string): Promise<Transaction | null> => {
    try {
      const { execute } = useQuery<TransactionQueryResult>({
        query: GET_TRANSACTION,
        variables: { hash },
        cachePolicy: 'network-only',
        skip: true
      })
      
      const { data, error } = await execute()
      
      if (error) {
        console.error('Error fetching transaction:', error)
        return null
      }
      
      return data?.transaction || null
    } catch (err) {
      console.error('Error fetching transaction:', err)
      return null
    }
  }

  return {
    fetchTransactionByHash
  }
}

interface TransactionDetailQueryResult {
  transactionDetail: TransactionDetail | null
}

export function useFetchTransactionDetail(hash: string) {
  const { data, isFetching, error, execute } = useQuery<TransactionDetailQueryResult>({
    query: GET_TRANSACTION_DETAIL,
    variables: { hash }
  })

  const transactionDetail = computed(() => data.value?.transactionDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch transaction details'
  })

  const refetch = async () => {
    await execute()
  }

  return {
    transactionDetail,
    loading,
    error: errorMessage,
    refetch
  }
}
