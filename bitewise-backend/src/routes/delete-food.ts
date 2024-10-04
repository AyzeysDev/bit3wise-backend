import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { Food } from '../models/food';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.delete(
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
      const existingFood = await Food.findById(foodID);

      if (!existingFood) {
        throw new BadRequestError('Food entry not found');
      }

      await Food.deleteOne({ _id: foodID });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting food entry:", error);
      throw new BadRequestError('Failed to delete food entry');
    }
  }
);

export { router as deleteFoodRouter };
