import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
    latestBlockNumber: 0,
    totalBlocks: 0,
    totalTransactions: 0
  }),

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    updateStats(stats: { latestBlockNumber: number; totalBlocks: number; totalTransactions: number }) {
      this.latestBlockNumber = stats.latestBlockNumber
      this.totalBlocks = stats.totalBlocks
      this.totalTransactions = stats.totalTransactions
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    hasError: (state) => state.error !== null
  }
})
