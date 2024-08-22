import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"

interface AudioRecorderProps {
  isRecording: boolean
  onStart: () => void
  onStop: (audioBlob: Blob) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ isRecording, onStart, onStop }) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data])
        }
      }
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        onStop(audioBlob)
        setAudioChunks([])
      }
      mediaRecorder.current.start()
      onStart()
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div>
      {!isRecording ? (
        <Button onClick={startRecording}>Start Recording</Button>
      ) : (
        <Button onClick={stopRecording} variant="destructive">Stop Recording</Button>
      )}
    </div>
  )
}

export default AudioRecorder