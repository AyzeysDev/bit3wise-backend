import mongoose from 'mongoose';

interface FoodAttrs {
  userId: string;
  name: string;
  calories: number;
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
  mealType: {
    breakfast: boolean; 
    lunch: boolean; 
    dinner: boolean;
    other: boolean;
  };
  createdAt?: Date;
}

interface FoodDoc extends mongoose.Document {
  userId: string;
  name: string;
  calories: number;
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
  mealType: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    other: boolean;
  };
  createdAt: Date; // Change from string to Date
}

interface FoodModel extends mongoose.Model<FoodDoc> {
  build(attrs: FoodAttrs): FoodDoc;
}

const foodSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  macros: {
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
  nutrients: {
    protein: { type: Number, required: true },
    carbohydrate: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },
    fat: { type: Number, required: true },
    saturatedFat: { type: Number, required: true },
    polyunsaturatedFat: { type: Number, required: true },
    monounsaturatedFat: { type: Number, required: true },
    cholesterol: { type: Number, required: true },
    sodium: { type: Number, required: true },
    potassium: { type: Number, required: true },
  },
  mealType: {
    breakfast: { type: Boolean, required: true, default: false },
    lunch: { type: Boolean, required: true, default: false },
    dinner: { type: Boolean, required: true, default: false },
    other: { type: Boolean, required: true, default: false },
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

foodSchema.statics.build = (attrs: FoodAttrs) => {
  return new Food(attrs);
};

const Food = mongoose.model<FoodDoc, FoodModel>('Food', foodSchema);

export { Food };
