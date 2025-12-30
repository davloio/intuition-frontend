import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { villusClient } from '@/main'
import { GET_TRANSACTION_DETAIL } from '@/services/graphqlQueries'

export function useSearch() {
  const router = useRouter()
  const searchError = ref<string | null>(null)

  const detectQueryType = (query: string): 'block_number' | 'transaction_hash' | 'address' | 'invalid' => {
    const trimmed = query.trim().replace(/,/g, '').toLowerCase()

    if (/^\d+$/.test(trimmed)) {
      return 'block_number'
    }

    if (/^0x[a-f0-9]{64}$/.test(trimmed)) {
      return 'transaction_hash'
    }

    if (/^0x[a-f0-9]{40}$/.test(trimmed)) {
      return 'address'
    }

    return 'invalid'
  }

  const search = async (query: string) => {
    if (!query || !query.trim()) {
      searchError.value = 'Please enter a search query'
      return
    }

    searchError.value = null
    const type = detectQueryType(query)

    if (type === 'invalid') {
      searchError.value = 'Invalid search query. Please enter a block number, transaction hash, or address.'
      return
    }

    if (type === 'block_number') {
      const blockNumber = parseInt(query.trim().replace(/,/g, ''))
      router.push(`/blocks/${blockNumber}`)
    } else if (type === 'transaction_hash') {
      const hash = query.trim().toLowerCase()
      
      const { data } = await villusClient.executeQuery({
        query: GET_TRANSACTION_DETAIL,
        variables: { hash },
        cachePolicy: 'network-only'
      })

      if (data?.transactionDetail) {
        router.push(`/transactions/${hash}`)
        return
      }

      searchError.value = 'Transaction not found. Note: Block hashes cannot be searched - use block numbers instead.'
    } else if (type === 'address') {
      const address = query.trim().toLowerCase()
      router.push(`/addresses/${address}`)
    }
  }

  return {
    search,
    searchError,
    detectQueryType
  }
}
