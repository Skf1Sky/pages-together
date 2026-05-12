import { supabase } from '@/lib/supabase'

export async function getDashboardStats() {
  const [
    { count: userCount, error: userError },
    { data: softwares, error: softwareError },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('softwares').select('name, download_count, created_at'),
  ])

  if (userError) console.error('Error fetching user count:', userError)
  if (softwareError) console.error('Error fetching softwares:', softwareError)

  const totalApps = softwares?.length || 0
  const totalDownloads = softwares?.reduce((acc, curr) => acc + (curr.download_count || 0), 0) || 0
  
  // Top 5 apps
  const topApps = (softwares || [])
    .map(s => ({ name: s.name, value: s.download_count || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Recent apps (as activity proxy)
  const recentActivity = (softwares || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map(s => ({
      type: 'upload',
      user: 'Admin',
      target: s.name,
      time: formatTimeAgo(s.created_at),
      icon: 'package',
      color: 'text-blue-500'
    }))

  return {
    totalUsers: userCount || 0,
    totalApps,
    totalDownloads,
    topApps,
    recentActivity
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Vừa xong'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
  return `${Math.floor(diffInSeconds / 86400)} ngày trước`
}
