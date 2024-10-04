import express, { Request, Response } from "express";
import { param, query, validationResult } from "express-validator";
import { Food } from "../models/food";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
import { createEmptyReport, aggregateReportData } from '../services/report-utils';

const router = express.Router();

router.get(
  "/api/food/:userId/:date",
  [
    param("userId")
      .notEmpty()
      .withMessage("User ID must be provided")
      .isUUID(4)
      .withMessage("User ID must be a valid UUID"),
    param("date")
      .notEmpty()
      .withMessage("Date must be provided")
      .isISO8601()
      .withMessage("Date must be a valid ISO 8601 date"),
    query("goal")
      .notEmpty()
      .withMessage("Goal must be provided")
      .isNumeric()
      .withMessage("Goal must be a number"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { userId, date } = req.params;
    const { goal } = req.query;

    try {
      const parsedGoal = parseFloat(goal as string);

      if (isNaN(parsedGoal)) {
        throw new BadRequestError("Goal must be a valid number");
      }

      const startDate = new Date(`${date}T00:00:00Z`);
      const endDate = new Date(`${date}T23:59:59Z`);

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);

      const foodEntries = await Food.find({
        userId,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      console.log("Food Entries Found:", foodEntries.map(entry => entry.createdAt));

      let reportData;

      if (foodEntries.length === 0) {
        reportData = createEmptyReport(userId, parsedGoal);
      } else {
        reportData = createEmptyReport(userId, parsedGoal);
        aggregateReportData(reportData, foodEntries);
      }

      res.status(200).send(reportData);
    } catch (error) {
      console.error("Error generating food history report:", error);
      throw new BadRequestError("Failed to generate food history report");
    }
  }
);

export { router as getFoodHistoryReportRouter };
