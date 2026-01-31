import { createClient } from '@/utils/supabase/client';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';

export const deliverablesApi = {
    async getDeliverables(role: 'organizer' | 'sponsor'): Promise<Deliverable[]> {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        // Fetch deliverables with joined data
        const { data, error } = await supabase
            .from('deliverables')
            .select(`
        *,
        matches!inner (
          id,
          events (
            name,
            organizer_id,
            profiles (name)
          ),
          sponsors (company_name, user_id)
        )
      `)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Error fetching deliverables:', error);
            return [];
        }

        // Filter based on role (RLS should handle this, but double check)
        // and transform to frontend type
        return data.map((d: any) => ({
            id: d.id,
            matchId: d.match_id,
            title: d.title,
            description: d.description,
            proofUrl: d.proof_url,
            status: d.status as DeliverableStatus,
            feedback: d.feedback,
            dueDate: new Date(d.due_date),
            createdAt: new Date(d.created_at),
            updatedAt: new Date(d.updated_at),
            sponsorName: d.matches?.sponsors?.company_name,
            eventName: d.matches?.events?.name,
            organizerName: d.matches?.events?.profiles?.name,
        }));
    },

    async uploadProof(id: string, file: File): Promise<string | null> {
        const supabase = createClient();

        // 1. Upload file
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('deliverable-proofs')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading proof:', uploadError);
            throw uploadError;
        }

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('deliverable-proofs')
            .getPublicUrl(filePath);

        // 3. Update deliverable record
        const { error: updateError } = await supabase
            .from('deliverables')
            .update({
                proof_url: publicUrl,
                status: 'submitted',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updateError) {
            console.error('Error updating deliverable:', updateError);
            throw updateError;
        }

        return publicUrl;
    },

    async updateStatus(id: string, status: DeliverableStatus, feedback?: string): Promise<void> {
        const supabase = createClient();

        const updates: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        if (feedback) {
            updates.feedback = feedback;
        }

        const { error } = await supabase
            .from('deliverables')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    }
};
