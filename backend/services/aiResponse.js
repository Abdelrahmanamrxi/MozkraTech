import Groq from "groq-sdk"
import { scheduleSystemPrompt,generateAvailableSessionsPrompt, quizSystemPrompt } from "../utils/systemPrompts/systemPrompts.js"
import HttpException from "../utils/HttpException.js"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const generateAISessionResponse = async (userId, userPreferences, subjects, weeklyDescription) => {
  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: scheduleSystemPrompt,
        },
        {
          role: "user",
          content: `
            Generate an optimized weekly study schedule using the following data.

            IMPORTANT:
            - Always return valid JSON
            - Never return empty arrays
            - Always generate tasks + sessions even if data is incomplete
            - Use this exact userId for all tasks and sessions: "${userId}"

            USER DATA:
            ${JSON.stringify({ userPreferences, subjects, weeklyDescription })}
          `,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "schedule_schema",
          strict: false,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["tasks", "sessions", "reasonForThisSummary"],
            properties: {

              tasks: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    userId:     { type: "string" },
                    subjectId:  { type: "string" },
                    name:       { type: "string" },
                    totalHours: { type: "number" },
                    priority:   { type: "string", enum: ["low", "medium", "high"] },
                    dueDate:    { type: "string", format: "date-time" },
                    status:     { type: "string", enum: ["ongoing"] },
                    hoursSpent: { type: "number" },
                  },
                  required: [
                    "userId",
                    "subjectId",
                    "name",
                    "totalHours",
                    "priority",
                    "dueDate",
                    "status",
                    "hoursSpent",
                  ],
                },
              },

              sessions: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    userId:    { type: "string" },
                    subjectId: { type: "string" },
                    name:      { type: "string" },
                    startTime: { type: "string", format: "date-time" },
                    endTime:   { type: "string", format: "date-time" },
                    status:    { type: "string", enum: ["scheduled", "completed", "missed", "cancelled"] },
                  },
                  required: [
                    "userId",
                    "subjectId",
                    "name",
                    "startTime",
                    "endTime",
                    "status",
                  ],
                },
              },

              reasonForThisSummary: { type: "string" },
            },
          },
        },
      },
    })

    const content = response.choices[0].message.content
    console.log(content)

    if (!content) {
      throw new HttpException("Error While Generating Response", 500)
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (err) {
      throw new HttpException("Parsing JSON Error", 500)
    }

    return parsed
  } catch (err) {
    console.log(err.error)
    console.log(err.message)
    throw new HttpException("Error Sending Response", 500)
  }
}
export const generateAvailableSessions = async ({
  existingSessions,
  dueDate,
  totalHours,
  studyHours,
  subjectId,
  name,
  currentDateTime,
  freeDays,
  timeRange,
}) => {
  const MAX_RETRIES = 3;

  function validateSessions(sessions) {
    const violations = [];

    // check total hours
    const total = sessions.reduce((sum, s) => {
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    if (Math.abs(total - totalHours) > 0.1) {
      violations.push(`Total hours is ${total.toFixed(2)} but must be exactly ${totalHours}`);
    }

    // check daily limit
    const dayMap = {};
    for (const s of sessions) {
      const day = s.startTime.slice(0, 10);
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      const hours = (end - start) / (1000 * 60 * 60);
      dayMap[day] = (dayMap[day] || 0) + hours;
    }
    for (const [day, hours] of Object.entries(dayMap)) {
      if (hours > studyHours + 0.1) {
        violations.push(`Day ${day} has ${hours.toFixed(2)}h which exceeds studyHours limit of ${studyHours}h`);
      }
    }

    // check all sessions are after currentDateTime
    for (const s of sessions) {
      if (new Date(s.startTime) <= new Date(currentDateTime)) {
        violations.push(`Session ${s.startTime} starts before or at currentDateTime ${currentDateTime}`);
      }
    }

    // check all sessions end before dueDate
    for (const s of sessions) {
      if (new Date(s.endTime) >= new Date(dueDate)) {
        violations.push(`Session ending ${s.endTime} goes beyond dueDate ${dueDate}`);
      }
    }

    return violations;
  }

  function buildViolationHint(violations) {
    return `\n\nPREVIOUS ATTEMPT VIOLATIONS — fix ALL of these:\n${violations.map((v) => `- ${v}`).join("\n")}`;
  }

  async function callGroq(violationHint = "") {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 5000,
      messages: [
        {
          role: "system",
          content: generateAvailableSessionsPrompt,
        },
        {
          role: "user",
          content: `
Generate an optimized study schedule.

CURRENT TIME: ${currentDateTime}
DEADLINE: ${dueDate}
TOTAL HOURS TO SCHEDULE: ${totalHours}
MAX HOURS PER DAY: ${studyHours}
ALLOWED DAYS: ${JSON.stringify(freeDays)}
TIME WINDOW: ${JSON.stringify(timeRange)}

BLOCKED SLOTS:
${existingSessions.map((s) => `- ${s.startTime} → ${s.endTime}`).join("\n") || "none"}

SUBJECT:
${JSON.stringify({ subjectId, name })}

HOUR SPLIT REMINDER:
- If ${totalHours} <= ${studyHours}: generate ONE session of exactly ${totalHours}h
- If ${totalHours} > ${studyHours}: split across days, each day max ${studyHours}h, total must equal ${totalHours}h exactly
${violationHint}
          `,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "session_schema",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["sessions", "reasonForResponse"],
            properties: {
              sessions: {
                type: "array",
                minItems: 0,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["subjectId", "name", "startTime", "endTime"],
                  properties: {
                    subjectId: { type: "string" },
                    name: { type: "string" },
                    startTime: { type: "string", format: "date-time" },
                    endTime: { type: "string", format: "date-time" },
                  },
                },
              },
              reasonForResponse: { type: "string" },
            },
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new HttpException("Error While Generating Sessions", 500);

    try {
      return JSON.parse(content);
    } catch {
      throw new HttpException("Parsing JSON Error", 500);
    }
  }

  try {
    let parsed;
    let violationHint = "";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      parsed = await callGroq(violationHint);

      const violations = validateSessions(parsed.sessions);
      console.log(`Attempt ${attempt}: ${violations.length} violation(s)`, violations);

      if (violations.length === 0) return parsed;

      violationHint = buildViolationHint(violations);
    }

    // deterministic fix — force total hours to match exactly
    console.warn("All retries failed, applying deterministic fix");

    const fixedSessions = [];
    let remaining = totalHours;

    for (const s of parsed.sessions) {
      if (remaining <= 0) break;
      const start = new Date(s.startTime);
      const end = new Date(s.endTime);
      const duration = (end - start) / (1000 * 60 * 60);
      const allowed = Math.min(duration, remaining, studyHours);
      const fixedEnd = new Date(start.getTime() + allowed * 60 * 60 * 1000);
      fixedSessions.push({
        ...s,
        endTime: fixedEnd.toISOString(),
      });
      remaining -= allowed;
    }

    parsed.sessions = fixedSessions;
    return parsed;

  } catch (err) {
    console.error(err.message);
    throw new HttpException(err.message || "Error Sending Response", 500);
  }
};

export const generateQuizResponse = async ({
  pdfText,
  numberOfQuestions,
  questionType,
  difficulty,
  timeOption,
  userDuration
}) => {
  try {

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 5000,
      messages: [
        {
          role: "system",
          content: quizSystemPrompt
        },
        {
          role: "user",
          content: `
            Generate an optimized academic quiz using the following data.

            IMPORTANT:
            - Always return valid JSON matching the schema exactly.
            - If questionType is "Mixed", you MUST split the quiz evenly between MCQ and True_False questions.
            - If questionType is "True_False", the options array MUST strictly be ["True", "False"].

            PARAMETERS:
            - questionType: "${questionType}"
            - difficulty: "${difficulty}"
            - numberOfQuestions: ${numberOfQuestions}
            - timeOption: "${timeOption}"
            - userDuration: ${userDuration ? userDuration : 0}

            SOURCE TEXT FROM PDF:
            \"\"\"
            ${pdfText}
            \"\"\"
          `,
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "quiz_generation_schema",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["quizTitle", "durationMinutes", "questions"],
            properties: {
              quizTitle: {
                type: "string",
                description: "A suitable title for the quiz based on the PDF content."
              },
              durationMinutes: {
                type: "number",
                description: "The final approved exam duration. Absolute maximum is 60."
              },
              questions: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["questionNumber", "questionText", "options", "correctAnswer", "correctAnswerIndex", "explanation"],
                  properties: {
                    questionNumber: { type: "number" },
                    questionText: { type: "string" },
                    options: {
                      type: "array",
                      minItems: 2, 
                      maxItems: 4,
                      items: { type: "string" }
                    },
                    correctAnswer: {
                      type: "string",
                      description: "Must match exactly one of the strings inside the options array."
                    },
                    correctAnswerIndex: {
                      type: "number",
                      description: "The exact zero-based index of the correct answer inside the options array. For example: if correctAnswer matches options[0], this MUST be 0. If it matches options[1], this MUST be 1, and so on."
                    },
                    explanation: {
                      type: "string",
                      description: "Brief explanation of why this answer is correct based on the text."
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    const content = response.choices[0].message.content;
  /*   console.log("AI Raw Content:", content); */

    if (!content) {
      throw new HttpException("Error While Generating Quiz Response", 500);
    }

    let parsedQuiz;
    try {
      parsedQuiz = JSON.parse(content);
    } catch (err) {
      throw new HttpException("Parsing Quiz JSON Error", 500);
    }

    return parsedQuiz;
  
  }
  catch (err) {
    throw new HttpException(err, 500);
  }
}