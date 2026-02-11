import OpenAI from 'openai';

import { env } from '../../config/env';

export const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  dangerouslyAllowBrowser: true, // MVP - frontend direct calls
});
