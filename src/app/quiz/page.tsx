import React from 'react'

import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import QuizCreation from '@/components/quiz-creation';


export const metadata = {
    title: "Quiz | Quizmify",
    description: "Quiz yourself on anything!",
}

interface Props {
  searchParams: {
    topic?: string;
  };
}


const Quiz = async ({ searchParams }: Props) => {
    const session = await getAuthSession();
    if(!session) {
       return redirect("/");
    }


  return (
    <QuizCreation topic={searchParams.topic ?? ""} />
  )
}

export default Quiz;