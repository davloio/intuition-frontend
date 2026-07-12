import { CombinedError, handleSubscriptions, type ClientPlugin } from 'villus'
import {
  clockHeight,
  decodeTxHash,
  makeAddressDetail,
  makeAddressListItem,
  makeAddressTransactions,
  makeBlock,
  makeBlockDetail,
  makeBlocksPage,
  makeBlockTransactions,
  makeTransaction,
  makeTransactionDetail,
  makeTransactionsPage,
  makeUserGrowth,
  totalAddressesAt,
  totalTransactionsAt
} from './mockChain'

/**
 * Villus plugins that fully replace the GraphQL backend with the
 * deterministic mock chain from ./mockChain. Enabled via VITE_USE_MOCKS.
 */

// ---- live chain state ----

let height = clockHeight()
let totalTransactions = totalTransactionsAt(height)
let totalAddresses = totalAddressesAt(Math.floor(Date.now() / 1000))

function currentHeight(): number {
  height = Math.max(height, clockHeight())
  return height
}

function currentStats() {
  return {
    currentBlockHeight: currentHeight(),
    totalTransactions,
    totalAddresses
  }
}

// ---- subscriptions: bursty block production ----

type Payload = Record<string, unknown>

interface Listener {
  next: (result: { data: Payload }) => void
}

const channels = {
  stats: new Set<Listener>(),
  blocks: new Set<Listener>(),
  transactions: new Set<Listener>()
}

let tickerStarted = false

function emit(channel: keyof typeof channels, data: Payload) {
  for (const listener of channels[channel]) {
    listener.next({ data })
  }
}

// Irregular cadence: often a quick burst of 2-3 blocks within a second,
// sometimes a couple of seconds with nothing at all.
function nextDelay(): number {
  const r = Math.random()
  if (r < 0.5) return 280 + Math.random() * 420
  if (r < 0.8) return 750 + Math.random() * 650
  return 1700 + Math.random() * 1700
}

function tick() {
  height = Math.max(height + 1, clockHeight())
  const block = makeBlock(height)
  totalTransactions += block.transactionCount
  if (Math.random() < 0.07) totalAddresses += 1

  // Order matters: StatsOverview reacts to the stats event and reads the
  // latest block/transaction shortly after, so those have to go out first.
  emit('blocks', { blocks: block })
  emit('transactions', { transactions: makeTransaction(height, 0) })
  emit('stats', { stats: currentStats() })

  setTimeout(tick, nextDelay())
}

function ensureTicker() {
  if (tickerStarted) return
  tickerStarted = true
  setTimeout(tick, nextDelay())
}

export const mockSubscriptionForwarder = handleSubscriptions(operation => {
  const query = typeof operation.query === 'string' ? operation.query : ''
  const channel = query.includes('OnNewBlock')
    ? 'blocks' as const
    : query.includes('OnNewTransaction')
      ? 'transactions' as const
      : 'stats' as const

  return {
    subscribe(observer: Listener) {
      channels[channel].add(observer)
      ensureTicker()
      return {
        unsubscribe: () => {
          channels[channel].delete(observer)
        }
      }
    }
  }
})

// ---- queries ----

function resolveQuery(query: string, vars: Record<string, unknown>): Payload | null {
  const limit = typeof vars.limit === 'number' ? vars.limit : 20
  const offset = typeof vars.offset === 'number' ? vars.offset : 0

  if (query.includes('GetStats')) {
    return { stats: currentStats() }
  }

  if (query.includes('GetBlockDetail')) {
    const number = typeof vars.number === 'number' ? vars.number : NaN
    const exists = number >= 1 && number <= currentHeight()
    return { blockDetail: exists ? makeBlockDetail(number) : null }
  }

  if (query.includes('GetBlocks')) {
    return { blocks: makeBlocksPage(currentHeight(), limit, offset) }
  }

  if (query.includes('GetTransactionDetail')) {
    const hash = String(vars.hash ?? '').trim().toLowerCase()
    const ref = decodeTxHash(hash)
    const exists = ref !== null && ref.blockNumber <= currentHeight()
    return { transactionDetail: exists ? makeTransactionDetail(ref.blockNumber, ref.index) : null }
  }

  if (query.includes('GetTransactions')) {
    if (typeof vars.blockNumber === 'number') {
      return { transactions: makeBlockTransactions(vars.blockNumber, limit, offset) }
    }
    if (typeof vars.address === 'string') {
      return { transactions: makeAddressTransactions(vars.address, currentHeight(), limit, offset) }
    }
    return { transactions: makeTransactionsPage(currentHeight(), limit, offset) }
  }

  if (query.includes('GetAddressDetail')) {
    return { addressDetail: makeAddressDetail(String(vars.address ?? ''), currentHeight()) }
  }

  if (query.includes('GetAddresses')) {
    const items = []
    for (let k = 0; k < limit && offset + k < totalAddresses; k++) {
      items.push(makeAddressListItem(offset + k, currentHeight()))
    }
    return { addresses: { items, totalCount: totalAddresses } }
  }

  if (query.includes('GetUserGrowth')) {
    return { userGrowth: { dataPoints: makeUserGrowth() } }
  }

  return null
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockResolver: ClientPlugin = async ({ operation, useResult }) => {
  const query = typeof operation.query === 'string' ? operation.query : ''

  // Small latency so loading states still show up naturally.
  await sleep(120 + Math.random() * 260)

  const data = resolveQuery(query, (operation.variables ?? {}) as Record<string, unknown>)

  if (data) {
    useResult({ data, error: null }, true)
  } else {
    useResult(
      {
        data: null,
        error: new CombinedError({
          response: null,
          graphqlErrors: [`Mock resolver: unhandled operation`]
        })
      },
      true
    )
  }
}
