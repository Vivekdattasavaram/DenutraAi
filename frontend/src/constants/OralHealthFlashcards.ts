/**
 * Oral Health Educational Flashcards
 * Provides daily insights, tips, myths vs facts, and prevention advice
 * Future: Can be driven from backend API based on user assessment data
 */

export interface FlashCard {
  id: string;
  type: 'tip' | 'myth' | 'fact' | 'hygiene' | 'prevention' | 'awareness' | 'gum' | 'brushing';
  icon: string; // lucide-react-native icon name
  title: string;
  content: string;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'cyan' | 'indigo' | 'rose';
  personalized?: boolean; // Flag for future personalization based on weak categories
}

export const ORAL_HEALTH_FLASHCARDS: FlashCard[] = [
  {
    id: 'tip-1',
    type: 'tip',
    icon: 'Zap',
    title: 'Daily Dental Tip',
    content: 'Brush for 2 minutes twice daily using circular motions. Set a timer to ensure you brush long enough.',
    color: 'blue',
  },
  {
    id: 'myth-1',
    type: 'myth',
    icon: 'AlertCircle',
    title: 'Myth vs Fact',
    content: 'Myth: Bleeding gums are normal.\nFact: Bleeding gums may indicate gingivitis or early periodontitis.',
    color: 'red',
  },
  {
    id: 'prevention-1',
    type: 'prevention',
    icon: 'Shield',
    title: 'Prevention Advice',
    content: 'Visit your dentist every 6 months for professional cleanings and early detection of cavities.',
    color: 'green',
  },
  {
    id: 'hygiene-1',
    type: 'hygiene',
    icon: 'Sparkles',
    title: 'Oral Hygiene Fact',
    content: 'Replace your toothbrush every 3 months or sooner if bristles are frayed. A worn toothbrush is less effective.',
    color: 'cyan',
  },
  {
    id: 'awareness-1',
    type: 'awareness',
    icon: 'AlertTriangle',
    title: 'Sugar & Cavity Awareness',
    content: 'Sugary drinks increase cavity risk. Rinse your mouth with water after consuming sugary or acidic beverages.',
    color: 'amber',
  },
  {
    id: 'gum-1',
    type: 'gum',
    icon: 'Heart',
    title: 'Gum Health Tips',
    content: 'Floss daily to remove hidden plaque between teeth. This prevents gum disease and maintains healthy gums.',
    color: 'purple',
  },
  {
    id: 'brushing-1',
    type: 'brushing',
    icon: 'Wind',
    title: 'Brushing Guidance',
    content: 'Wait 30 minutes before brushing after acidic drinks like soda or lemon water. Brushing immediately can weaken enamel.',
    color: 'indigo',
  },
  {
    id: 'fact-1',
    type: 'fact',
    icon: 'Brain',
    title: 'Did You Know?',
    content: 'Your mouth contains over 700 species of bacteria. Most are harmless, but some cause cavities and gum disease.',
    color: 'rose',
  },
  {
    id: 'tip-2',
    type: 'tip',
    icon: 'Zap',
    title: 'Electric vs Manual',
    content: 'Both electric and manual toothbrushes work well. Choose what you enjoy using most for consistent brushing.',
    color: 'blue',
  },
  {
    id: 'prevention-2',
    type: 'prevention',
    icon: 'Shield',
    title: 'Fluoride Matters',
    content: 'Use fluoride toothpaste daily. Fluoride strengthens enamel and helps prevent cavities.',
    color: 'green',
  },
  {
    id: 'awareness-2',
    type: 'awareness',
    icon: 'AlertTriangle',
    title: 'Snacking Impact',
    content: 'Frequent snacking creates an acidic environment in your mouth. Limit snacks to meal times for better oral health.',
    color: 'amber',
  },
  {
    id: 'myth-2',
    type: 'myth',
    icon: 'AlertCircle',
    title: 'Myth: Hard Brushing',
    content: 'Myth: Brush harder for cleaner teeth.\nFact: Aggressive brushing damages gums and enamel. Use gentle pressure.',
    color: 'red',
  },
];

/**
 * Flashcard color scheme mapping
 * Used for consistent theming across the app
 */
export const FLASHCARD_COLORS = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    title: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    title: 'text-green-700 dark:text-green-400',
    icon: 'text-green-600 dark:text-green-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-100',
    title: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    title: 'text-purple-700 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
    title: 'text-red-700 dark:text-red-400',
    icon: 'text-red-600 dark:text-red-400',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    text: 'text-cyan-900 dark:text-cyan-100',
    title: 'text-cyan-700 dark:text-cyan-400',
    icon: 'text-cyan-600 dark:text-cyan-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-900 dark:text-indigo-100',
    title: 'text-indigo-700 dark:text-indigo-400',
    icon: 'text-indigo-600 dark:text-indigo-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-900 dark:text-rose-100',
    title: 'text-rose-700 dark:text-rose-400',
    icon: 'text-rose-600 dark:text-rose-400',
  },
};

/**
 * Get color styles for a flashcard
 * @param color - The color key for the flashcard
 * @returns Color styling object
 */
export const getFlashCardColorStyles = (color: FlashCard['color']) => {
  return FLASHCARD_COLORS[color];
};

/**
 * Get all flashcards of a specific type
 * @param type - The type of flashcard to filter
 * @returns Array of flashcards of that type
 */
export const getFlashCardsByType = (type: FlashCard['type']) => {
  return ORAL_HEALTH_FLASHCARDS.filter(card => card.type === type);
};

/**
 * Get random flashcards for daily rotation
 * @param count - Number of flashcards to return
 * @returns Array of random flashcards
 */
export const getRandomFlashcards = (count: number = 3) => {
  const shuffled = [...ORAL_HEALTH_FLASHCARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

/**
 * Future: Get personalized flashcards based on user assessment data
 * @param weakCategories - Array of weak category names from assessment
 * @param riskLevel - User's current risk level
 * @returns Array of relevant flashcards
 */
export const getPersonalizedFlashcards = (
  weakCategories: string[] = [],
  riskLevel: string = 'low'
): FlashCard[] => {
  // TODO: Implement logic to select flashcards based on:
  // - User's weak assessment categories
  // - Risk level (low, moderate, high)
  // - Mistakes made in assessments
  // For now, return random cards
  return getRandomFlashcards(5);
};
