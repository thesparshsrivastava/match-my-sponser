"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Target, MessageSquare, CheckSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EventCard } from "@/components/dashboard/EventCard";
import { Event } from "@/types/event";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

import { analyticsApi } from "@/lib/api/analytics";
import { eventsApi } from "@/lib/api/events";

export default function OrganizerDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    matches: 0,
    messages: 0,
    pendingDeliverables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardStats, dashboardEvents] = await Promise.all([
          analyticsApi.getOrganizerStats(),
          analyticsApi.getDashboardEvents(),
        ]);

        setStats(dashboardStats);
        setEvents(dashboardEvents);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEventClick = (eventId: string) => {
    // For now, just show event details in an alert or modal
    // Later can be replaced with actual event details page
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`Event: ${event.name}\nLocation: ${event.location}\nDate: ${new Date(event.date).toLocaleDateString()}\nAudience: ${event.audienceSize} people`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await eventsApi.deleteEvent(eventId);

      // Update state
      setEvents(events.filter(e => e.id !== eventId));
      setStats(prev => ({ ...prev, totalEvents: prev.totalEvents - 1 }));

    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <motion.div {...fadeInUp}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back! Here's an overview of your events and activities.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div {...fadeInUp}>
          <StatsCard
            title="Total Events"
            value={stats.totalEvents}
            icon={Calendar}
            trend={{ value: 12, direction: "up" }}
          />
        </motion.div>

        <motion.div {...fadeInUp}>
          <StatsCard
            title="Matches"
            value={stats.matches}
            icon={Target}
            trend={{ value: 8, direction: "up" }}
          />
        </motion.div>

        <motion.div {...fadeInUp}>
          <StatsCard
            title="Messages"
            value={stats.messages}
            icon={MessageSquare}
          />
        </motion.div>

        <motion.div {...fadeInUp}>
          <StatsCard
            title="Pending Deliverables"
            value={stats.pendingDeliverables}
            icon={CheckSquare}
          />
        </motion.div>
      </motion.div>

      {/* Events Section */}
      <motion.div {...fadeInUp}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Events</h2>
          <button
            onClick={() => router.push("/organizer/create-event")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            Create New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20">
            <Calendar size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No events yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              Create your first event to start finding sponsors
            </p>
            <button
              onClick={() => router.push("/organizer/create-event")}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {events.map((event) => (
              <motion.div key={event.id} {...fadeInUp}>
                <EventCard
                  event={event}
                  onClick={() => handleEventClick(event.id)}
                  onDelete={() => handleDeleteEvent(event.id)}
                  showMatchScore={false}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
