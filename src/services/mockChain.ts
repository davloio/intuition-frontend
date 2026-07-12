import type { Address, AddressDetail } from '@/types/address'
import type { Block, BlockDetail } from '@/types/block'
import type { Transaction, TransactionDetail } from '@/types/transaction'
import type { UserGrowthPoint } from '@/types/userGrowth'

/**
 * Deterministic mock chain.
 *
 * The chain "mines" one block per second since 1990-01-01T00:00:00Z, so the
 * current block height is simply the number of seconds elapsed since then.
 * Every block, transaction and address is derived from a seeded PRNG, which
 * means any block number or transaction hash resolves to the exact same data
 * on every visit — detail pages, pagination and search all stay consistent
 * without storing anything.
 */
export const GENESIS_UNIX = 631152000 // 1990-01-01T00:00:00Z

const GAS_LIMIT = 30_000_000
export const ADDRESS_POOL_SIZE = 500

const nowSec = () => Math.floor(Date.now() / 1000)

export function clockHeight(): number {
  return nowSec() - GENESIS_UNIX
}

// --- seeded PRNG helpers ---

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function hexString(rand: () => number, length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += Math.floor(rand() * 16).toString(16)
  }
  return out
}

function isoAt(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString()
}

function blockTimestamp(n: number): number {
  return Math.min(GENESIS_UNIX + n, nowSec())
}

function weiFromEth(eth: number): string {
  return (BigInt(Math.round(eth * 1e6)) * 10n ** 12n).toString()
}

// --- blocks ---

export function txCountFor(n: number): number {
  const rand = mulberry32(n ^ 0x51ed270b)
  return 1 + Math.floor(rand() * rand() * 12)
}

export function makeBlock(n: number): Block {
  const ts = blockTimestamp(n)
  return {
    number: n,
    timestamp: ts,
    transactionCount: txCountFor(n),
    createdAt: isoAt(ts)
  }
}

function makeHash32(n: number, salt: number): string {
  return '0x' + hexString(mulberry32((n ^ salt) + Math.imul(salt, 0x1003f)), 64)
}

export function makeBlockDetail(n: number): BlockDetail {
  const rand = mulberry32(n ^ 0x2545f491)
  const txCount = txCountFor(n)
  return {
    ...makeBlock(n),
    parentHash: makeHash32(n - 1, 0xb10c),
    gasUsed: Math.floor(txCount * (30_000 + rand() * 220_000)),
    gasLimit: GAS_LIMIT,
    miner: poolAddress(Math.floor(rand() * 32)),
    difficulty: '0',
    totalDifficulty: '0',
    size: 600 + Math.floor(rand() * 900) + txCount * 350,
    extraData: '0x' + hexString(rand, 16),
    logsBloom: '0x' + hexString(rand, 64),
    mixHash: makeHash32(n, 0x717c),
    nonce: '0x0000000000000000',
    baseFeePerGas: 1_000_000_000 + Math.floor(rand() * 2_500_000_000),
    blockProcessedAt: isoAt(blockTimestamp(n) + 1)
  }
}

export function makeBlocksPage(height: number, limit: number, offset: number): { items: Block[]; totalCount: number } {
  const items: Block[] = []
  for (let k = 0; k < limit; k++) {
    const n = height - offset - k
    if (n < 1) break
    items.push(makeBlock(n))
  }
  return { items, totalCount: height }
}

// --- transactions ---

function txSeed(n: number, i: number): number {
  return (Math.imul(n, 0x9e3779b1) ^ Math.imul(i + 1, 0x85ebca6b)) >>> 0
}

function hexXor(a: string, b: string): string {
  let out = ''
  for (let k = 0; k < a.length; k++) {
    out += (parseInt(a[k]!, 16) ^ parseInt(b[k]!, 16)).toString(16)
  }
  return out
}

/**
 * Transaction hashes are self-describing: the first 16 hex chars encode the
 * block number (12) and position inside the block (4), XOR-masked with a
 * keystream derived from the 48 pseudo-random suffix chars so the whole hash
 * looks random. That lets any listed hash be decoded back to its transaction
 * after a page reload, while unknown hashes fail validation.
 */
