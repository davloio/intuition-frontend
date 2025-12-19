export const API_BASE_URL = 'http://localhost:8000'

export const ITEMS_PER_PAGE = 10

export const BLOCK_TIME_SECONDS = 12

export const STATUS_SUCCESS = 1
export const STATUS_FAILED = 0

export const ROTATING_WORDS = [
  'blocks',
  'transactions',
  'data',
  'blockchain',
  'ethereum',
  'network'
]

export const ROUTES = {
  HOME: '/',
  BLOCKS: '/blocks',
  TRANSACTIONS: '/transactions',
  BLOCK_DETAIL: '/blocks/:identifier',
  TRANSACTION_DETAIL: '/transactions/:hash'
} as const
