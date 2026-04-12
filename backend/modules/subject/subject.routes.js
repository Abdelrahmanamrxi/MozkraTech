import { Router } from "express";
import { createSubject } from "./subject.controller.js";
import { validation } from "../../middleware/validation.js";
import { createSubjectSchema } from "./subject.validation.js";
import { authentication } from "../../middleware/auth.js";

const subjectRouter = Router();

subjectRouter.post(
  "/",
  authentication,
  validation(createSubjectSchema),
  createSubject,
);

export default subjectRouter;
