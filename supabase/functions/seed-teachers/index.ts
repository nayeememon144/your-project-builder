import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const teacherData = [
  { name: 'Dr. Md. Rafiqul Islam', email: 'rafiqul.islam@sstu.ac.bd', designation: 'Professor', dept: 'Computer Science and Engineering' },
  { name: 'Dr. Fatema Khatun', email: 'fatema.khatun@sstu.ac.bd', designation: 'Professor', dept: 'Physics' },
  { name: 'Dr. Anwar Hossain', email: 'anwar.hossain@sstu.ac.bd', designation: 'Professor', dept: 'Chemistry' },
  { name: 'Dr. Sharmin Akter', email: 'sharmin.akter@sstu.ac.bd', designation: 'Associate Professor', dept: 'Mathematics' },
  { name: 'Md. Kamal Uddin', email: 'kamal.uddin@sstu.ac.bd', designation: 'Associate Professor', dept: 'Computer Science and Engineering' },
  { name: 'Dr. Nazrul Islam', email: 'nazrul.islam@sstu.ac.bd', designation: 'Associate Professor', dept: 'Physics' },
  { name: 'Shirin Akhter', email: 'shirin.akhter@sstu.ac.bd', designation: 'Assistant Professor', dept: 'Chemistry' },
  { name: 'Md. Jahangir Alam', email: 'jahangir.alam@sstu.ac.bd', designation: 'Assistant Professor', dept: 'Mathematics' },
  { name: 'Dr. Salma Begum', email: 'salma.begum@sstu.ac.bd', designation: 'Assistant Professor', dept: 'Computer Science and Engineering' },
  { name: 'Md. Rezaul Karim', email: 'rezaul.karim@sstu.ac.bd', designation: 'Lecturer', dept: 'Physics' },
  { name: 'Tahmina Rahman', email: 'tahmina.rahman@sstu.ac.bd', designation: 'Lecturer', dept: 'Chemistry' },
  { name: 'Md. Sohel Rana', email: 'sohel.rana@sstu.ac.bd', designation: 'Lecturer', dept: 'Mathematics' },
  { name: 'Dr. Moushumi Akter', email: 'moushumi.akter@sstu.ac.bd', designation: 'Lecturer', dept: 'Computer Science and Engineering' },
  { name: 'Md. Abdul Hai', email: 'abdul.hai@sstu.ac.bd', designation: 'Lecturer', dept: 'Physics' },
  { name: 'Rashida Khanam', email: 'rashida.khanam@sstu.ac.bd', designation: 'Lecturer', dept: 'Chemistry' },
  { name: 'Md. Faruk Ahmed', email: 'faruk.ahmed@sstu.ac.bd', designation: 'Lecturer', dept: 'Mathematics' },
  { name: 'Dr. Nahid Sultana', email: 'nahid.sultana@sstu.ac.bd', designation: 'Associate Professor', dept: 'Computer Science and Engineering' },
]

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

    // Get department IDs
    const { data: departments } = await supabaseAdmin
      .from('departments')
      .select('id, name')
      .eq('is_active', true)

    const deptMap = new Map(departments?.map(d => [d.name, d.id]) || [])

    const results = []
    const defaultPassword = 'Teacher@123'

    for (const teacher of teacherData) {
      console.log(`Processing teacher: ${teacher.email}`)
      
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === teacher.email)

      let userId: string

      if (existingUser) {
        userId = existingUser.id
        results.push({ email: teacher.email, status: 'already exists', name: teacher.name })
      } else {
        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: teacher.email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: { full_name: teacher.name, role: 'teacher' }
        })

        if (createError) {
          console.error(`Error creating user ${teacher.email}:`, createError.message)
          results.push({ email: teacher.email, status: 'error', error: createError.message })
          continue
        }

        userId = newUser.user.id
        results.push({ email: teacher.email, status: 'created', name: teacher.name })
      }

      // Ensure profile exists with department
      const deptId = deptMap.get(teacher.dept) || null
      
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!existingProfile) {
        await supabaseAdmin.from('profiles').insert({
          user_id: userId,
          full_name: teacher.name,
          email: teacher.email,
          designation: teacher.designation,
          department_id: deptId,
          is_active: true,
          is_verified: true
        })
      } else {
        // Update existing profile
        await supabaseAdmin.from('profiles').update({
          designation: teacher.designation,
          department_id: deptId,
          is_active: true,
          is_verified: true
        }).eq('user_id', userId)
      }

      // Ensure role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'teacher')
        .maybeSingle()

      if (!existingRole) {
        // Delete any existing roles for this user first
        await supabaseAdmin.from('user_roles').delete().eq('user_id', userId)
        
        // Insert the teacher role
        await supabaseAdmin.from('user_roles').insert({
          user_id: userId,
          role: 'teacher'
        })
      }
    }

    console.log('Seed completed:', results)

    return new Response(
      JSON.stringify({ success: true, totalTeachers: results.length, teachers: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error('Seed error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
