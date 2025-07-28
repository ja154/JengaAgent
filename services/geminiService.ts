import { GoogleGenAI, Type } from "@google/genai";
import { PlanStep, PlanStepStatus, AgentMode, AgentPersonality } from "../types";

// Ensure the API key is available, otherwise throw an error.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the structured response we expect from the AI
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.ARRAY,
      description: "A detailed, step-by-step plan to address the user's request. Each step should be a clear action.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: {
            type: Type.STRING,
            description: "A single, clear, and actionable step in the plan.",
          },
        },
        required: ["step"],
      },
    },
    response: {
      type: Type.STRING,
      description: "The final, user-facing response after all plan steps are considered complete. This should be a friendly and helpful message.",
    },
  },
  required: ["plan", "response"],
};

const personalityPrefixes = {
    [AgentPersonality.Friendly]: "You are exceptionally friendly, warm, and encouraging.",
    [AgentPersonality.Formal]: "You maintain a strictly formal, professional, and precise tone.",
    [AgentPersonality.Humorous]: "You have a witty and humorous personality. You enjoy making clever jokes and puns when appropriate.",
};

// System instructions for different agent modes, based on the JengaAgent spec
const systemInstructions = {
  [AgentMode.Productivity]: `You are JengaAgent, an expert productivity copilot. Your purpose is to help users organize, plan, and automate their work.
- Analyze the user's request and break it down into a clear, actionable plan.
- Focus on creating structured, practical outputs like task lists, schedules, email drafts, summaries, or project outlines.
- For requests about creating documents like SOPs or proposals, the plan should outline the sections of the document.
- You must always respond in the provided JSON format. The 'plan' is your series of action items, and 'response' is your final summary or generated content.`,
  
  [AgentMode.Creative]: `You are JengaAgent, an expert creative copilot. Your purpose is to help users brainstorm ideas, generate creative content, and craft prompts for other AI tools (e.g., for image or video generation).
- Analyze the user's creative request and devise a plan for generating the content (e.g., 1. Define theme, 2. Draft hook, 3. Write body, 4. Suggest visuals).
- Focus on generating novel and engaging ideas for social media, branding, storytelling, and artistic prompts.
- When asked for prompts for other tools (like Midjourney), make them detailed and imaginative.
- You must always respond in the provided JSON format. The 'plan' shows your creative process, and 'response' is the final creative output.`,
};


interface AgentResponse {
  plan: PlanStep[];
  response: string;
}

export const sendAgentMessage = async (message: string, mode: AgentMode, personality: AgentPersonality): Promise<AgentResponse> => {
  try {
    const fullSystemInstruction = `${personalityPrefixes[personality]} ${systemInstructions[mode]}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: fullSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const rawText = result.text.trim();
    const parsedJson = JSON.parse(rawText);

    // Validate the parsed structure
    if (!parsedJson.plan || !parsedJson.response) {
      throw new Error("Invalid JSON structure received from AI.");
    }

    const planSteps: PlanStep[] = parsedJson.plan.map((p: { step: string }) => ({
      step: p.step,
      status: PlanStepStatus.Pending,
    }));

    return {
      plan: planSteps,
      response: parsedJson.response,
    };

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the AI's response. The response was not valid JSON.");
    }
    throw new Error(`Failed to get a response from the agent. ${error instanceof Error ? error.message : ''}`);
  }
};