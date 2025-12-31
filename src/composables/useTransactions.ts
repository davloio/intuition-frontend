import { computed, watch, unref, type Ref, type ComputedRef } from 'vue'
import { useQuery, useSubscription } from 'villus'
import { villusClient } from '@/main'
import { GET_TRANSACTIONS, GET_TRANSACTION, GET_TRANSACTION_DETAIL, SUBSCRIBE_TRANSACTIONS } from '@/services/graphqlQueries'
import type { Transaction, TransactionDetail, TransactionConnection } from '@/types/transaction'

interface TransactionsQueryResult {
  transactions: TransactionConnection
}

export function useTransactions(
  limit: number = 20,
  offset: number = 0,
  blockNumber?: Ref<number> | ComputedRef<number> | number,
  address?: Ref<string> | ComputedRef<string> | string
) {
  const blockNumberValue = typeof blockNumber === 'number' || blockNumber === undefined
    ? blockNumber
    : unref(blockNumber)

  const addressValue = typeof address === 'string' || address === undefined
    ? address
    : unref(address)

  const variables: { limit: number; offset: number; blockNumber?: number; address?: string } = {
    limit,
    offset
  }

  if (blockNumberValue !== undefined) {
    variables.blockNumber = blockNumberValue
  }

  if (addressValue !== undefined) {
    variables.address = addressValue
  }

  const { data, isFetching, error, execute } = useQuery<TransactionsQueryResult>({
    query: GET_TRANSACTIONS,
    variables
  })

  if (blockNumber && typeof blockNumber !== 'number') {
    watch(blockNumber, (newBlockNumber) => {
      const newVariables: { limit: number; offset: number; blockNumber: number; address?: string } = {
        limit,
        offset,
        blockNumber: newBlockNumber
      }
      const currentAddress = typeof address === 'string' ? address : unref(address)
      if (currentAddress !== undefined) {
        newVariables.address = currentAddress
      }
      execute({ variables: newVariables })
    })
  }

  if (address && typeof address !== 'string') {
    watch(address, (newAddress) => {
      const newVariables: { limit: number; offset: number; address: string; blockNumber?: number } = {
        limit,
        offset,
        address: newAddress
      }
      const currentBlockNumber = typeof blockNumber === 'number' ? blockNumber : unref(blockNumber)
      if (currentBlockNumber !== undefined) {
        newVariables.blockNumber = currentBlockNumber
      }
      execute({ variables: newVariables })
    })
  }

  const transactions = computed(() => data.value?.transactions.items || [])
  const totalCount = computed(() => data.value?.transactions.totalCount || 0)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch transactions'
  })

  const refetch = async (
    newLimit: number = limit,
    newOffset: number = offset,
    newBlockNumber?: number,
    newAddress?: string
  ) => {
    const newVariables: {
      limit: number
      offset: number
      blockNumber?: number
      address?: string
    } = {
      limit: newLimit,
      offset: newOffset
    }
    if (newBlockNumber !== undefined) {
      newVariables.blockNumber = newBlockNumber
    } else if (blockNumber !== undefined) {
      newVariables.blockNumber = typeof blockNumber === 'number' ? blockNumber : unref(blockNumber)
    }
    if (newAddress !== undefined) {
      newVariables.address = newAddress
    } else if (address !== undefined) {
      newVariables.address = typeof address === 'string' ? address : unref(address)
    }
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
      const { data, error } = await villusClient.executeQuery<TransactionQueryResult>({
        query: GET_TRANSACTION,
        variables: { hash },
        cachePolicy: 'network-only'
      })

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

export function useFetchTransactionDetail(hash: Ref<string> | ComputedRef<string>) {
  const { data, isFetching, error, execute } = useQuery<TransactionDetailQueryResult>({
    query: GET_TRANSACTION_DETAIL,
    variables: { hash: unref(hash) }
  })

  watch(hash, (newHash) => {
    execute({ variables: { hash: newHash } })
  })

  const transactionDetail = computed(() => data.value?.transactionDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch transaction details'
  })

  const refetch = async () => {
    await execute({ variables: { hash: unref(hash) } })
  }

  return {
    transactionDetail,
    loading,
    error: errorMessage,
    refetch
  }
}
