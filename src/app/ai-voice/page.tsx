'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AudioRecorder from '@/app/ai-voice/components/AudioRecorder'
import ChatDisplay from '@/app/ai-voice/components/ChatDisplay'
import { pipeline } from '@xenova/transformers'

export default function AIVoicePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = async (audioBlob: any) => {
    setIsRecording(false)
    
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Voice Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <AudioRecorder
            isRecording={isRecording}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
          <Textarea
            value={transcript}
            readOnly
            placeholder="Transcription will appear here..."
            className="mt-4"
          />
        </CardContent>
      </Card>
      <ChatDisplay messages={chatHistory} />
    </div>
  )
}

