import { computed, watch, unref, type Ref, type ComputedRef } from 'vue'
import { useQuery } from 'villus'
import { villusClient } from '@/main'
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

  const refetch = async (newLimit: number = limit, newOffset: number = offset) => {
    await execute({ variables: { limit: newLimit, offset: newOffset } })
  }

  return {
    addresses,
    totalCount,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useFetchAddressDetail(address: Ref<string> | ComputedRef<string>) {
  const { data, isFetching, error, execute } = useQuery<AddressDetailQueryResult>({
    query: GET_ADDRESS_DETAIL,
    variables: { address: unref(address) }
  })

  watch(address, (newAddress) => {
    execute({ variables: { address: newAddress } })
  })

  const addressDetail = computed(() => data.value?.addressDetail)
  const loading = computed(() => isFetching.value)
  const errorMessage = computed(() => {
    if (!error.value) return null
    return error.value.message || 'Failed to fetch address details'
  })

  const refetch = async () => {
    await execute({ variables: { address: unref(address) } })
  }

  return {
    addressDetail,
    loading,
    error: errorMessage,
    refetch
  }
}

export function useFetchAddress() {
  const fetchAddressByIdentifier = async (address: string): Promise<AddressDetail | null> => {
    try {
      const cleanAddress = address.trim().toLowerCase()

      const { data, error } = await villusClient.executeQuery<AddressDetailQueryResult>({
        query: GET_ADDRESS_DETAIL,
        variables: { address: cleanAddress },
        cachePolicy: 'network-only'
      })

      if (error) {
        console.error('Error fetching address:', error)
        return null
      }

      return data?.addressDetail || null
    } catch (err) {
      console.error('Error fetching address:', err)
      return null
    }
  }

  return {
    fetchAddressByIdentifier
  }
}
