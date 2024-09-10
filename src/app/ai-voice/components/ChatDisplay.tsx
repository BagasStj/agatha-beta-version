import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from 'ai'

interface ChatDisplayProps {
  messages: Message[]
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  return (
    <Card className="h-[400px]">
      <CardContent className="p-0">
        <ScrollArea className="h-full p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ChatDisplay