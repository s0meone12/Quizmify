import React from 'react'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation';
import DetailsDialog from '@/components/details-dialog';
import QuizMeCard from '@/components/dashboard/quiz-me-card';
import HistoryCard from '@/components/dashboard/history-card';
import HotTopicsCard from '@/components/dashboard/hot-topics-card';
import RecentActivityCard from '@/components/dashboard/recent-activity-card';


export const metadata = {
    title: "Dashboard | Quizmify"
}

const Dashboard = async () => {
    const session = await getAuthSession();

    if(!session?.user){
        return redirect("/")
    }
  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        <DetailsDialog />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  )
}

export default Dashboard