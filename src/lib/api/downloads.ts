import { supabase } from '@/lib/supabase'

export async function trackDownload(softwareId: string, versionId: string) {
  const { data: { session } } = await supabase.auth.getSession()

  const { error } = await supabase
    .from('downloads')
    .insert({
      software_id: softwareId,
      version_id: versionId,
      user_id: session?.user?.id,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
    })
  if (error) throw error
}

export async function getDownloadStats() {
  const { data, error } = await supabase
    .from('softwares')
    .select('name, download_count')
    .order('download_count', { ascending: false })
    .limit(10)
  if (error) throw error
  return data
}
