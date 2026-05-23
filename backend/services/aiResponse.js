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
export const generateAvailableSessions = async (
  {

    existingSessions,
    dueDate,
    totalHours,
    studyHours,
    subjectId,
    name,
    currentDateTime,
    freeDays,
    timeRange
  }
) => {
  try {
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: generateAvailableSessionsPrompt
        },
        {
          role: "user",
          content:  `
Generate an optimized study schedule.

IMPORTANT:
- totalHours is the ENTIRE schedule total.
- studyHours is ONLY the MAXIMUM allowed PER DAY.
- The FINAL TOTAL of ALL session durations combined MUST equal exactly ${totalHours} hours.
- Never generate more than ${totalHours} total hours.
- Prefer fewer longer sessions.
- Minimize number of days.

CURRENT TIME:
${currentDateTime}

DEADLINE:
${dueDate}

ALLOWED DAYS:
${JSON.stringify(freeDays)}

TIME WINDOW:
${JSON.stringify(timeRange)}

BLOCKED SLOTS:
${existingSessions
  .map(
    (s) =>
      `- ${s.startTime} → ${s.endTime}`
  )
  .join("\n")}

PARAMETERS:
${JSON.stringify({
  totalHours,
  studyHours,
  subjectId,
  name
})}

VALID EXAMPLE:
If totalHours = 3 and studyHours = 3:
VALID:
- one 3-hour session
- three 1-hour sessions

INVALID:
- 3h Monday + 3h Tuesday = 6h

`
        }
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
                  required: [
                    "subjectId",
                    "name",
                    "startTime",
                    "endTime"
                  ],
                  properties: {
                    subjectId: { type: "string" },
                    name: { type: "string" },
                    startTime: { type: "string", format: "date-time" },
                    endTime: { type: "string", format: "date-time" }
                  }
                }
              },
              reasonForResponse: {
                type: "string"
              }
            }
          }
        }
      }
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new HttpException("Error While Generating Sessions", 500);
    }

    return JSON.parse(content);

  } catch (err) {
    throw new HttpException(err, 500);
  }
};


export const generateQuizResponse = async (
  pdfText,
  numberOfQuestions,
  questionType,
  difficulty,
  timeOption,
  userDuration
) => {
  try {

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 2000,
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
                  required: ["questionNumber", "questionText", "options", "correctAnswer", "explanation"],
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
    console.log("AI Raw Content:", content);

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