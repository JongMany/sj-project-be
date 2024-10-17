// app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('gpt', () => ({
  apiKey: process.env.GPT_API_KEY,
  organization: process.env.CHAT_GPT_ORGANIZATION_ID,
  // ASSISTANT_ID
  feedbackAssistantId: process.env.FEEDBACK_MAN_ASSISTANT_ID,
  funnyAssistantId: process.env.FUNNY_MAN_ASSISTANT_ID,
  kindAssistantId: process.env.KIND_MAN_ASSISTANT_ID,
  defaultAssistantId: process.env.DEFAULT_MAN_ASSISTANT_ID,
}));
