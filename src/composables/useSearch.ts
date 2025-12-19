import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchBlock } from './useBlocks'
import { useFetchTransaction } from './useTransactions'

export function useSearch() {
  const router = useRouter()
  const { fetchBlockByIdentifier } = useFetchBlock()
  const { fetchTransactionByHash } = useFetchTransaction()
  const searching = ref(false)
  const searchError = ref<string | null>(null)

  const detectQueryType = (query: string): 'block_number' | 'hash' | 'invalid' => {
    const trimmed = query.trim().replace(/,/g, '')

    if (/^\d+$/.test(trimmed)) {
      return 'block_number'
    }

    if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
      return 'hash'
    }

    return 'invalid'
  }

  const search = async (query: string) => {
    if (!query || !query.trim()) {
      searchError.value = 'Please enter a search query'
      return
    }

    searching.value = true
    searchError.value = null

    const type = detectQueryType(query)

    try {
      if (type === 'block_number') {
        const blockNumber = parseInt(query.trim().replace(/,/g, ''))
        const block = await fetchBlockByIdentifier(blockNumber)
        if (block) {
          router.push(`/blocks/${blockNumber}`)
        } else {
          searchError.value = 'Block not found'
        }
      } else if (type === 'hash') {
        const trimmedQuery = query.trim()
        
        const tx = await fetchTransactionByHash(trimmedQuery)
        if (tx) {
          router.push(`/transactions/${trimmedQuery}`)
          return
        }
        
        const block = await fetchBlockByIdentifier(trimmedQuery)
        if (block) {
          router.push(`/blocks/${trimmedQuery}`)
          return
        }
        
        searchError.value = 'Hash not found. Please verify the transaction or block hash.'
      } else {
        searchError.value = 'Invalid search query. Please enter a block number or a transaction/block hash.'
      }
    } catch (err) {
      console.error('Search error:', err)
      searchError.value = 'Search failed. Please try again.'
    } finally {
      searching.value = false
    }
  }

  return {
    search,
    searching,
    searchError,
    detectQueryType
  }
}
