export type CreateTransportSheetRequest = {
  quota: number
  vehicleLicensePlate: string
  dispatcherId: string
  routeId: string
}

export type TransportSheet = {
  date: Date
  departureTime?: Date
  quota: number
  vehicleLicensePlate: string
  routeId: string
  dispatcherName: string
}

export type TransportSheets = TransportSheet[]
