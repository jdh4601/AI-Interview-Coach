import { openai } from './client';

export type TtsVoice = 'onyx' | 'echo' | 'nova' | 'alloy';

export function selectVoice(
  gender: 'male' | 'female',
  style: 'friendly' | 'pressure',
): TtsVoice {
  if (gender === 'male') {
    return style === 'friendly' ? 'onyx' : 'echo';
  }
  return style === 'friendly' ? 'nova' : 'alloy';
}

export async function generateTTS(
  text: string,
  voice: TtsVoice,
): Promise<Blob> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
  });

  const arrayBuffer = await response.arrayBuffer();
  return new Blob([arrayBuffer], { type: 'audio/mpeg' });
}
