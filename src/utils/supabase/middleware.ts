import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Check for demo mode cookie
    const demoRole = request.cookies.get('demo_role')?.value;
    if (demoRole) {
        // Allow access if demo role matches the path
        if (request.nextUrl.pathname.startsWith('/organizer') && demoRole === 'organizer') {
            return response;
        }
        if (request.nextUrl.pathname.startsWith('/sponsor') && demoRole === 'sponsor') {
            return response;
        }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If env vars are missing and no demo cookie, redirect to login
    if (!supabaseUrl || !supabaseKey) {
        if (request.nextUrl.pathname.startsWith('/organizer') || request.nextUrl.pathname.startsWith('/sponsor')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/organizer') && user?.user_metadata?.role !== 'organizer') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/sponsor') && user?.user_metadata?.role !== 'sponsor') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (!user && (request.nextUrl.pathname.startsWith('/organizer') || request.nextUrl.pathname.startsWith('/sponsor'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
