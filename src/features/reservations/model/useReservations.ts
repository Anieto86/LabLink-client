import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createReservation,
  deleteReservation,
  listReservations,
  listReservationsByUser,
  updateReservation
} from '@/features/reservations/api/reservations.api'
import type { ReservationPayload } from '@/features/reservations/model/reservation.types'

const RESERVATIONS_QUERY_KEY = ['reservations']

export const useReservations = (userId?: string) => {
  return useQuery({
    queryKey: [...RESERVATIONS_QUERY_KEY, userId || 'all'],
    queryFn: () => (userId ? listReservationsByUser(userId) : listReservations())
  })
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReservationPayload) => createReservation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY })
  })
}

export const useUpdateReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReservationPayload }) => updateReservation(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY })
  })
}

export const useDeleteReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteReservation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESERVATIONS_QUERY_KEY })
  })
}

