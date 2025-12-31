export interface UserGrowthPoint {
  timestamp: string
  totalAddresses: number
  blockNumber: number
}

export interface UserGrowth {
  dataPoints: UserGrowthPoint[]
}

export interface UserGrowthResponse {
  userGrowth: UserGrowth
}
