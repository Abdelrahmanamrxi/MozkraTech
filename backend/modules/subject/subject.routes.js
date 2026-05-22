import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getUserSubjects,
  updateSubject,
} from "./subject.controller.js";
import { validation } from "../../middleware/validation.js";
import {
  createSubjectSchema,
  deleteSubjectSchema,
  updateSubjectSchema,
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

subjectRouter.patch(
  "/:subjectId",
  authentication,
  validation(updateSubjectSchema),
  updateSubject,
);

export default subjectRouter;
