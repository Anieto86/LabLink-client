import apiClient from '@/shared/lib/apiClient'
import type { Reservation, ReservationPayload } from '@/features/reservations/model/reservation.types'

export const listReservations = async () => {
  const { data } = await apiClient.get<Reservation[]>('/reservations')
  return data
}

export const listReservationsByUser = async (userId: string) => {
  const { data } = await apiClient.get<Reservation[]>(`/reservations/user/${userId}`)
  return data
}

export const createReservation = async (payload: ReservationPayload) => {
  const { data } = await apiClient.post<Reservation>('/reservations', payload)
  return data
}

export const updateReservation = async (id: string, payload: ReservationPayload) => {
  const { data } = await apiClient.patch<Reservation>(`/reservations/${id}`, payload)
  return data
}

export const deleteReservation = async (id: string) => {
  await apiClient.delete(`/reservations/${id}`)
}

