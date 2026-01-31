import { createClient } from '@/utils/supabase/client';

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

export const notificationsApi = {
    async getNotifications(): Promise<Notification[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }

        return data.map((n: any) => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            message: n.message,
            link: n.link,
            read: n.read,
            createdAt: new Date(n.created_at),
        }));
    },

    async markAsRead(id: string): Promise<void> {
        const supabase = createClient();

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    },

    async markAllAsRead(): Promise<void> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

        if (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }
};
