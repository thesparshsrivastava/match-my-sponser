import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const body = await request.json();
    const { eventId, sponsorId } = body;

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    if (!token || !eventId || !sponsorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get event details to find organizer
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .eq('event_id', eventId)
      .eq('sponsor_id', sponsorId)
      .single();

    if (existingMatch) {
      return NextResponse.json({ error: 'Match already exists' }, { status: 409 });
    }

    // Create new match
    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        event_id: eventId,
        sponsor_id: sponsorId,
        organizer_id: event.organizer_id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating match:', error);
      return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
    }

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}