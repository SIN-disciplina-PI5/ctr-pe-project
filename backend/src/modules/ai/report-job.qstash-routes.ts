import { Router } from "express";
import {
  runQStashReportJob,
  sweepQStashReportJobs,
} from "./report-job.qstash-controller.js";

export const qstashReportJobsRouter = Router();

qstashReportJobsRouter.post("/report-jobs", runQStashReportJob);
qstashReportJobsRouter.post("/report-jobs/sweep", sweepQStashReportJobs);