export function makeTxHash(n: number, i: number): string {
  const suffix = hexString(mulberry32(txSeed(n, i)), 48)
  const mask = hexString(mulberry32(hashSeed(suffix)), 16)
  const prefix = n.toString(16).padStart(12, '0') + i.toString(16).padStart(4, '0')
  return '0x' + hexXor(prefix, mask) + suffix
}

export function decodeTxHash(hash: string): { blockNumber: number; index: number } | null {
  if (!/^0x[0-9a-f]{64}$/.test(hash)) return null
  const suffix = hash.slice(18)
  const mask = hexString(mulberry32(hashSeed(suffix)), 16)
  const prefix = hexXor(hash.slice(2, 18), mask)
  const blockNumber = parseInt(prefix.slice(0, 12), 16)
  const index = parseInt(prefix.slice(12, 16), 16)
  if (blockNumber < 1 || index >= txCountFor(blockNumber)) return null
  if (makeTxHash(blockNumber, index) !== hash) return null
  return { blockNumber, index }
}

export function makeTransaction(n: number, i: number): Transaction {
  return {
    hash: makeTxHash(n, i),
    blockNumber: n,
    position: i,
    createdAt: isoAt(blockTimestamp(n))
  }
}

export function makeTransactionDetail(n: number, i: number): TransactionDetail {
  const rand = mulberry32(txSeed(n, i) ^ 0xde7a11)
  const gasUsed = 21_000 + Math.floor(rand() * rand() * 480_000)
  const gasPriceWei = 1_000_000_000 + Math.floor(rand() * 45_000_000_000)
  const isTransfer = rand() < 0.55
  const isBridge = !isTransfer && rand() < 0.12
  const detail: TransactionDetail = {
    ...makeTransaction(n, i),
    fromAddress: poolAddress(Math.floor(rand() * ADDRESS_POOL_SIZE)),
    toAddress: poolAddress(Math.floor(rand() * ADDRESS_POOL_SIZE)),
    value: isTransfer || isBridge ? weiFromEth(rand() * rand() * 42) : '0',
    gasUsed,
    gasPrice: String(gasPriceWei),
    maxFeePerGas: String(gasPriceWei + 2_000_000_000),
    maxPriorityFeePerGas: String(Math.floor(gasPriceWei * 0.1)),
    effectiveGasPrice: String(gasPriceWei),
    cumulativeGasUsed: gasUsed + Math.floor(rand() * 8_000_000),
    transactionFee: (BigInt(gasUsed) * BigInt(gasPriceWei)).toString(),
    nonce: Math.floor(rand() * 42_000),
    inputData: isTransfer ? '0x' : '0x' + hexString(rand, 8 + Math.floor(rand() * 56) * 2),
    status: rand() < 0.965 ? 1 : 0,
    logsCount: isTransfer ? 0 : Math.floor(rand() * 9),
    methodId: isTransfer ? undefined : '0x' + hexString(rand, 8),
    transactionType: 2,
    isBridgeTransaction: isBridge,
    txProcessedAt: isoAt(blockTimestamp(n) + 1)
  }
  if (isBridge) {
    detail.bridgeDirection = rand() < 0.5 ? 'inbound' : 'outbound'
  }
  return detail
}

export function makeBlockTransactions(n: number, limit: number, offset: number): { items: Transaction[]; totalCount: number } {
  const count = n >= 1 ? txCountFor(n) : 0
  const items: Transaction[] = []
  for (let i = offset; i < Math.min(offset + limit, count); i++) {
    items.push(makeTransaction(n, i))
  }
  return { items, totalCount: count }
}

export function makeTransactionsPage(height: number, limit: number, offset: number): { items: Transaction[]; totalCount: number } {
  const items: Transaction[] = []
  let n = height
  let skip = offset
  while (items.length < limit && n > 0) {
    const count = txCountFor(n)
    if (skip >= count) {
      skip -= count
      n--
      continue
    }
    for (let i = skip; i < count && items.length < limit; i++) {
      items.push(makeTransaction(n, count - 1 - i))
    }
    skip = 0
    n--
  }
  return { items, totalCount: totalTransactionsAt(height) }
}

