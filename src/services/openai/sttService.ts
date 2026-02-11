import { openai } from './client';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const file = new File([audioBlob], 'recording.webm', {
    type: audioBlob.type || 'audio/webm',
  });

  const transcription = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file,
    language: 'ko',
  });

  return transcription.text;
}
