import React, { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface AudioRecorderProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  onTranscriptUpdate: (transcript: string) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ isRecording, onStart, onStop, onTranscriptUpdate }) => {
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'id';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      onTranscriptUpdate(currentTranscript);
    };

    recognitionRef.current.onend = () => {
      onStop();
    };

    recognitionRef.current.start();
    onStart();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div>
      {!isRecording ? (
        <Button onClick={startRecording}>Start Recording</Button>
      ) : (
        <Button onClick={stopRecording} variant="destructive">Stop Recording</Button>
      )}
    </div>
  );
};

export default AudioRecorder