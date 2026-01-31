import { NextRequest, NextResponse } from 'next/server';
import { Event, EventCategory, EventStatus } from '@/types/event';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    return NextResponse.json(events || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const audienceSize = formData.get('audienceSize') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const sponsorshipRequirements = formData.get('sponsorshipRequirements') as string;
    const banner = formData.get('banner') as File | null;

    if (!name || !category || !location || !audienceSize || !date || !description || !sponsorshipRequirements) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validCategories: EventCategory[] = [
      'college-fest',
      'competition',
      'sports',
      'hackathon',
      'cultural',
      'workshop',
    ];

    if (!validCategories.includes(category as EventCategory)) {
      return NextResponse.json(
        { error: 'Invalid event category' },
        { status: 400 }
      );
    }

    const audienceSizeNum = parseInt(audienceSize);
    if (isNaN(audienceSizeNum) || audienceSizeNum <= 0) {
      return NextResponse.json(
        { error: 'Audience size must be a positive number' },
        { status: 400 }
      );
    }

    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return NextResponse.json(
        { error: 'Event date must be in the future' },
        { status: 400 }
      );
    }

    let bannerUrl: string | null = null;
    if (banner && banner.size > 0) {
      const fileExt = banner.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `event-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(filePath, banner, {
          cacheControl: '3600',
          upsert: false
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('event-banners')
          .getPublicUrl(filePath);
        bannerUrl = data.publicUrl;
      }
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organizer_id: user.id,
        name,
        category,
        location,
        audience_size: audienceSizeNum,
        date: eventDate.toISOString().split('T')[0],
        description,
        sponsorship_requirements: sponsorshipRequirements,
        banner_url: bannerUrl,
        status: 'published',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
