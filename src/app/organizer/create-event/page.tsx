'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from '@/components/organizer/EventForm';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

import { createClient } from '@/utils/supabase/client';

// ...

export default function CreateEventPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (formData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const form = new FormData();
      form.append('name', formData.name);
      form.append('category', formData.category);
      form.append('location', formData.location);
      form.append('audienceSize', formData.audienceSize);
      form.append('date', formData.date);
      form.append('description', formData.description);
      form.append('sponsorshipRequirements', formData.sponsorshipRequirements);

      if (formData.banner) {
        form.append('banner', formData.banner);
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      await response.json();
      setShowSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/organizer/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create event';
      alert(errorMsg);
    }
  };

  const handleCancel = () => {
    router.push('/organizer/dashboard');
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-8 sm:p-12"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Event Created!</h2>
          <p className="text-gray-600 text-sm sm:text-base">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 lg:p-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-4 sm:p-6"
      >
        <motion.button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition-colors group touch-manipulation"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:text-indigo-600 transition-colors" />
          <span className="group-hover:text-indigo-600 transition-colors text-sm sm:text-base">Back to Dashboard</span>
        </motion.button>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Fill in the details below to create your event and start finding sponsors
        </p>
      </motion.div>

      {/* Event Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass-card"
      >
        <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </motion.div>
    </div>
  );
}
