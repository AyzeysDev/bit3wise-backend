import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Food } from "../models/food";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/food",
  [
    body("userId")
      .notEmpty()
      .withMessage("User ID must be provided")
      .isUUID(4)
      .withMessage("User ID must be a valid UUID"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { userId, name, calories, macros, nutrients, mealType } = req.body;

    try {
      const food = Food.build({
        userId,
        name,
        calories,
        macros: {
          carbs: macros.carbs,
          protein: macros.protein,
          fat: macros.fat,
        },
        nutrients: {
          protein: nutrients.protein,
          carbohydrate: nutrients.carbohydrate,
          fiber: nutrients.fiber,
          sugar: nutrients.sugar,
          fat: nutrients.fat,
          saturatedFat: nutrients.saturatedFat,
          polyunsaturatedFat: nutrients.polyunsaturatedFat,
          monounsaturatedFat: nutrients.monounsaturatedFat,
          cholesterol: nutrients.cholesterol,
          sodium: nutrients.sodium,
          potassium: nutrients.potassium,
        },
        mealType: {
          breakfast: mealType.breakfast,
          lunch: mealType.lunch,
          dinner: mealType.dinner,
          other: mealType.other,
        },
        createdAt: new Date(),
      });

      await food.save();

      res.status(201).send(food);
    } catch (error) {
      console.error("Error saving food data to MongoDB:", error);
      throw new BadRequestError("Failed to save food data");
    }
  }
);

export { router as createFoodRouter };
