export const exerciseDb = {
  // Chest
  'bench press': { titleKey: 'ex_bench_press', descKey: 'ex_bench_press_desc', gif_url: '/exercises/Barbell-Bench-Press.gif', muscleGroupKey: 'chest' },
  'incline dumbbell press': { titleKey: 'ex_incline_db_press', descKey: 'ex_incline_db_press_desc', gif_url: '/exercises/Incline-Dumbbell-Press.gif', muscleGroupKey: 'chest' },
  'cable flyes': { titleKey: 'ex_cable_flyes', descKey: 'ex_cable_flyes_desc', gif_url: '/exercises/Cable-Crossover.gif', muscleGroupKey: 'chest' },
  'push-ups': { titleKey: 'ex_pushups', descKey: 'ex_pushups_desc', gif_url: '/exercises/Push-Up.gif', muscleGroupKey: 'chest' },
  'pushups': { titleKey: 'ex_pushups', descKey: 'ex_pushups_desc', gif_url: '/exercises/Push-Up.gif', muscleGroupKey: 'chest' },
  'wide push-ups': { titleKey: 'ex_wide_pushups', descKey: 'ex_wide_pushups_desc', gif_url: '/exercises/Wide-Push-Up.gif', muscleGroupKey: 'chest' },
  'diamond push-ups': { titleKey: 'ex_diamond_pushups', descKey: 'ex_diamond_pushups_desc', gif_url: '/exercises/Diamond-Push-Up.gif', muscleGroupKey: 'chest' },
  'chest dips': { titleKey: 'ex_chest_dips', descKey: 'ex_chest_dips_desc', gif_url: '/exercises/Chest-Dips.gif', muscleGroupKey: 'chest' },

  // Back
  'deadlift': { titleKey: 'ex_deadlift', descKey: 'ex_deadlift_desc', gif_url: '/exercises/Barbell-Deadlift.gif', muscleGroupKey: 'back' },
  'lat pulldowns': { titleKey: 'ex_lat_pulldown', descKey: 'ex_lat_pulldown_desc', gif_url: '/exercises/Lat-Pulldown.gif', muscleGroupKey: 'back' },
  'seated cable row': { titleKey: 'ex_seated_row', descKey: 'ex_seated_row_desc', gif_url: '/exercises/Seated-Cable-Row.gif', muscleGroupKey: 'back' },
  'bent-over rows': { titleKey: 'ex_bent_row', descKey: 'ex_bent_row_desc', gif_url: '/exercises/Barbell-Row.gif', muscleGroupKey: 'back' },
  'superman holds': { titleKey: 'ex_superman', descKey: 'ex_superman_desc', gif_url: '/exercises/Superman-Hold.gif', muscleGroupKey: 'back' },

  // Legs
  'barbell squats': { titleKey: 'ex_squat', descKey: 'ex_squat_desc', gif_url: '/exercises/BARBELL-SQUAT.gif', muscleGroupKey: 'legs' },
  'squats': { titleKey: 'ex_squat', descKey: 'ex_squat_desc', gif_url: '/exercises/BARBELL-SQUAT.gif', muscleGroupKey: 'legs' },
  'leg press': { titleKey: 'ex_leg_press', descKey: 'ex_leg_press_desc', gif_url: '/exercises/Leg-Press.gif', muscleGroupKey: 'legs' },
  'leg extensions': { titleKey: 'ex_leg_extension', descKey: 'ex_leg_extension_desc', gif_url: '/exercises/LEG-EXTENSION.gif', muscleGroupKey: 'legs' },
  'bodyweight squats': { titleKey: 'ex_bw_squats', descKey: 'ex_bw_squats_desc', gif_url: '/exercises/Bodyweight-Squat.gif', muscleGroupKey: 'legs' },
  'walking lunges': { titleKey: 'ex_lunges', descKey: 'ex_lunges_desc', gif_url: '/exercises/Walking-Lunge.gif', muscleGroupKey: 'legs' },
  'calf raises': { titleKey: 'ex_calf_raise', descKey: 'ex_calf_raise_desc', gif_url: '/exercises/Calf-Raise.gif', muscleGroupKey: 'legs' },

  // Shoulders & Arms
  'overhead press': { titleKey: 'ex_ohp', descKey: 'ex_ohp_desc', gif_url: '/exercises/Barbell-Shoulder-Press.gif', muscleGroupKey: 'shoulders' },
  'standing military press': { titleKey: 'ex_ohp', descKey: 'ex_ohp_desc', gif_url: '/exercises/Barbell-Shoulder-Press.gif', muscleGroupKey: 'shoulders' },
  'lateral raises': { titleKey: 'ex_lateral_raise', descKey: 'ex_lateral_raise_desc', gif_url: '/exercises/Dumbbell-Lateral-Raise.gif', muscleGroupKey: 'shoulders' },
  'pike push-ups': { titleKey: 'ex_pike_pushups', descKey: 'ex_pike_pushups_desc', gif_url: '/exercises/Pike-Push-Up.gif', muscleGroupKey: 'shoulders' },
  'barbell curls': { titleKey: 'ex_barbell_curl', descKey: 'ex_barbell_curl_desc', gif_url: '/exercises/Barbell-Curl.gif', muscleGroupKey: 'arms' },
  'tricep pushdowns': { titleKey: 'ex_tricep_pushdown', descKey: 'ex_tricep_pushdown_desc', gif_url: '/exercises/Pushdown.gif', muscleGroupKey: 'arms' },
  'tricep dips': { titleKey: 'ex_tricep_dip', descKey: 'ex_tricep_dip_desc', gif_url: '/exercises/Tricep-Dip.gif', muscleGroupKey: 'arms' },
  'dumbbell bicep curls': { titleKey: 'ex_db_curl', descKey: 'ex_db_curl_desc', gif_url: '/exercises/Dumbbell-Curl.gif', muscleGroupKey: 'arms' },
  'hammer curls': { titleKey: 'ex_hammer_curl', descKey: 'ex_hammer_curl_desc', gif_url: '/exercises/Hammer-Curl.gif', muscleGroupKey: 'arms' },

  // Core & Cardio
  'burpees': { titleKey: 'ex_burpee', descKey: 'ex_burpee_desc', gif_url: '/exercises/Burpee.gif', muscleGroupKey: 'cardio' },
  'mountain climbers': { titleKey: 'ex_mountain_climber', descKey: 'ex_mountain_climber_desc', gif_url: '/exercises/Mountain-Climber.gif', muscleGroupKey: 'cardio' },
  'front plank': { titleKey: 'ex_plank', descKey: 'ex_plank_desc', gif_url: '/exercises/Front-Plank.gif', muscleGroupKey: 'core' },
  'cable crunches': { titleKey: 'ex_cable_crunch', descKey: 'ex_cable_crunch_desc', gif_url: '/exercises/Cable-Crunch.gif', muscleGroupKey: 'core' },
};

export const getExerciseMetadata = (name) => {
  const normalized = name?.toLowerCase().trim();
  return exerciseDb[normalized] || null;
};
