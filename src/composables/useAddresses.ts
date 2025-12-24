import { computed } from 'vue'
import { useQuery } from 'villus'
import { GET_ADDRESSES, GET_ADDRESS_DETAIL } from '@/services/graphqlQueries'
import type { AddressConnection, AddressDetail } from '@/types/address'

interface AddressesQueryResult {
  addresses: AddressConnection
}

interface AddressDetailQueryResult {
  addressDetail: AddressDetail
}

export function useAddresses(limit: number = 20, offset: number = 0) {
  const { data, isFetching, error, execute } = useQuery<AddressesQueryResult>({
    query: GET_ADDRESSES,
    variables: { limit, offset }
  })

  const addresses = computed(() => data.value?.addresses.items || [])
  const totalCount = computed(() => data.value?.addresses.totalCount || 0)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch addresses'
  })

  const refetch = async (newLimit?: number, newOffset?: number) => {
    const variables: { limit?: number; offset?: number } = {}
    if (newLimit !== undefined) variables.limit = newLimit
    if (newOffset !== undefined) variables.offset = newOffset
    await execute({ variables })
  }

  return {
    addresses,
    totalCount,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useFetchAddressDetail(address: string) {
  const { data, isFetching, error, execute } = useQuery<AddressDetailQueryResult>({
    query: GET_ADDRESS_DETAIL,
    variables: { address }
  })

  const addressDetail = computed(() => data.value?.addressDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch address details'
  })

  const refetch = async () => {
    await execute()
  }

  return {
    addressDetail,
    loading,
    error: errorMessage,
    refetch
  }
}
