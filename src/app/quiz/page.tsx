import React from 'react'

import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import QuizCreation from '@/components/quiz-creation';

interface Props {
    searchParams: {
      topic?: string;
    };
  }

export const metadata = {
    title: "Quiz | Quizmify",
    description: "Quiz yourself on anything!",
}


const Quiz = async ({ searchParams }: Props) => {
    const session = await getAuthSession();
    if(!session) {
       return redirect("/");
    }
  return (
    <div><QuizCreation topic={searchParams.topic ?? ""}/></div>
  )
}

export default Quiz;