import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import OpenAI from 'openai';

// https://blog.kooky-ai.com/g-18506
// https://velog.io/@d159123/Nest.js-ChatGPT-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
// https://www.developerfastlane.com/blog/2023/11/09/creating-ai-assistant-with-openai-assistants-api
//https://stephenwalther.com/build-an-openai-assistant-app-with-nodejs-in-less-than-15-minutes/
// const ASSISTANT_NAME = 'FUNNYMAN';

const ASSISTANT_ID = 'asst_1ExgDmwmIqos4AT2O1nEKfBS';

@Injectable()
export class GptService {
  private readonly openAiApi: OpenAI;
  private readonly logger = new Logger(GptService.name);
  pollingIntervalId: NodeJS.Timeout;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    const configuration = {
      // organization: this.configService.get<string>('CHAT_GPT_ORGANIZATION_ID'),
      apiKey: this.configService.get<string>('gpt.apiKey'),
    };
    this.openAiApi = new OpenAI(configuration);
  }

  async createThread() {
    console.log('Creating a new thread');
    const thread = await this.openAiApi.beta.threads.create();
    return thread;
  }

  async addMessage(threadId: string, userMessage: string) {
    console.log('Adding a message to the thread', threadId);
    const response = await this.openAiApi.beta.threads.messages.create(
      threadId,
      {
        role: 'user',
        content: userMessage,
      },
    );

    return response;
  }

  async runAssistant(threadId: string) {
    console.log('Running assistant for thread' + threadId);
    const response = await this.openAiApi.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });
    console.log('Assistant response', response);
    return response;
  }

  async checkingStatus(
    threadId: string,
    runId: string,
  ): Promise<OpenAI.Beta.Threads.Messages.MessageContent[][] | null> {
    const runObject = await this.openAiApi.beta.threads.runs.retrieve(
      threadId,
      runId,
    );

    const status = runObject.status;

    console.log('Run Object', runObject);
    console.log('Run status', status);

    if (status === 'completed') {
      clearInterval(this.pollingIntervalId);

      const messagesList =
        await this.openAiApi.beta.threads.messages.list(threadId);
      const messages: OpenAI.Beta.Threads.Messages.MessageContent[][] = [];

      messagesList.data.forEach((message) => {
        messages.push(message.content);
      });

      return messages;
    } else {
      return null;
    }
  }
}
