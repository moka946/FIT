import { getExerciseMetadata } from '../lib/exerciseDb';

/**
 * Parses a markdown workout plan to extract exercises for a specific day.
 * @param {string} markdown - The full plan markdown.
 * @param {string} dayName - The day to look for (e.g., "Monday").
 * @returns {Array} - Array of exercise objects.
 */
export const parseExercisesFromPlan = (markdown, dayName) => {
  if (!markdown) return [];

  // Look for "Day: Monday" or just "Monday" as a heading
  const dayRegex = new RegExp(`(?:Day:\\s*)?${dayName}`, 'i');
  
  // Find the index where this day starts
  const sections = markdown.split(/##+/);
  const daySection = sections.find(section => dayRegex.test(section));
  
  if (!daySection) return [];

  const exercises = [];
  const lines = daySection.split('\n');
  
  lines.forEach(line => {
    // Table parser: | Push-ups | 3 | 15 |
    if (line.includes('|') && !line.toLowerCase().includes('exercise') && !line.includes('---')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
      if (parts.length >= 2) {
        const name = parts[0];
        const sets = parts[1] || '3';
        const reps = parts[2] || '12';
        
        const metadata = getExerciseMetadata(name);
        exercises.push({
          name: name,
          titleKey: metadata?.titleKey || null,
          descKey: metadata?.descKey || null,
          sets: sets,
          reps: reps,
          calories: metadata ? 40 : 20,
          fat: metadata ? 4 : 2,
          gif_url: metadata?.gif_url || '/exercises/Push-Up.gif'
        });
      }
    }
  });

  return exercises;
};
