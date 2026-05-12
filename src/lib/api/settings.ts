import { supabase } from '@/lib/supabase'

export async function getSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
    
    if (error) {
      console.warn('System settings table might not exist, using default values.')
      return []
    }
    return data
  } catch (e) {
    return []
  }
}

export async function getMaintenanceMode(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .single()
    
    if (error || !data) {
      // Fallback to localStorage for local dev if table doesn't exist
      if (typeof window !== 'undefined') {
        return localStorage.getItem('is_maintenance_mode') === 'true'
      }
      return false
    }
    
    return data.value === 'true' || data.value === true
  } catch (e) {
    return false
  }
}

export async function setMaintenanceMode(enabled: boolean) {
  try {
    // Also update localStorage for immediate local feedback
    if (typeof window !== 'undefined') {
      localStorage.setItem('is_maintenance_mode', String(enabled))
    }

    const { error } = await supabase
      .from('system_settings')
      .upsert({ key: 'maintenance_mode', value: String(enabled) }, { onConflict: 'key' })
    
    if (error) throw error
  } catch (e) {
    console.error('Error updating maintenance mode in DB:', e)
    // We still updated localStorage above, so it works for the current user
    throw e
  }
}
