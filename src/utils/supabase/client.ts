import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials missing. Using mock client for demo mode.');
        return {
            auth: {
                signInWithPassword: async ({ email, password }: any) => {
                    // Mock successful login for demo accounts
                    if (
                        (email === 'test.organizer@test.com' && password === 'iamorganizer') ||
                        (email === 'test.sponser@test.com' && password === 'iamsponser')
                    ) {
                        const role = email.includes('organizer') ? 'organizer' : 'sponsor';
                        return {
                            data: {
                                user: {
                                    id: 'demo-user',
                                    email,
                                    user_metadata: { role },
                                },
                                session: { access_token: 'demo-token' },
                            },
                            error: null,
                        };
                    }
                    return { data: { user: null }, error: { message: 'Invalid credentials' } };
                },
                signOut: async () => ({ error: null }),
                getUser: async () => ({
                    data: {
                        user: {
                            id: 'demo-user',
                            email: 'test.organizer@test.com',
                            user_metadata: { role: 'organizer' }
                        }
                    },
                    error: null
                }),
                getSession: async () => ({
                    data: {
                        session: {
                            access_token: 'demo-token',
                            user: {
                                id: 'demo-user',
                                user_metadata: { role: 'organizer' }
                            }
                        }
                    },
                    error: null
                }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => ({ data: null, error: null }),
                        order: () => ({ data: [], error: null }),
                    }),
                }),
            }),
        } as any;
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
