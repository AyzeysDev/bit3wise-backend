import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { Food } from '../models/food';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get(
  '/api/food/:foodID',
  [
    param('foodID')
      .notEmpty().withMessage('Food ID must be provided')
      .isMongoId().withMessage('Food ID must be a valid MongoDB ObjectID'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { foodID } = req.params;

    try {
      const food = await Food.findById(foodID);

      if (!food) {
        throw new BadRequestError('Food entry not found');
      }

      res.status(200).send(food);
    } catch (error) {
      console.error("Error retrieving food entry:", error);
      throw new BadRequestError('Failed to retrieve food entry');
    }
  }
);

export { router as getFoodRouter };
