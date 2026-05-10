import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const [softwares, downloads, tickets, users] = await Promise.all([
      supabase.from('softwares').select('*', { count: 'exact', head: true }),
      supabase.from('downloads').select('*', { count: 'exact', head: true }),
      supabase.from('support_tickets').select('*', { count: 'exact', head: true })
        .eq('status', 'open'),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
    ])

    return new Response(JSON.stringify({
      totalSoftwares: softwares.count,
      totalDownloads: downloads.count,
      openTickets: tickets.count,
      totalUsers: users.count
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})
