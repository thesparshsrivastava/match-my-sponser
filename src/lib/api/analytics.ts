import { createClient } from '@/utils/supabase/client';
import { Event } from '@/types/event';

export const analyticsApi = {
    async getOrganizerStats() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                totalEvents: 0,
                matches: 0,
                messages: 0,
                pendingDeliverables: 0,
            };
        }

        // 1. Total Events
        const { count: totalEvents } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('organizer_id', user.id);

        // 2. Matches (linked to user's events)
        const { count: matches } = await supabase
            .from('matches')
            .select('*, events!inner(organizer_id)', { count: 'exact', head: true })
            .eq('events.organizer_id', user.id);

        // 3. Messages (sent by user - simple metric)
        const { count: messages } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', user.id);

        // 4. Pending Deliverables (linked to user's events)
        const { count: pendingDeliverables } = await supabase
            .from('deliverables')
            .select('*, matches!inner(events!inner(organizer_id))', { count: 'exact', head: true })
            .eq('matches.events.organizer_id', user.id)
            .eq('status', 'pending');

        return {
            totalEvents: totalEvents || 0,
            matches: matches || 0,
            messages: messages || 0,
            pendingDeliverables: pendingDeliverables || 0,
        };
    },

    async getDashboardEvents(): Promise<Event[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('organizer_id', user.id)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching dashboard events:', error);
            return [];
        }

        // Map database fields to frontend type if necessary
        // Assuming Event type matches DB schema mostly, but let's be safe
        return data.map((e: any) => ({
            id: e.id,
            organizerId: e.organizer_id,
            name: e.name,
            category: e.category,
            location: e.location,
            audienceSize: e.audience_size,
            date: new Date(e.date),
            description: e.description,
            sponsorshipRequirements: e.sponsorship_requirements,
            bannerUrl: e.banner_url,
            status: e.status,
            createdAt: new Date(e.created_at),
            updatedAt: new Date(e.updated_at),
        }));
    },

    async getSponsorStats() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                eventsMatched: 0,
                pendingApprovals: 0,
                messages: 0,
            };
        }

        // 1. Events Matched (Sponsorships)
        const { count: eventsMatched } = await supabase
            .from('matches')
            .select('*, sponsors!inner(user_id)', { count: 'exact', head: true })
            .eq('sponsors.user_id', user.id);

        // 2. Pending Approvals (Deliverables)
        const { count: pendingApprovals } = await supabase
            .from('deliverables')
            .select('*, matches!inner(sponsors!inner(user_id))', { count: 'exact', head: true })
            .eq('matches.sponsors.user_id', user.id)
            .eq('status', 'pending');

        // 3. Messages (sent by user)
        const { count: messages } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', user.id);

        return {
            eventsMatched: eventsMatched || 0,
            pendingApprovals: pendingApprovals || 0,
            messages: messages || 0,
        };
    },

    async getRecommendedEvents(): Promise<Event[]> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching recommended events:', error);
            return [];
        }

        return data.map((e: any) => ({
            id: e.id,
            organizerId: e.organizer_id,
            name: e.name,
            category: e.category,
            location: e.location,
            audienceSize: e.audience_size,
            date: new Date(e.date),
            description: e.description,
            sponsorshipRequirements: e.sponsorship_requirements,
            bannerUrl: e.banner_url,
            status: e.status,
            createdAt: new Date(e.created_at),
            updatedAt: new Date(e.updated_at),
        }));
    }
};
