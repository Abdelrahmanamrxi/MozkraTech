import Groq from "groq-sdk"
import { scheduleSystemPrompt,generateAvailableSessionsPrompt } from "../utils/systemPrompts/systemPrompts.js"
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
  existingSessions,
  convertedDate,
  totalHours,
  studyHours,
  subjectId,
  name
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
          content: `
Generate an optimized weekly study schedule.

USER_DATA:
${JSON.stringify({
  existingSessions,
  convertedDate,
  totalHours,
  studyHours,
  subjectId,
  name
})}
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