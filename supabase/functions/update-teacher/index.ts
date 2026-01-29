import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the caller is authenticated and is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    // Client for verifying the caller
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } }
    })

    // Verify caller is admin
    const { data: { user: callerUser }, error: callerError } = await supabaseClient.auth.getUser()
    if (callerError || !callerUser) {
      console.error('Auth error:', callerError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Admin client for updating users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Check if caller is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerUser.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (roleError || !roleData) {
      console.error('Role check error:', roleError)
      return new Response(
        JSON.stringify({ success: false, error: 'Only admins can update teachers' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body = await req.json()
    const { 
      user_id,
      email,
      full_name, 
      phone, 
      designation, 
      employee_id, 
      department_id, 
      academic_background, 
      professional_experience,
      profile_photo,
      is_verified,
      is_active
    } = body

    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Updating teacher: ${user_id}`)

    // Update profile
    const profileUpdateData: Record<string, unknown> = {}
    if (full_name !== undefined) profileUpdateData.full_name = full_name
    if (phone !== undefined) profileUpdateData.phone = phone
    if (designation !== undefined) profileUpdateData.designation = designation
    if (employee_id !== undefined) profileUpdateData.employee_id = employee_id
    if (department_id !== undefined) profileUpdateData.department_id = department_id
    if (academic_background !== undefined) profileUpdateData.academic_background = academic_background
    if (professional_experience !== undefined) profileUpdateData.professional_experience = professional_experience
    if (profile_photo !== undefined) profileUpdateData.profile_photo = profile_photo
    if (is_verified !== undefined) profileUpdateData.is_verified = is_verified
    if (is_active !== undefined) profileUpdateData.is_active = is_active
    if (email !== undefined) profileUpdateData.email = email

    if (Object.keys(profileUpdateData).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdateData)
        .eq('user_id', user_id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        return new Response(
          JSON.stringify({ success: false, error: profileError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // If email is changed, update auth user as well
    if (email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        email: email
      })

      if (authError) {
        console.error('Auth email update error:', authError)
        // Don't fail the whole operation, profile was updated
      }
    }

    console.log(`Teacher ${user_id} updated successfully`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
