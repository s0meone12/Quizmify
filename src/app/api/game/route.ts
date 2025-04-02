import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";



export async function POST(req :Request, res: Response) {
  try {
    const session = await getAuthSession();
    if(!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        {
          status: 401,
        }
      )
    }

    const body = await req.json();
    const {amount, topic, type } = quizCreationSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic
      }
    })

    console.log("Request Body:", body);

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type
    })
    console.log("Received Questions Data:", JSON.stringify(data, null, 2));
    if(type === "mcq") {
      type mcqQuestions = {
        question: string,
        answer: string,
        options: string[];
      }
      const manyData = data.questions.map((question: mcqQuestions) => {
        if (!question.options || question.options.length !== 4) {
          throw new Error("Invalid MCQ response format: Missing options.");
        }
      
        return {
          question: question.question,
          answer: question.answer,
          options: question.options,
          gameId: game.id,
          questionType: "mcq"
        };
      });

      await prisma.question.createMany({
        data: manyData
      })
    } else if(type === "open_ended"){
      type openQuestion = {
        question: string,
        answer: string,
      };

      await prisma.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          };
        }),
      });
    }
    return NextResponse.json(
      { 
        gameId: game.id 
      }, 
      { 
        status: 200 
      });

  } catch (error) {
    if(error instanceof ZodError) {
      return NextResponse.json({error: error.issues}, { status: 400 });
    }
    return NextResponse.json({
      error: "Something went wrong",
    }, { status: 500 })
  }
}