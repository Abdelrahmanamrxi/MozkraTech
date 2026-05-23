import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { generateQuizResponse } from "../../services/aiResponse.js";
import HttpException from './../../utils/HttpException.js';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createRequire } from 'module';

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

    const { numberOfQuestions, questionType, difficulty, timeOption, userDuration } = req.body;

    const quizData = await generateQuizResponse({
        pdfText: extractedText,
        questionType,
        difficulty,
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        timeOption,
        userDuration: userDuration ? parseInt(userDuration, 10) : 0
    });

    res.status(200).json({
        success: true,
        message: "Quiz generated successfully",
        data: quizData
    });
});