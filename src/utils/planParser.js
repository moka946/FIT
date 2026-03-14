import { getExerciseMetadata } from '../lib/exerciseDb';

/**
 * Parses a markdown workout plan to extract exercises for a specific day.
 * @param {string} markdown - The full plan markdown.
 * @param {string} dayName - The day to look for (e.g., "Monday").
 * @returns {Array} - Array of exercise objects.
 */
export const parseExercisesFromPlan = (markdown, dayName) => {
  if (!markdown) return [];

  const dayRegex = new RegExp(`${dayName}:\\s*([^#]+)`, 'i');
  const dayMatch = markdown.match(dayRegex);
  
  if (!dayMatch) return [];

  const dayContent = dayMatch[1];
  const exercises = [];

  // Match table rows or list items
  // Format 1: | Exercise | Sets | Reps |
  // Format 2: - Exercise: 3 sets of 10
  const lines = dayContent.split('\n');
  
  lines.forEach(line => {
    // Table parser
    if (line.includes('|') && !line.toLowerCase().includes('exercise') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
      if (parts.length >= 3) {
        const name = parts[0];
        const sets = parts[1];
        const reps = parts[2];
        
        const metadata = getExerciseMetadata(name);
        exercises.push({
          name: name,
          titleKey: metadata?.titleKey || null,
          descKey: metadata?.descKey || null,
          sets: sets,
          reps: reps,
          calories: metadata ? 40 : 20, // Default calories if not in DB
          fat: metadata ? 4 : 2,
          gif_url: metadata?.gif_url || '/exercises/Push-Up.gif' // Placeholder if unknown
        });
      }
    }
    // List parser
    else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      const parts = line.replace(/^[-*]\s*/, '').split(/[:|-]/);
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const details = parts[1].trim(); // e.g. "3 sets of 10"
        
        const metadata = getExerciseMetadata(name);
        exercises.push({
          name: name,
          titleKey: metadata?.titleKey || null,
          descKey: metadata?.descKey || null,
          sets: details.match(/\d+\s*sets?/i)?.[0] || '3',
          reps: details.match(/\d+[\d-]*\s*reps?/i)?.[0] || '10-12',
          calories: metadata ? 40 : 20,
          fat: metadata ? 4 : 2,
          gif_url: metadata?.gif_url || '/exercises/Push-Up.gif'
        });
      }
    }
  });

  return exercises;
};
