import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://wvemwsvmdntmgsdaudrv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2ZW13c3ZtZG50bWdzZGF1ZHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4ODU0MjMsImV4cCI6MjA0MDQ2MTQyM30.76R2V9H54StJiMMqpEu0c-qOKe4lPsYVMb3limi7R8M'

export const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
     autoRefreshToken: true,
     persistSession: true,
     detectSessionInUrl: false,
   },
 });
