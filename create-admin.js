const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpUser() {
  console.log('Signing up user...');
  const { data, error } = await supabase.auth.signUp({
    email: 'fmamadoupetit@gmail.com',
    password: 'Mouhamed111',
  });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User created successfully:', data.user?.email);
    console.log('Please check your email to confirm if email confirmation is enabled on Supabase.');
  }
}

signUpUser();
