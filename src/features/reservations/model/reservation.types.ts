export interface Reservation {
  id: string
  userId: string
  laboratoryId?: string
  resourceId?: string
  reservationDate: string
  startTime: string
  endTime: string
  status?: string
}

export interface ReservationPayload {
  userId: string
  laboratoryId?: string
  resourceId?: string
  reservationDate: string
  startTime: string
  endTime: string
}

