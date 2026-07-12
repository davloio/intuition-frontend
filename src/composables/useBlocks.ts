import { computed, watch, unref, type Ref, type ComputedRef } from 'vue'
import { useQuery, useSubscription } from 'villus'
import { GET_BLOCKS, GET_BLOCK_DETAIL, SUBSCRIBE_BLOCKS } from '@/services/graphqlQueries'
import type { BlockDetail, BlockConnection } from '@/types/block'

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

  const refetch = async (newLimit: number = limit, newOffset: number = offset) => {
    await execute({ variables: { limit: newLimit, offset: newOffset } })
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

interface BlockDetailQueryResult {
  blockDetail: BlockDetail | null
}

export function useFetchBlockDetail(blockNumber: Ref<number> | ComputedRef<number>) {
  const { data, isFetching, error, execute } = useQuery<BlockDetailQueryResult>({
    query: GET_BLOCK_DETAIL,
    variables: { number: unref(blockNumber) }
  })

  watch(blockNumber, (newBlockNumber) => {
    execute({ variables: { number: newBlockNumber } })
  })

  const blockDetail = computed(() => data.value?.blockDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch block details'
  })

  const refetch = async () => {
    await execute({ variables: { number: unref(blockNumber) } })
  }

  return {
    blockDetail,
    loading,
    error: errorMessage,
    refetch
  }
}
