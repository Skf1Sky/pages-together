import { supabase } from './supabase'

export async function uploadIcon(file: File, slug: string) {
  const fileExt = file.name.split('.').pop()
  const path = `icons/${slug}.${fileExt}`
  const { error } = await supabase.storage
    .from('software-icons')
    .upload(path, file, { upsert: true })
  
  if (error) throw error
  
  const { data } = supabase.storage.from('software-icons').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadScreenshot(file: File, slug: string, index: number) {
  const fileExt = file.name.split('.').pop()
  const path = `${slug}/screenshot-${index}.${fileExt}`
  const { error } = await supabase.storage
    .from('software-screenshots')
    .upload(path, file, { upsert: true })
  
  if (error) throw error
  
  const { data } = supabase.storage.from('software-screenshots').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(file: File, slug: string, version: string) {
  const path = `${slug}/${version}/${file.name}`
  const { error } = await supabase.storage
    .from('software-files')
    .upload(path, file, { upsert: true })
  
  if (error) throw error
  
  const { data } = supabase.storage.from('software-files').getPublicUrl(path)
  return data.publicUrl
}
