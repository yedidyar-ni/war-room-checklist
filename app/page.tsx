'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWarRoom } from '@/contexts/WarRoomContext'
import { sendSlackMessage } from '@/utils/slack'

export default function Home() {
  const { description, setDescription, logEvent, setIsWarRoomOpen } = useWarRoom()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOpenWarRoom = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsWarRoomOpen(true);
    logEvent(`Opened war room: ${description}`);
    
    // Send message to Slack
    await sendSlackMessage('war-room-channel', `New war room opened: ${description}`);

    // Navigate to checklist page
    router.push('/checklist');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">War Room Checklist</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="War room short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white" 
          onClick={handleOpenWarRoom}
          disabled={isLoading || !description.trim()}
        >
          {isLoading ? 'Opening...' : 'Open War Room'}
        </Button>
      </div>
    </main>
  )
}

