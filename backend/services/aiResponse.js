import Groq from "groq-sdk"
import { scheduleSystemPrompt } from "../utils/systemPrompts/systemPrompts.js"
import HttpException from "../utils/HttpException.js"
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})
export const generateAIScheduleResponse=async(userPreferences,subjects,weeklyDescription)=>{
    try{
    
        const response=await groq.chat.completions.create({
            model:'meta-llama/llama-4-scout-17b-16e-instruct',
            max_tokens:2000,
            messages:[{
            role:'system',
            content:scheduleSystemPrompt
        },
            {
                role:'user',
                content:`
                Generate an optimized weekly study schedule using the following data.

                IMPORTANT:
                - Always return valid JSON
                - Never return empty schedule arrays
                - Always generate tasks + sessions even if data is incomplete
                USER DATA:
                ${JSON.stringify(
              { userPreferences, subjects, weeklyDescription })}  `,    
            }
        ],
                 response_format: {
                type: "json_schema",
                json_schema: {
                name: "schedule_schema",
                strict: false,
            schema: {
            type: "object",
            additionalProperties: false,
            properties: {
            tasks: {
            type: "array",
            minItems: 1,
                items: {
                type: "object",
                additionalProperties: false,
                properties: {
                 subjectId: { type: "string" },
                title: { type: "string" },
                totalHours: { type: "number" },
                priority: {
                type: "string",
                enum: ["low", "medium", "high"]
                 },
                dueDate: { type: "string",format:"date-time" },
                status: { type: "string", enum: ["ongoing"] },
                hoursSpent: { type: "number" }
            },
            required: [
              "subjectId",
              "title",
              "totalHours",
              "priority",
              "dueDate",
              "status",
              "hoursSpent"
            ]
          }
        },

        schedule: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "string" },
              sessions: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    subjectId: { type: "string" },
                    startTime: { type: "string",format:"date-time" },
                    endTime: { type: "string",format:'date-time'},
                    status: {
                      type: "string",
                      enum: ["scheduled"]
                    },
                    reason: { type: "string" }
                  },
                  required: [
                    "subjectId",
                    "startTime",
                    "endTime",
                    "status",
                    "reason"
                  ]
                }
              }
            },
            required: ["day", "sessions"]
          }
        },
        reasonForThisSummary: { type: "string" },
      },
      
      
      required: ["tasks", "schedule","reasonForThisSummary"]
    }
    
  },
}})
   const content=response.choices[0].message.content
   console.log(content)
  if (!content) {
      throw new HttpException("Error While Generating Response",500);
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
     
      throw new HttpException("Parsing JSON Error",500)
    }

    // console.log("AI Response Generated Successfully");
    return parsed;
}
catch(err){
     console.log(err.error)
     console.log(err.message)
    throw new HttpException("Error Sending Response",500)
}
}