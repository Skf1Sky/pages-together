import { supabase } from '@/lib/supabase'

export async function getUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function updateUserRole(id: string, role: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteUserProfile(id: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
