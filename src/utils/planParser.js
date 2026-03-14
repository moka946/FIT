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
        let content = match[2];
        // Try to extract calories
        const calMatch = content.match(/(\d+)\s*(?:cal|calories|سعر|حراري)/i);
        const calories = calMatch ? parseInt(calMatch[1]) : 0;
        
        // Clean up content
        const portion = content.replace(/\(\d+\s*(?:cal|calories|سعر|حراري)\)/i, '').trim();

        // Extract a "Meal Name" from the content - usually everything before the first comma or a specific number
        let mealName = portion.split(',')[0].trim();
        // If it's too long, or starts with a measurement, try to find the actual name
        if (mealName.length > 40) mealName = match[1]; // Fallback to category name

        // Image Matching Logic
        const getMealImage = (text) => {
          const lower = text.toLowerCase();
          if (lower.includes('egg') || lower.includes('بيض')) return "/meal-images/eggs.jpg";
          if (lower.includes('foul') || lower.includes('ful') || lower.includes('فول')) return "/meal-images/full.jpg";
          if (lower.includes('chicken') || lower.includes('دجاج') || lower.includes('فراخ')) return "/meal-images/chicken.jpg";
          if (lower.includes('rice') || lower.includes('أرز') || lower.includes('رز')) return "/meal-images/chicken_and_rice.jpg";
          if (lower.includes('fish') || lower.includes('سمك')) return "/meal-images/sea_base.jpg";
          if (lower.includes('yogurt') || lower.includes('زبادي')) return "/meal-images/greek_yogurt.jpg";
          if (lower.includes('tuna') || lower.includes('تونة')) return "/meal-images/tuna_salad.jpg";
          if (lower.includes('areesh') || lower.includes('قريش')) return "/meal-images/areesh_cheese.jpg";
          if (lower.includes('falafel') || lower.includes('taameya') || lower.includes('طعمية')) return "/meal-images/falafel.jpg";
          if (lower.includes('koshary') || lower.includes('كشري')) return "/meal-images/koshary.jpg";
          if (lower.includes('dates') || lower.includes('بلح') || lower.includes('تمر')) return "/meal-images/dates.jpg";
          if (lower.includes('termes') || lower.includes('ترمس')) return "/meal-images/termes.jpg";
          if (lower.includes('banana') || lower.includes('موز')) return "/meal-images/banana.jpg";
          if (lower.includes('nuts') || lower.includes('مكسرات')) return "/meal-images/nuts.jpg";
          if (lower.includes('shake') || lower.includes('شيك')) return "/meal-images/protien_shake.jpg";
          
          // Category default fallback
          if (type.includes('Breakfast')) return "/meal-images/full.jpg";
          if (type.includes('Lunch')) return "/meal-images/chicken.jpg";
          if (type.includes('Dinner')) return "/meal-images/tuna_salad.jpg";
          return "/meal-images/termes.jpg";
        };

        meals.push({
          titleKey: null,
          name: mealName, 
          portion_size: portion,
          meal_type: type,
          calories: calories,
          protein: Math.round(calories * 0.1),
          carbs: Math.round(calories * 0.1),
          fats: Math.round(calories * 0.05),
          ingredients: portion,
          instructions: "Follow the portion measurements strictly.",
          image_url: getMealImage(portion)
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
