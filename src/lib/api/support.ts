import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

export type InsertTicket = Database['public']['Tables']['support_tickets']['Insert']

export async function createTicket(ticket: InsertTicket) {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert(ticket)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getTickets(status?: string) {
  let query = supabase
    .from('support_tickets')
    .select('*, profiles(username), assigned:profiles!assigned_to(username)')

  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function replyToTicket(ticketId: string, message: string) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const { data, error } = await supabase
    .from('support_replies')
    .insert({
      ticket_id: ticketId,
      user_id: session.user.id,
      message,
      is_admin: profile?.role === 'admin'
    })
    .select()
    .single()
  if (error) throw error
  return data
}
