import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { User } from '../models/user';
import { Food } from "../models/food";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.delete(
  '/api/user/:userID',
  [
    param('userID')
      .notEmpty().withMessage('User ID must be provided')
      .isUUID(4).withMessage('User ID must be a valid UUID'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { userID } = req.params;

    try {
      const existingUser = await User.findOne({ userId: userID });

      if (!existingUser) {
        throw new BadRequestError('User not found');
      }

      await User.deleteOne({ userId: userID });

      await Food.deleteMany({ userId: userID });
      console.log(`Deleted all food records for user ${userID}`);

      res.status(204).send();
    } catch (error) {
      throw new BadRequestError('Failed to delete user');
    }
  }
);

export { router as deleteUserRouter };
