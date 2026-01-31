-- Match My Sponsor - Supabase Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('organizer', 'sponsor')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  audience_size INTEGER NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  sponsorship_requirements TEXT,
  banner_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  location TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, sponsor_id)
);

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliverables table
CREATE TABLE deliverables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected')),
  proof_url TEXT,
  feedback TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view published events" ON events FOR SELECT USING (status = 'published' OR organizer_id = auth.uid());
CREATE POLICY "Organizers can create events" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'organizer')
);
CREATE POLICY "Organizers can update own events" ON events FOR UPDATE USING (organizer_id = auth.uid());
CREATE POLICY "Organizers can delete own events" ON events FOR DELETE USING (organizer_id = auth.uid());

-- Sponsors policies
CREATE POLICY "Anyone can view sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Sponsors can create profile" ON sponsors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'sponsor')
);
CREATE POLICY "Sponsors can update own profile" ON sponsors FOR UPDATE USING (user_id = auth.uid());

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM events WHERE id = matches.event_id AND organizer_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM sponsors WHERE id = matches.sponsor_id AND user_id = auth.uid()
  )
);
CREATE POLICY "System can create matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own matches" ON matches FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM events WHERE id = matches.event_id AND organizer_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM sponsors WHERE id = matches.sponsor_id AND user_id = auth.uid()
  )
);

-- Conversations policies
CREATE POLICY "Match participants can view conversations" ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches m
    JOIN events e ON m.event_id = e.id
    JOIN sponsors s ON m.sponsor_id = s.id
    WHERE m.id = conversations.match_id 
    AND (e.organizer_id = auth.uid() OR s.user_id = auth.uid())
  )
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to create notification (can be called by triggers or API)
-- For now, we'll insert directly via API or triggers

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON c.match_id = m.id
    JOIN events e ON m.event_id = e.id
    JOIN sponsors s ON m.sponsor_id = s.id
    WHERE c.id = messages.conversation_id 
    AND (e.organizer_id = auth.uid() OR s.user_id = auth.uid())
  )
);
CREATE POLICY "Conversation participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON c.match_id = m.id
    JOIN events e ON m.event_id = e.id
    JOIN sponsors s ON m.sponsor_id = s.id
    WHERE c.id = conversation_id 
    AND (e.organizer_id = auth.uid() OR s.user_id = auth.uid())
  )
);

-- Deliverables policies
CREATE POLICY "Match participants can view deliverables" ON deliverables FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches m
    JOIN events e ON m.event_id = e.id
    JOIN sponsors s ON m.sponsor_id = s.id
    WHERE m.id = deliverables.match_id 
    AND (e.organizer_id = auth.uid() OR s.user_id = auth.uid())
  )
);
CREATE POLICY "Match participants can update deliverables" ON deliverables FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM matches m
    JOIN events e ON m.event_id = e.id
    JOIN sponsors s ON m.sponsor_id = s.id
    WHERE m.id = deliverables.match_id 
    AND (e.organizer_id = auth.uid() OR s.user_id = auth.uid())
  )
);

-- Indexes for performance
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_sponsors_user ON sponsors(user_id);
CREATE INDEX idx_matches_event ON matches(event_id);
CREATE INDEX idx_matches_sponsor ON matches(sponsor_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_deliverables_match ON deliverables(match_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at BEFORE UPDATE ON sponsors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
