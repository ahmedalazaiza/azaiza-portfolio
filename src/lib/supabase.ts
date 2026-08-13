import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://olncwouqdcbyhjqzzrct.supabase.co'
const supabaseAnonKey = 'sb_publishable_1kjfOk3V0Vc1u5h2lvNLbg_Dz-Ign04'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)