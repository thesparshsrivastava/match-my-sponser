'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { deliverablesApi } from '@/lib/api/deliverables';
import { Deliverable } from '@/types/deliverable';

export default function SponsorDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [feedback, setFeedback] = useState('');

  const fetchDeliverables = async () => {
    try {
      const data = await deliverablesApi.getDeliverables('sponsor');
      setDeliverables(data);
    } catch (error) {
      console.error('Failed to fetch deliverables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, []);

  const handleApprove = async (deliverableId: string) => {
    try {
      await deliverablesApi.updateStatus(deliverableId, 'approved', feedback);

      // Update local state
      setDeliverables(deliverables.map(d =>
        d.id === deliverableId ? { ...d, status: 'approved', feedback } : d
      ));
      setSelectedDeliverable(null);
      setFeedback('');
    } catch (error) {
      console.error('Failed to approve deliverable:', error);
      alert('Failed to approve deliverable');
    }
  };

  const handleReject = async (deliverableId: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }

    try {
      await deliverablesApi.updateStatus(deliverableId, 'rejected', feedback);

      // Update local state
      setDeliverables(deliverables.map(d =>
        d.id === deliverableId ? { ...d, status: 'rejected', feedback } : d
      ));
      setSelectedDeliverable(null);
      setFeedback('');
    } catch (error) {
      console.error('Failed to reject deliverable:', error);
      alert('Failed to reject deliverable');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      case 'submitted': return <Clock className="text-blue-500" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading deliverables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 lg:p-0">
      <div className="glass-card p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
          Deliverables
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Review and approve sponsorship deliverables</p>
      </div>

      {deliverables.length === 0 ? (
        <div className="glass-card p-8 sm:p-12 text-center">
          <CheckCircle size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No deliverables yet</h3>
          <p className="text-gray-600 text-sm sm:text-base">Deliverables will appear here once you sponsor events</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {deliverables.map((deliverable) => (
            <div key={deliverable.id} className="glass-card p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{deliverable.title}</h3>
                    {getStatusIcon(deliverable.status)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{deliverable.description}</p>
                  <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                    <p className="truncate">Event: {deliverable.eventName}</p>
                    <p className="truncate">Organizer: {deliverable.organizerName}</p>
                  </div>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium self-start flex-shrink-0 ${getStatusColor(deliverable.status)}`}>
                  {deliverable.status.charAt(0).toUpperCase() + deliverable.status.slice(1)}
                </span>
              </div>

              {deliverable.proofUrl && (
                <div className="mb-4">
                  <img
                    src={deliverable.proofUrl}
                    alt="Proof"
                    className="w-full rounded-xl border border-white/20 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedDeliverable(deliverable)}
                  />
                </div>
              )}

              {deliverable.status === 'submitted' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDeliverable(deliverable)}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base touch-manipulation"
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4 inline mr-2" />
                    Review
                  </button>
                </div>
              )}

              {deliverable.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-medium text-gray-700 mb-1">Your Feedback:</p>
                  <p className="text-xs sm:text-sm text-gray-600">{deliverable.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedDeliverable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 touch-manipulation">
          <div className="glass-card max-w-2xl w-full max-w-[95vw] sm:max-w-2xl p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">{selectedDeliverable.title}</h2>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{selectedDeliverable.description}</p>

            {selectedDeliverable.proofUrl && (
              <img
                src={selectedDeliverable.proofUrl}
                alt="Proof"
                className="w-full rounded-lg sm:rounded-xl mb-3 sm:mb-4 max-h-64 sm:max-h-96 object-cover"
              />
            )}

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Feedback (optional for approval, required for rejection)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add your feedback..."
                className="w-full glass-input min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => handleApprove(selectedDeliverable.id)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors text-sm sm:text-base touch-manipulation"
              >
                <CheckCircle size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedDeliverable.id)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors text-sm sm:text-base touch-manipulation"
              >
                <XCircle size={16} className="sm:w-5 sm:h-5 inline mr-2" />
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedDeliverable(null);
                  setFeedback('');
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
