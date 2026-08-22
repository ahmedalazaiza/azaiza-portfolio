import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ljgrknsbielmsjmfhooi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZ3JrbnNiaWVsbXNqbWZob29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNDM2OTAsImV4cCI6MjEwMjkxOTY5MH0.jnArrWxVeHLEJh88RNSZiSX1LO5EbYoNby_5mO__o88'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)