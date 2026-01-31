'use client';

import { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react';



import { deliverablesApi } from '@/lib/api/deliverables';
import { Deliverable } from '@/types/deliverable';

export default function OrganizerDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchDeliverables = async () => {
    try {
      const data = await deliverablesApi.getDeliverables('organizer');
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

  const handleFileUpload = async (deliverableId: string, file: File) => {
    setUploadingId(deliverableId);

    try {
      const publicUrl = await deliverablesApi.uploadProof(deliverableId, file);

      if (publicUrl) {
        setDeliverables(deliverables.map(d =>
          d.id === deliverableId
            ? { ...d, status: 'submitted', proofUrl: publicUrl }
            : d
        ));
      }
    } catch (error) {
      console.error('Failed to upload proof:', error);
      alert('Failed to upload proof. Please try again.');
    } finally {
      setUploadingId(null);
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
        <p className="text-gray-600 text-sm sm:text-base">Upload proof of completed sponsorship deliverables</p>
      </div>

      {deliverables.length === 0 ? (
        <div className="glass-card p-8 sm:p-12 text-center">
          <Upload size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No deliverables yet</h3>
          <p className="text-gray-600 text-sm sm:text-base">Deliverables will appear here once you match with sponsors</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {deliverables.map((deliverable) => (
            <div key={deliverable.id} className="glass-card p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{deliverable.title}</h3>
                    {getStatusIcon(deliverable.status)}
                  </div>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">{deliverable.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span>Sponsor: {deliverable.sponsorName}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getStatusColor(deliverable.status)}`}>
                  {deliverable.status.charAt(0).toUpperCase() + deliverable.status.slice(1)}
                </span>
              </div>

              {deliverable.status === 'pending' && (
                <div className="mt-4">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(deliverable.id, file);
                      }}
                      disabled={uploadingId === deliverable.id}
                      className="hidden"
                      id={`file-${deliverable.id}`}
                    />
                    <label
                      htmlFor={`file-${deliverable.id}`}
                      className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl cursor-pointer transition-all text-sm sm:text-base touch-manipulation ${uploadingId === deliverable.id
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg'
                        }`}
                    >
                      <Upload size={16} className="sm:w-5 sm:h-5" />
                      {uploadingId === deliverable.id ? 'Uploading...' : 'Upload Proof'}
                    </label>
                  </label>
                </div>
              )}

              {deliverable.proofUrl && (
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Uploaded Proof:</p>
                  <img
                    src={deliverable.proofUrl}
                    alt="Proof"
                    className="w-full max-w-sm sm:max-w-md rounded-xl border border-white/20"
                  />
                </div>
              )}

              {deliverable.feedback && (
                <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">Sponsor Feedback:</p>
                  <p className="text-xs sm:text-sm text-yellow-700">{deliverable.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
