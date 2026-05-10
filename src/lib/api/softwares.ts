import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Software = Database['public']['Tables']['softwares']['Row']
export type InsertSoftware = Database['public']['Tables']['softwares']['Insert']
export type UpdateSoftware = Database['public']['Tables']['softwares']['Update']

export async function getSoftwares(category?: string, search?: string) {
  try {
    let query = supabase
      .from('softwares')
      .select('*, versions(*)')
      .eq('is_active', true)

    if (category && category !== 'all' && category !== 'Tất cả danh mục') {
      query = query.eq('category', category)
    }
    
    if (search) query = query.ilike('name', `%${search}%`)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) return [];

    return (data || []).map(software => ({
      ...software,
      requirements: software.system_requirements,
      downloads: software.download_count?.toLocaleString() || "0",
      versions: software.versions?.map((v: any) => ({
        v: v.version,
        s: v.size,
        d: v.release_date
      })) || []
    }))
  } catch (e) {
    return [];
  }
}

export async function getSoftwareBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('softwares')
      .select('*, versions(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error || !data) return null;

    return {
      ...data,
      requirements: data.system_requirements,
      downloads: data.download_count?.toLocaleString() || "0",
      versions: data.versions?.map((v: any) => ({
        v: v.version,
        s: v.size,
        d: v.release_date
      })) || []
    }
  } catch (e) {
    return null;
  }
}

export async function createSoftware(software: InsertSoftware) {
  const { data, error } = await supabase
    .from('softwares')
    .insert(software)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateSoftware(id: string, updates: UpdateSoftware) {
  const { data, error } = await supabase
    .from('softwares')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSoftware(id: string) {
  // Soft delete
  const { error } = await supabase
    .from('softwares')
    .update({ is_active: false })
    .eq('id', id)
  if (error) throw error
}
