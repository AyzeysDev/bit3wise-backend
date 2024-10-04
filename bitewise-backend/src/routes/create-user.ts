import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import admin from "firebase-admin";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("User ID must be provided")
      .isUUID(4)
      .withMessage("User ID must be a valid UUID"),
    body("goal")
      .notEmpty()
      .withMessage("Calorie goal must be provided")
      .isNumeric()
      .withMessage("Calorie goal must be a number"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { userId, goal, createdAt, updatedAt } = req.body;

    // let userId;
    // try {
    //   const decodedToken = await admin.auth().verifyIdToken(userID);
    //   userId = decodedToken.uid;
    // } catch (error) {
    //     console.error('Error verifying Firebase ID token:', error);
    //     throw new BadRequestError('Invalid Firebase ID token');
    // }

    try {
      const existingUser = await User.findOne({ userId });

      if (existingUser) {
        throw new BadRequestError("User already exists");
      }

      const user = User.build({ userId, goal, createdAt, updatedAt });
      await user.save();

      res.status(201).send(user);
    } catch (error) {
      console.error("Error saving user data to MongoDB:", error);
      throw new BadRequestError("Failed to save user data");
    }
  }
);

export { router as userCreatedRouter };
