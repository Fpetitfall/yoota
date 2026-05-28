import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("WARNING: Middleware Supabase environment variables are missing!");
  }

  const supabase = createServerClient(
    url || 'https://placeholder-project.supabase.co',
    key || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('[Middleware] Path:', request.nextUrl.pathname)
  console.log('[Middleware] User:', user ? user.email : 'No user')

  const isAuthRoute = request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const hasAdminSession = request.cookies.get('admin_session')?.value === 'true'

  // Rediriger vers la page de connexion si accès admin sans le cookie spécifique
  if (isAdminRoute && !isAuthRoute && (!user || !hasAdminSession)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  // Rediriger vers le dashboard si accès à la page de connexion alors qu'on est déjà admin
  if (isAuthRoute && user && hasAdminSession) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}
