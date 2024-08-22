import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatDisplayProps {
  messages: Message[]
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  return (
    <Card>
      <CardContent>
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ChatDisplay