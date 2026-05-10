import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Ticket {
  id: string
  created_at: string
  status: string
  subject: string
  [key: string]: any
}

export function useRealtimeTickets(callback: (ticket: Ticket) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('support_tickets')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_tickets' },
        (payload) => callback(payload.new as Ticket)
      )
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [callback])
}
