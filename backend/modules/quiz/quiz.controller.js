import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { generateQuizResponse } from "../../services/aiResponse.js";
import HttpException from './../../utils/HttpException.js';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createRequire } from 'module';
import Quiz from "../../DB/models/quiz.model.js";

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const officeParser = require('officeparser');

export const generateQuizController = asyncHandler(async (req, res, next) => {

// console.log("--- DEBUGGING START ---");
// console.log("req.body content:", req.body);
// console.log("req.file content:", req.file);
// console.log("--- DEBUGGING END ---");

    if (!req.file) {
        throw new HttpException("please upload a file (PDF أو PPTX)", 400);
    }

    let extractedText = "";
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    if (fileExtension === "pdf") {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text;

    }
    else if (fileExtension === "pptx") {
    const tempPath = join(tmpdir(), `pptx_${Date.now()}.pptx`);
    writeFileSync(tempPath, req.file.buffer);
    try {
        const result = await new Promise((resolve, reject) => {
            officeParser.parseOffice(tempPath, (data, err) => {
                if (err) return reject(new Error(err));
                resolve(data);
            });
        });
        extractedText = result.toText(); // ← just add this
    } finally {
        unlinkSync(tempPath);
    }
} else {
        throw new HttpException("File format not supported! Only PDF and PPTX files are allowed", 400);
    }

    // console.log("--- START OF TEXT ---");
    // console.log(extractedText);
    // console.log("--- END OF TEXT, LENGTH:", extractedText.length);

    const { numberOfQuestions, questionType, difficultyLevel, timeOption, userDuration } = req.body;

    const quizData = await generateQuizResponse({
        pdfText: extractedText,
        questionType,
        difficultyLevel,
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        timeOption,
    });


    const quiz = await Quiz.create({
        userId: req.user._id,
        quizTitle: quizData.quizTitle,
        difficultyLevel,
        questionType,
        durationMinutes: userDuration || quizData.durationMinutes,
        numberOfQuestions: numberOfQuestions,
        questions: quizData.questions
    }); 

    res.status(200).json({
        success: true,
        message: "Quiz generated successfully",
        data: quizData
    });
});


export const getAllQuizzes = asyncHandler(async (req, res, next) => {
    const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        message: "Quizzes retrieved successfully",
        data: quizzes
    });
});


export const getQuizById = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findOne({ _id: req.params.quizId, userId: req.user._id });
    if (!quiz) {
        throw new HttpException("Quiz not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Quiz retrieved successfully",
        data: quiz
    });
});

export const deleteQuizById = asyncHandler(async (req, res, next) => {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.quizId, userId: req.user._id });
    if (!quiz) {
        throw new HttpException("Quiz not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Quiz deleted successfully",
    });
});


export const submitQuiz = asyncHandler(async (req, res, next) => { 

    const { quizId } = req.params;

    const { userAnswers, score, percentage, completedAt } = req.body;
    const quiz = await Quiz.findOne({ _id: quizId, userId: req.user._id });
    if (!quiz) {
        throw new HttpException("Quiz not found", 404);
    }
    if (quiz.status === "completed") {
        return res.status(400).json({
            success: false,
            message: "Quiz has already been submitted",
        });
    }
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.percentage = percentage;
    quiz.status = "completed";
    quiz.completedAt = completedAt;
    await quiz.save();

    res.status(200).json({
        success: true,
        message: "Quiz submitted successfully",
        data: quiz
    }); 
});