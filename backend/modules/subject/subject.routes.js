import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getUserSubjects,
} from "./subject.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createSubjectSchema,
  deleteSubjectSchema,
} from "./subject.validation.js";
import { authentication } from "../../middleware/auth.js";

const subjectRouter = Router();

subjectRouter.post(
  "/",
  authentication,
  validation(createSubjectSchema),
  createSubject,
);

subjectRouter.get("/", authentication, getUserSubjects);

subjectRouter.delete(
  "/:subjectId",
  authentication,
  validation(deleteSubjectSchema),
  deleteSubject,
);

export default subjectRouter;
