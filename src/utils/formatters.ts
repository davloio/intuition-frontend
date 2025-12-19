import { formatDistanceToNow } from 'date-fns'
import { formatEther, formatUnits } from 'ethers'

export function truncateHash(hash: string, startChars: number = 6, endChars: number = 4): string {
  if (!hash || hash.length <= startChars + endChars) {
    return hash
  }
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`
}

export function formatTimestamp(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })
}

export function formatFullDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function formatWeiToEth(wei: string): string {
  return parseFloat(formatEther(wei)).toFixed(4)
}

export function formatGwei(wei: string): string {
  return parseFloat(formatUnits(wei, 'gwei')).toFixed(2)
}

export function formatNumber(num: number): string {
  return num.toLocaleString()
}

export function formatGas(gas: number): string {
  return gas.toLocaleString()
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return ((value / total) * 100).toFixed(2) + '%'
}

export function shortenAddress(address: string): string {
  return truncateHash(address, 6, 4)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
