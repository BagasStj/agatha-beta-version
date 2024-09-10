'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AudioRecorder from '@/app/ai-voice/components/AudioRecorder'
import ChatDisplay from '@/app/ai-voice/components/ChatDisplay'
import { useChat } from 'ai/react'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Message } from 'ai'

export default function AIVoicePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [params, setParams] = useState<any>({
    prompt: "You are an AI assistant. Be concise in your responses.",
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    maxTokens: 150,
    titlePrompt: 'New Chat',
  })

  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      model: params.model,
      temperature: params.temperature,
      prompt: params.prompt,
      topP: params.topP,
      presencePenalty: params.presencePenalty,
      frequencyPenalty: params.frequencyPenalty,
      maxTokens: params.maxTokens,
      userId: user?.id,
      username: user?.username,
      traceId: uuidv4(),
    },
    onFinish: async (message) => {
      setChatHistory(prev => prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, message], title: chat.messages[0].content.slice(0, 30) }
          : chat
      ));
      saveChat([...messages, message]);
      await playTextToSpeech(message.content);
    },
    onError: (error) => {
      console.error('Error from chat API:', error);
      handleApiError(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await originalHandleSubmit(e);
    } catch (error: any) {
      console.error('Error submitting chat:', error);
      handleApiError(error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true)
    setTranscript('') // Clear previous transcript
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    if (transcript.trim()) {
      handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>);
      await handleSubmit(new Event('submit') as any);
    }
  }

  const handleTranscriptUpdate = (newTranscript: string) => {
    setTranscript(newTranscript)
  }

  const saveChat = async (newMessages: any) => {
    // Implement your saveChat logic here
    console.log('Saving chat:', newMessages);
  };

  const handleApiError = (error: Error) => {
    console.error('API Error:', error);
    toast({
      title: "Error",
      description: "An error occurred while processing your request.",
      variant: "destructive",
    });
  };

  const playTextToSpeech = async (text: string) => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Error",
        description: "Failed to generate speech.",
        variant: "destructive",
      });
    }
  };

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
            onTranscriptUpdate={handleTranscriptUpdate}
          />
          <Textarea
            value={transcript}
            readOnly
            placeholder="Transcription will appear here..."
            className="mt-4"
          />
        </CardContent>
      </Card>
      <ChatDisplay messages={messages} />
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  )
}