import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeDownloadCount(softwareId: string) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel(`software_${softwareId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'downloads',
          filter: `software_id=eq.${softwareId}`
        },
        () => setCount(c => c + 1)
      )
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [softwareId])

  return count
}
