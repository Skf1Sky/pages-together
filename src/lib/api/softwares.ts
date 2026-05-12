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

    if (category && category.toLowerCase() !== 'all' && category !== 'Tất cả danh mục') {
      query = query.ilike('category', category.trim())
    }
    
    if (search) query = query.ilike('name', `%${search}%`)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) return [];

    return (data || []).map(software => ({
      ...software,
      requirements: software.system_requirements,
      downloads: software.download_count?.toLocaleString() || "0",
      versions: software.versions?.map((v: any) => ({
        id: v.id,
        v: v.version,
        s: v.size,
        d: v.release_date,
        link: v.download_url
      })) || []
    }))
  } catch (e) {
    return [];
  }
}

export async function getSoftwareBySlug(slugOrId: string) {
  try {
    // Try by slug first
    let { data, error } = await supabase
      .from('softwares')
      .select('*, versions(*)')
      .eq('slug', slugOrId)
      .eq('is_active', true)
      .single()
    
    // If not found by slug, try by id (UUID)
    if (error || !data) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
      if (isUuid) {
        const { data: idData, error: idError } = await supabase
          .from('softwares')
          .select('*, versions(*)')
          .eq('id', slugOrId)
          .eq('is_active', true)
          .single()
        
        if (!idError && idData) {
          data = idData;
          error = null as any;
        }
      }
    }

    if (error || !data) return null;

    return {
      ...data,
      requirements: data.system_requirements,
      downloads: data.download_count?.toLocaleString() || "0",
      versions: data.versions?.map((v: any) => ({
        id: v.id,
        v: v.version,
        s: v.size,
        d: v.release_date,
        link: v.download_url
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

export async function createVersion(version: any) {
  const { data, error } = await supabase
    .from('versions')
    .insert(version)
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
  // Permanent delete (cascading delete should be handled by DB or manually)
  // 1. Delete versions first if not cascading
  const { error: vError } = await supabase
    .from('versions')
    .delete()
    .eq('software_id', id)
  
  if (vError) console.error("Error deleting versions:", vError)

  // 2. Delete software
  const { error } = await supabase
    .from('softwares')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function deleteVersion(id: string) {
  const { error } = await supabase
    .from('versions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function updateVersion(id: string, updates: any) {
  const { data, error } = await supabase
    .from('versions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
