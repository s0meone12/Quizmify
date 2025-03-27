import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import axios from "axios";
import { getAuthSession } from "@/lib/nextauth";

const TOGETHER_AI_URL = "https://api.together.ai/v1/completions";
const MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"; // Free Model
const API_KEY = process.env.TOGETHER_AI_KEY; // Secure API Key

// Function to extract JSON from text
const extractJSON = (text: string) => {
  const match = text.match(/\[.*\]|\{.*\}/s); // Match JSON-like arrays or objects
  return match ? match[0] : null;
};

export const POST = async (req: Request) => {
    try {
    const session = await getAuthSession();
    if (!session?.user) {
          return NextResponse.json(
            { error: "You must be logged in to create a game." },
            {
              status: 401,
            }
          );
        }


    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected application/json." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    // Constructing a stricter AI prompt
    const prompt =
      type === "mcq"
        ? `Generate ${amount} multiple-choice questions about ${topic}. Each question should have 4 options and the correct answer.
           Only return a valid JSON array, strictly formatted as:
           [{"question": "...", "answer": "...", "options": ["...", "...", "...", "..."]}]`
        : `Generate ${amount} open-ended questions about ${topic}.
           Only return a valid JSON array, strictly formatted as:
           [{"question": "...", "answer": "..."}]`;

    // Call Together.ai API
    const response = await axios.post(
      TOGETHER_AI_URL,
      {
        model: MODEL,
        prompt,
        max_tokens: 500,
        temperature: 0.7, // Reducing randomness for structured output
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawText = response.data.choices[0]?.text.trim();

    // 🛠️ Extract JSON safely
    const extractedJSON = extractJSON(rawText);
    if (!extractedJSON) {
      throw new Error("AI response did not contain valid JSON.");
    }

    const questions = JSON.parse(extractedJSON);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
};
