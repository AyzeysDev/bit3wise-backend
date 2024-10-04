export interface ReportData {
    userId: string;
    totalCalories: number;
    calories: {
      total: number;
      goal: number;
      average: number;
      breakdown: {
        breakfast: number;
        lunch: number;
        dinner: number;
        other: number;
      };
    };
    macros: {
      carbs: number;
      protein: number;
      fat: number;
    };
    nutrients: {
      protein: number;
      carbohydrate: number;
      fiber: number;
      sugar: number;
      fat: number;
      saturatedFat: number;
      polyunsaturatedFat: number;
      monounsaturatedFat: number;
      cholesterol: number;
      sodium: number;
      potassium: number;
    };
    createdAt: string;
  }
  
  export function createEmptyReport(userId: string, goal: number = 2000): ReportData {
    return {
      userId,
      totalCalories: 0,
      calories: {
        total: 0,
        goal: goal,
        average: 0,
        breakdown: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          other: 0,
        },
      },
      macros: {
        carbs: 0,
        protein: 0,
        fat: 0,
      },
      nutrients: {
        protein: 0,
        carbohydrate: 0,
        fiber: 0,
        sugar: 0,
        fat: 0,
        saturatedFat: 0,
        polyunsaturatedFat: 0,
        monounsaturatedFat: 0,
        cholesterol: 0,
        sodium: 0,
        potassium: 0,
      },
      createdAt: new Date().toISOString(),
    };
  }
  
  
  export function aggregateReportData(reportData: ReportData, foodEntries: any[]) {
    foodEntries.forEach((entry) => {
      reportData.totalCalories += entry.calories;
      reportData.calories.total += entry.calories;
  
      if (entry.mealType.breakfast) {
        reportData.calories.breakdown.breakfast += entry.calories;
      }
      if (entry.mealType.lunch) {
        reportData.calories.breakdown.lunch += entry.calories;
      }
      if (entry.mealType.dinner) {
        reportData.calories.breakdown.dinner += entry.calories;
      }
      if (entry.mealType.other) {
        reportData.calories.breakdown.other += entry.calories;
      }
  
      reportData.macros.carbs += entry.macros.carbs;
      reportData.macros.protein += entry.macros.protein;
      reportData.macros.fat += entry.macros.fat;
  
      reportData.nutrients.protein += entry.nutrients.protein;
      reportData.nutrients.carbohydrate += entry.nutrients.carbohydrate;
      reportData.nutrients.fiber += entry.nutrients.fiber;
      reportData.nutrients.sugar += entry.nutrients.sugar;
      reportData.nutrients.fat += entry.nutrients.fat;
      reportData.nutrients.saturatedFat += entry.nutrients.saturatedFat;
      reportData.nutrients.polyunsaturatedFat += entry.nutrients.polyunsaturatedFat;
      reportData.nutrients.monounsaturatedFat += entry.nutrients.monounsaturatedFat;
      reportData.nutrients.cholesterol += entry.nutrients.cholesterol;
      reportData.nutrients.sodium += entry.nutrients.sodium;
      reportData.nutrients.potassium += entry.nutrients.potassium;
    });
  
    if (foodEntries.length > 0) {
      reportData.calories.average = reportData.calories.total / foodEntries.length;
    }
  }
  