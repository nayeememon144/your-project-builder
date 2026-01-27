import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const testUsers = [
      { email: 'admin@sstu.ac.bd', password: 'Admin@123', role: 'admin', name: 'System Administrator' },
      { email: 'teacher@sstu.ac.bd', password: 'Teacher@123', role: 'teacher', name: 'Demo Teacher' },
      { email: 'student@sstu.ac.bd', password: 'Student@123', role: 'student', name: 'Demo Student' },
    ]

    const results = []

    for (const user of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === user.email)

      let userId: string

      if (existingUser) {
        userId = existingUser.id
        results.push({ email: user.email, status: 'already exists', role: user.role })
      } else {
        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { full_name: user.name, role: user.role }
        })

        if (createError) {
          results.push({ email: user.email, status: 'error', error: createError.message })
          continue
        }

        userId = newUser.user.id
        results.push({ email: user.email, status: 'created', role: user.role })
      }

      // Ensure profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!existingProfile) {
        await supabaseAdmin.from('profiles').insert({
          user_id: userId,
          full_name: user.name,
          email: user.email
        })
      }

      // Ensure role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', user.role)
        .maybeSingle()

      if (!existingRole) {
        // Delete any existing roles for this user first
        await supabaseAdmin.from('user_roles').delete().eq('user_id', userId)
        
        // Insert the correct role
        await supabaseAdmin.from('user_roles').insert({
          user_id: userId,
          role: user.role
        })
      }
    }

    return new Response(
      JSON.stringify({ success: true, users: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
