import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sponsors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sponsors' },
        { status: 500 }
      );
    }

    return NextResponse.json(sponsors || [], { status: 200 });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .insert({
        user_id: user.id,
        company_name: body.companyName,
        industry: body.industry,
        budget_range: body.budgetRange,
        location: body.location,
        description: body.description,
        logo_url: body.logoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating sponsor:', error);
      return NextResponse.json(
        { error: 'Failed to create sponsor profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json(
      { error: 'Failed to create sponsor profile' },
      { status: 500 }
    );
  }
}
