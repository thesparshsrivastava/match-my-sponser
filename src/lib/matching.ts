import { Event, EventCategory } from '@/types/event';
import { Sponsor } from '@/types/sponsor';

interface MatchFactors {
  categoryAlignment: number;
  budgetCompatibility: number;
  audienceSizeFit: number;
  locationProximity: number;
}

interface MatchResult {
  score: number;
  breakdown: MatchFactors;
}

/**
 * Calculate match percentage between an event and a sponsor
 * Uses a weighted scoring algorithm considering multiple factors:
 * - Category alignment (35%)
 * - Budget compatibility (30%)
 * - Audience size fit (20%)
 * - Location proximity (15%)
 * 
 * @param event - The event to match
 * @param sponsor - The sponsor to match against
 * @returns Match result with score and detailed breakdown
 */
export function calculateMatchScore(event: Event, sponsor: Sponsor): MatchResult {
  const weights = {
    category: 0.35, // 35% weight
    budget: 0.30,   // 30% weight
    audience: 0.20, // 20% weight
    location: 0.15, // 15% weight
  };

  // 1. Category Alignment Score (0-100)
  const categoryScore = calculateCategoryScore(event.category, sponsor.preferences.categories);

  // 2. Budget Compatibility Score (0-100)
  const budgetScore = calculateBudgetScore(event, sponsor);

  // 3. Audience Size Fit Score (0-100)
  const audienceScore = calculateAudienceScore(event.audienceSize, sponsor.preferences.audienceSize);

  // 4. Location Proximity Score (0-100)
  const locationScore = calculateLocationScore(event.location, sponsor.location);

  // Calculate weighted total score
  const totalScore =
    categoryScore * weights.category +
    budgetScore * weights.budget +
    audienceScore * weights.audience +
    locationScore * weights.location;

  const breakdown: MatchFactors = {
    categoryAlignment: Math.round(categoryScore),
    budgetCompatibility: Math.round(budgetScore),
    audienceSizeFit: Math.round(audienceScore),
    locationProximity: Math.round(locationScore),
  };

  return {
    score: Math.round(totalScore),
    breakdown,
  };
}

/**
 * Calculate category alignment score
 */
function calculateCategoryScore(
  eventCategory: EventCategory,
  sponsorCategories: EventCategory[]
): number {
  // Perfect match if sponsor is interested in this category
  if (sponsorCategories.includes(eventCategory)) {
    return 100;
  }

  // Partial match for related categories
  const relatedCategories: Record<EventCategory, EventCategory[]> = {
    'hackathon': ['competition', 'workshop'],
    'competition': ['hackathon', 'sports'],
    'sports': ['competition', 'college-fest'],
    'college-fest': ['cultural', 'sports'],
    'cultural': ['college-fest', 'workshop'],
    'workshop': ['hackathon', 'cultural'],
  };

  const related = relatedCategories[eventCategory] || [];
  const hasRelated = sponsorCategories.some((cat) => related.includes(cat));

  if (hasRelated) {
    return 60; // Partial match
  }

  return 20; // No match but still possible
}

/**
 * Calculate budget compatibility score
 * Estimates event budget needs and compares with sponsor budget
 */
function calculateBudgetScore(event: Event, sponsor: Sponsor): number {
  // Estimate event budget based on audience size and category
  const estimatedBudget = estimateEventBudget(event);

  const sponsorMin = sponsor.budgetRange.min;
  const sponsorMax = sponsor.budgetRange.max;

  // Perfect match if estimated budget is within sponsor's range
  if (estimatedBudget >= sponsorMin && estimatedBudget <= sponsorMax) {
    return 100;
  }

  // Calculate how far off the budget is
  if (estimatedBudget < sponsorMin) {
    // Event needs less than sponsor's minimum
    const difference = sponsorMin - estimatedBudget;
    const percentDiff = (difference / sponsorMin) * 100;
    
    // Still good if within 30% below minimum
    if (percentDiff <= 30) {
      return 80;
    }
    return Math.max(40, 100 - percentDiff);
  } else {
    // Event needs more than sponsor's maximum
    const difference = estimatedBudget - sponsorMax;
    const percentDiff = (difference / sponsorMax) * 100;
    
    // Poor match if significantly over budget
    if (percentDiff > 50) {
      return 20;
    }
    return Math.max(30, 100 - percentDiff * 2);
  }
}

/**
 * Estimate event budget based on audience size and category
 */
function estimateEventBudget(event: Event): number {
  // Base cost per attendee varies by category
  const costPerAttendee: Record<EventCategory, number> = {
    'hackathon': 100,
    'competition': 80,
    'sports': 60,
    'college-fest': 50,
    'cultural': 70,
    'workshop': 90,
  };

  const baseCost = costPerAttendee[event.category] || 70;
  const estimatedBudget = event.audienceSize * baseCost;

  // Add base overhead
  return estimatedBudget + 10000;
}

/**
 * Calculate audience size fit score
 */
function calculateAudienceScore(
  eventAudience: number,
  sponsorPreference: { min: number; max: number }
): number {
  // Perfect match if within sponsor's preferred range
  if (eventAudience >= sponsorPreference.min && eventAudience <= sponsorPreference.max) {
    return 100;
  }

  // Calculate how far off the audience size is
  if (eventAudience < sponsorPreference.min) {
    const difference = sponsorPreference.min - eventAudience;
    const percentDiff = (difference / sponsorPreference.min) * 100;
    
    // Still acceptable if within 40% below minimum
    if (percentDiff <= 40) {
      return 70;
    }
    return Math.max(30, 100 - percentDiff);
  } else {
    // Event audience is larger than preferred maximum
    const difference = eventAudience - sponsorPreference.max;
    const percentDiff = (difference / sponsorPreference.max) * 100;
    
    // Larger audience is often better for sponsors
    if (percentDiff <= 50) {
      return 90; // Good match - more exposure
    }
    return Math.max(60, 100 - percentDiff / 2);
  }
}

/**
 * Calculate location proximity score based on string matching
 */
function calculateLocationScore(eventLocation: string, sponsorLocation: string): number {
  const eventLower = eventLocation.toLowerCase();
  const sponsorLower = sponsorLocation.toLowerCase();

  // Exact match
  if (eventLower === sponsorLower) {
    return 100;
  }

  // Same state (check for state abbreviation or name)
  const eventParts = eventLower.split(',').map((s) => s.trim());
  const sponsorParts = sponsorLower.split(',').map((s) => s.trim());

  if (eventParts.length >= 2 && sponsorParts.length >= 2) {
    // Compare state (last part)
    if (eventParts[eventParts.length - 1] === sponsorParts[sponsorParts.length - 1]) {
      return 80; // Same state
    }
  }

  // Check if any part matches (city or state)
  const hasCommonPart = eventParts.some((part) => sponsorParts.includes(part));
  if (hasCommonPart) {
    return 60;
  }

  // Different locations - still possible for remote sponsorship
  return 40;
}

/**
 * Get match quality label based on score
 */
export function getMatchQuality(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

/**
 * Filter sponsors by minimum match score
 */
export function filterSponsorsByMatchScore(
  event: Event,
  sponsors: Sponsor[],
  minScore: number = 50
): Array<{ sponsor: Sponsor; matchScore: number }> {
  return sponsors
    .map((sponsor) => ({
      sponsor,
      matchScore: calculateMatchScore(event, sponsor).score,
    }))
    .filter((item) => item.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore);
}
