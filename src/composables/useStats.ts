import { computed } from 'vue'
import { useQuery, useSubscription } from 'villus'
import { GET_STATS, SUBSCRIBE_STATS } from '@/services/graphqlQueries'
import type { Stats } from '@/types/stats'

interface StatsQueryResult {
  stats: Stats
}

export function useStats() {
  const { data, isFetching, error, execute } = useQuery<StatsQueryResult>({
    query: GET_STATS
  })

  const stats = computed(() => data.value?.stats)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch stats'
  })

  const refetch = async () => {
    await execute()
  }

  return {
    stats,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useStatsSubscription() {
  const { data } = useSubscription(
    { query: SUBSCRIBE_STATS },
    ({ data }) => data?.stats
  )

  const stats = computed(() => data.value)

  return {
    stats
  }
}
