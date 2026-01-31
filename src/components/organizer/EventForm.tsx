'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { GlassButton } from '@/components/shared/GlassButton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { EventCategory } from '@/types/event';

interface EventFormData {
  name: string;
  category: EventCategory | '';
  location: string;
  audienceSize: string;
  date: string;
  description: string;
  sponsorshipRequirements: string;
  banner?: File;
}

interface EventFormErrors {
  name?: string;
  category?: string;
  location?: string;
  audienceSize?: string;
  date?: string;
  description?: string;
  sponsorshipRequirements?: string;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: '', label: 'Select a category' },
  { value: 'college-fest', label: 'College Fest' },
  { value: 'competition', label: 'Competition' },
  { value: 'sports', label: 'Sports' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'workshop', label: 'Workshop' },
];

export function EventForm({ onSubmit, onCancel }: EventFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: '',
    location: '',
    audienceSize: '',
    date: '',
    description: '',
    sponsorshipRequirements: '',
  });

  const [errors, setErrors] = useState<EventFormErrors>({});
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;
  const stepTitles = [
    'Basic Information',
    'Event Details',
    'Banner & Review'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof EventFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, banner: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setFormData((prev) => ({ ...prev, banner: undefined }));
    setBannerPreview(null);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: EventFormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Event name is required';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.audienceSize) {
        newErrors.audienceSize = 'Audience size is required';
      } else if (parseInt(formData.audienceSize) <= 0) {
        newErrors.audienceSize = 'Audience size must be a positive number';
      }
      if (!formData.date) {
        newErrors.date = 'Event date is required';
      } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.date = 'Event date must be in the future';
        }
      }
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.sponsorshipRequirements.trim()) newErrors.sponsorshipRequirements = 'Sponsorship requirements are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Input
              label="Event Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Tech Innovation Summit 2024"
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categoryOptions}
                error={errors.category}
                required
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
                error={errors.location}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Expected Audience Size"
                name="audienceSize"
                type="number"
                value={formData.audienceSize}
                onChange={handleInputChange}
                placeholder="e.g., 500"
                error={errors.audienceSize}
                min="1"
                required
              />

              <Input
                label="Event Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                error={errors.date}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your event, its purpose, and what makes it unique..."
              error={errors.description}
              rows={5}
              required
            />

            <Textarea
              label="Sponsorship Requirements"
              name="sponsorshipRequirements"
              value={formData.sponsorshipRequirements}
              onChange={handleInputChange}
              placeholder="What are you looking for in a sponsor? What benefits can you offer?"
              error={errors.sponsorshipRequirements}
              rows={4}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {bannerPreview ? (
              <div className="relative">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 text-center cursor-pointer hover:border-[#667eea]/50 hover:bg-white/10 transition-all">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-700 font-medium mb-2">
                    Click to upload event banner (Optional)
                  </p>
                  <p className="text-sm text-gray-600">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </label>
            )}
            
            {/* Review Summary */}
            <div className="bg-white/20 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-gray-800">Review Your Event</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Category:</strong> {categoryOptions.find(c => c.value === formData.category)?.label}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Date:</strong> {formData.date}</p>
                <p><strong>Audience:</strong> {formData.audienceSize} people</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{stepTitles[currentStep - 1]}</h2>
            <p className="text-gray-600 text-sm sm:text-base">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-white/30">
            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Back
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base touch-manipulation"
            >
              {isSubmitting ? 'Creating...' : currentStep === totalSteps ? 'Create Event' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