// --- addresses ---

export function poolAddress(i: number): string {
  return '0x' + hexString(mulberry32(0x5eed ^ Math.imul(i + 1, 0x9e3779b1)), 40)
}

interface AddressProfile {
  txIn: number
  txOut: number
  balanceEth: number
  sentEth: number
  isContract: boolean
  firstSeen: number
  lastSeen: number
}

function addressProfile(address: string, height: number): AddressProfile {
  const rand = mulberry32(hashSeed(address))
  const txIn = 1 + Math.floor(Math.pow(rand(), 2.2) * 60_000)
  const txOut = 1 + Math.floor(Math.pow(rand(), 2.2) * 60_000)
  const balanceEth = Math.pow(10, rand() * 5 - 1)
  const sentEth = balanceEth * (0.2 + rand() * 4)
  const isContract = rand() < 0.16
  const lastSeen = Math.max(1, height - Math.floor(rand() * 40_000))
  const firstSeen = Math.max(1, lastSeen - Math.floor(rand() * 600_000_000))
  return { txIn, txOut, balanceEth, sentEth, isContract, firstSeen, lastSeen }
}

export function makeAddressListItem(i: number, height: number): Address {
  const address = poolAddress(i)
  const p = addressProfile(address, height)
  return {
    address,
    transactionCount: p.txIn + p.txOut,
    balance: weiFromEth(p.balanceEth),
    isContract: p.isContract,
    lastSeenAt: isoAt(blockTimestamp(p.lastSeen))
  }
}

export function makeAddressDetail(address: string, height: number): AddressDetail {
  const normalized = address.trim().toLowerCase()
  const p = addressProfile(normalized, height)
  return {
    address: normalized,
    firstSeenBlock: p.firstSeen,
    lastSeenBlock: p.lastSeen,
    createdAt: isoAt(blockTimestamp(p.firstSeen)),
    updatedAt: isoAt(blockTimestamp(p.lastSeen)),
    transactionCountOut: p.txOut,
    transactionCountIn: p.txIn,
    totalSent: weiFromEth(p.sentEth),
    totalReceived: weiFromEth(p.sentEth + p.balanceEth),
    balance: weiFromEth(p.balanceEth),
    isContract: p.isContract
  }
}

export function makeAddressTransactions(address: string, height: number, limit: number, offset: number): { items: Transaction[]; totalCount: number } {
  const normalized = address.trim().toLowerCase()
  const p = addressProfile(normalized, height)
  const totalCount = p.txIn + p.txOut
  const avgGap = Math.max(1, Math.floor((p.lastSeen - p.firstSeen) / totalCount))
  const seed = hashSeed(normalized)
  const items: Transaction[] = []
  for (let k = offset; k < Math.min(offset + limit, totalCount); k++) {
    const rand = mulberry32(seed ^ Math.imul(k + 1, 0x9e3779b1))
    const n = Math.max(1, p.lastSeen - Math.floor(k * avgGap * (0.4 + rand() * 1.2)))
    items.push(makeTransaction(n, Math.floor(rand() * txCountFor(n))))
  }
  return { items, totalCount }
}

// --- network stats ---

export function totalTransactionsAt(height: number): number {
  return Math.floor(height * 3.8)
}

export function totalAddressesAt(unixSeconds: number): number {
  const d = unixSeconds / 86400 - 20500
  return Math.floor(455_000 + 60 * d + 0.09 * d * d + 40 * Math.sin(d / 2.9))
}

export function makeUserGrowth(days: number = 45): UserGrowthPoint[] {
  const points: UserGrowthPoint[] = []
  const today = Math.floor(nowSec() / 86400) * 86400
  for (let k = days - 1; k >= 0; k--) {
    const t = today - k * 86400
    points.push({
      timestamp: isoAt(t),
      totalAddresses: totalAddressesAt(t),
      blockNumber: t - GENESIS_UNIX
    })
  }
  return points
}
