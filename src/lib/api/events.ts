import { createClient } from '@/utils/supabase/client';

export const eventsApi = {
    async deleteEvent(id: string): Promise<void> {
        const supabase = createClient();

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
};
