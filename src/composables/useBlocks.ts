import { computed } from 'vue'
import { useQuery, useSubscription } from 'villus'
import { GET_BLOCKS, GET_BLOCK, GET_BLOCK_DETAIL, SUBSCRIBE_BLOCKS } from '@/services/graphqlQueries'
import type { Block, BlockDetail, BlockConnection } from '@/types/block'

interface BlocksQueryResult {
  blocks: BlockConnection
}

export function useBlocks(limit: number = 20, offset: number = 0) {
  const { data, isFetching, error, execute } = useQuery<BlocksQueryResult>({
    query: GET_BLOCKS,
    variables: { limit, offset }
  })

  const blocks = computed(() => data.value?.blocks.items || [])
  const totalCount = computed(() => data.value?.blocks.totalCount || 0)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch blocks'
  })

  const refetch = async (newLimit?: number, newOffset?: number) => {
    const variables: { limit?: number; offset?: number } = {}
    if (newLimit !== undefined) variables.limit = newLimit
    if (newOffset !== undefined) variables.offset = newOffset
    await execute({ variables })
  }

  return {
    blocks,
    totalCount,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useBlocksSubscription() {
  const { data } = useSubscription(
    { query: SUBSCRIBE_BLOCKS },
    ({ data }) => data?.blocks
  )

  const latestBlock = computed(() => data.value)

  return {
    latestBlock
  }
}

interface BlockQueryResult {
  block: Block | null
}

export function useFetchBlock() {
  const fetchBlockByIdentifier = async (identifier: string | number): Promise<Block | null> => {
    try {
      const identifierStr = typeof identifier === 'number' ? identifier.toString() : identifier.replace(/,/g, '')
      
      const { execute } = useQuery<BlockQueryResult>({
        query: GET_BLOCK,
        variables: { identifier: identifierStr },
        cachePolicy: 'network-only',
        skip: true
      })
      
      const { data, error } = await execute()
      
      if (error) {
        console.error('Error fetching block:', error)
        return null
      }
      
      return data?.block || null
    } catch (err) {
      console.error('Error fetching block:', err)
      return null
    }
  }

  return {
    fetchBlockByIdentifier
  }
}

interface BlockDetailQueryResult {
  blockDetail: BlockDetail | null
}

export function useFetchBlockDetail(blockNumber: number) {
  const { data, isFetching, error, execute } = useQuery<BlockDetailQueryResult>({
    query: GET_BLOCK_DETAIL,
    variables: { number: blockNumber }
  })

  const blockDetail = computed(() => data.value?.blockDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch block details'
  })

  const refetch = async () => {
    await execute()
  }

  return {
    blockDetail,
    loading,
    error: errorMessage,
    refetch
  }
}
