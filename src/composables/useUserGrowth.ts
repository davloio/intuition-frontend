import { computed } from 'vue'
import { useQuery } from 'villus'
import { GET_USER_GROWTH } from '@/services/graphqlQueries'
import type { UserGrowthResponse } from '@/types/userGrowth'

export function useUserGrowth() {
  const { data, isFetching, error, execute } = useQuery<UserGrowthResponse>({
    query: GET_USER_GROWTH
  })

  const userGrowth = computed(() => data.value?.userGrowth)
  const dataPoints = computed(() => data.value?.userGrowth?.dataPoints || [])
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch user growth data'
  })

  const refetch = async () => {
    await execute()
  }

  return {
    userGrowth,
    dataPoints,
    loading,
    error: errorMessage,
    refetch
  }
}
