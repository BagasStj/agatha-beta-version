export async function transcribeAudio(audioBlob: Blob): Promise<string> {
    if (audioBlob.size === 0) {
      throw new Error('Audio file is empty');
    }
  
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
  
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }
  
      const data = await response.json();
      return data.transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }