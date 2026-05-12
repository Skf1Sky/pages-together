import { supabase } from './src/lib/supabase.js'

async function checkCategories() {
  const { data, error } = await supabase
    .from('softwares')
    .select('name, category')
  
  if (error) {
    console.error(error)
    return
  }
  
  console.log('Categories in DB:')
  const categories = [...new Set(data.map(s => s.category))]
  console.log(categories)
  
  console.log('Sample softwares:')
  console.log(data.slice(0, 5))
}

checkCategories()
