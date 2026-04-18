import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Ensure environment variables are loaded
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  console.log('💡 Add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file')
  console.log('Debug info:')
  console.log('  SUPABASE_URL:', supabaseUrl || 'undefined')
  console.log('  SUPABASE_ANON_KEY:', supabaseKey ? 'Found' : 'undefined')
  process.exit(1)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
export const testConnection = async () => {
  try {
    console.log('\n🔌 Testing Supabase Connection...')
    const { data, error } = await supabase.from('shops').select('count').limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      throw error
    }
    
    console.log('✅ Supabase Connected Successfully!')
    console.log(`📍 URL: ${supabaseUrl}`)
    return true
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message)
    return false
  }
}
