import { getExerciseMetadata } from '../lib/exerciseDb';

/**
 * Parses a markdown workout plan to extract exercises for a specific day.
 * @param {string} markdown - The full plan markdown.
 * @param {string} dayName - The day to look for (e.g., "Monday").
 * @returns {Array} - Array of exercise objects.
 */
/**
 * Parses a markdown nutrition plan to extract meals.
 * @param {string} markdown - The full plan markdown.
 * @returns {Array} - Array of meal objects.
 */
export const parseMealsFromPlan = (markdown) => {
  if (!markdown) return [];

  const nutritionSection = markdown.split(/#\s+Nutrition Plan/i)[1];
  if (!nutritionSection) return [];

  const meals = [];
  const lines = nutritionSection.split('\n');
  
  // Look for meal patterns like "- **Breakfast**: ..." or "### Breakfast"
  // Supports both English and Arabic meal names
  const mealMappings = [
    { type: 'Breakfast', names: ['Breakfast', 'الفطار', 'فطار', 'وجبة الإفطار'] },
    { type: 'Lunch', names: ['Lunch', 'الغداء', 'غداء', 'وجبة الغداء'] },
    { type: 'Dinner', names: ['Dinner', 'العشاء', 'عشاء', 'وجبة العشاء'] },
    { type: 'Snack', names: ['Snack', 'سناك', 'وجبة خفيفة'] },
    { type: 'Pre-Workout', names: ['Pre-Workout', 'قبل التمرين'] },
    { type: 'Post-Workout', names: ['Post-Workout', 'بعد التمرين'] },
    { type: 'Suhoor', names: ['Suhoor', 'السحور'] },
    { type: 'Iftar', names: ['Iftar', 'الإفطار'] }
  ];
  
  lines.forEach(line => {
    mealMappings.forEach(({ type, names }) => {
      const namesPattern = names.join('|');
      const typeRegex = new RegExp(`(?:\\*\\*|###)?\\s*(${namesPattern})\\s*(?:\\*\\*)?:\\s*(.*)`, 'i');
      const match = line.match(typeRegex);
      
      if (match) {
        const content = match[2];
        // Try to extract calories from the end like "(400 cal)" or "(400 سعر)"
        const calMatch = content.match(/(\d+)\s*(?:cal|calories|سعر|حراري)/i);
        const calories = calMatch ? parseInt(calMatch[1]) : 0;
        
        // Clean up content to remove calorie mentions
        const portion = content.replace(/\(\d+\s*(?:cal|calories|سعر|حراري)\)/i, '').trim();

        meals.push({
          titleKey: null,
          name: match[1], // Use the name found in the text
          portion_size: portion,
          meal_type: type, // Standardized type for categorization
          calories: calories,
          protein: Math.round(calories * 0.1),
          carbs: Math.round(calories * 0.1),
          fats: Math.round(calories * 0.05),
          ingredients: portion,
          instructions: "Follow the portion measurements strictly.",
          image_url: type.toLowerCase().includes('breakfast') ? "/meal-images/full.jpg" : 
                     type.toLowerCase().includes('lunch') ? "/meal-images/chicken.jpg" :
                     type.toLowerCase().includes('dinner') ? "/meal-images/tuna_salad.jpg" : "/meal-images/termes.jpg"
        });
      }
    });
  });

  return meals;
};

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
