import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// This client should ONLY be used for admin tasks.
// We use NO storage and NO session persistence to ensure it never 
// interferes with the main admin's session in the browser.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // DO NOT save session
    autoRefreshToken: false, // DO NOT refresh
    detectSessionInUrl: false, // DO NOT look at URL
  }
})
