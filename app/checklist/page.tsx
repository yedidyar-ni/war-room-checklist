'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useWarRoom } from '@/contexts/WarRoomContext'
import { sendSlackMessage } from '@/utils/slack'

export default function Checklist() {
  const router = useRouter()
  const { description, formattedDescription, logEvent, checklistItems, setChecklistItems, isWarRoomOpen } = useWarRoom()

  useEffect(() => {
    if (!isWarRoomOpen) {
      router.push('/')
    }
  }, [isWarRoomOpen, router])

  useEffect(() => {
    if (checklistItems.length === 0) {
      setChecklistItems([
        {
          id: '1',
          title: 'Determine if a war room is needed',
          checked: false,
          expanded: false,
          content: (
            <p className="mt-2 text-sm text-gray-600">
              A war room should be opened when there's a critical issue affecting multiple users or core functionality of the system.
            </p>
          ),
        },
        {
          id: '2',
          title: 'Notify A manager',
          checked: false,
          expanded: false,
          content: (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li>Notify Team Lead for low-severity issues.</li>
              <li>Notify Group Lead - pager duty 1800132213311</li>
            </ul>
          ),
        },
        {
          id: '3',
          title: 'Start a Zoom',
          checked: false,
          expanded: false,
          content: (
            <Button
              className="mt-2 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                sendSlackMessage('prod-issues', `A new war room is opened, with ${description}, we will update after we assess the issue`)
                logEvent(`Notified Issue In Prod Room: ${description}`)
              }}
            >
              Notify Issue In Prod Room
            </Button>
          ),
        },
        {
          id: '4',
          title: 'Fast deploy to Resolve issue - if needed',
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-2">
              <Link href="#" className="text-blue-600 hover:underline block">Jenkins Build 1</Link>
              <Link href="#" className="text-blue-600 hover:underline block">Jenkins Build 2</Link>
              <Link href="#" className="text-blue-600 hover:underline block">Jenkins Build 3</Link>
            </div>
          ),
        },
        {
          id: '5',
          title: 'Post Update messages to channels',
          checked: false,
          expanded: false,
          content: (
            <div className="mt-2 space-y-2">
              <textarea className="w-full p-2 border rounded" rows={3} placeholder="Enter update message"></textarea>
              <div className="flex space-x-2">
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                  sendSlackMessage('war-room', 'Update message')
                  logEvent('Published update to War Room')
                }}>Publish to War Room</Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                  sendSlackMessage('a-team', 'Update message')
                  logEvent('Updated A-Team Channel')
                }}>A-Team Update Channel</Button>
              </div>
            </div>
          ),
        },
      ])
    }
  }, [checklistItems.length, setChecklistItems, description, logEvent])

  const handleCheck = (id: string) => {
    setChecklistItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked, expanded: false } : item
    ))
    const item = checklistItems.find(item => item.id === id)
    if (item) {
      logEvent(`${item.checked ? 'Unchecked' : 'Checked'} item: ${item.title}`)
    }
  }

  const handleExpand = (id: string) => {
    setChecklistItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ))
  }

  const handleCloseWarRoom = async () => {
    await sendSlackMessage('war-room-channel', 'War room closed')
    logEvent('War room closed')
    router.push('/logger')
  }

  const allChecked = checklistItems.every(item => item.checked)

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">War Room: {decodeURIComponent(formattedDescription)}</h1>
      <div className="space-y-4">
        {checklistItems.map(item => (
          <div key={item.id} className={`border p-4 rounded ${item.checked ? 'bg-gray-100' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => handleCheck(item.id)}
                  disabled={item.checked}
                />
                <span className={item.checked ? 'line-through' : ''}>{item.title}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExpand(item.id)}
                disabled={item.checked}
              >
                {item.expanded ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
            {item.expanded && <div className="mt-2">{item.content}</div>}
          </div>
        ))}
      </div>
      {allChecked && (
        <div className="mt-8">
          <Button onClick={handleCloseWarRoom} className="bg-green-500 hover:bg-green-600 text-white">
            Close War Room
          </Button>
          <p className="mt-2 text-sm text-gray-600">
            Move to the logger page and copy the logged process and start writing the retro
          </p>
        </div>
      )}
      <div className="fixed bottom-8 right-8">
        <Link href="/logger">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Go to Logger</Button>
        </Link>
      </div>
    </main>
  )
}

