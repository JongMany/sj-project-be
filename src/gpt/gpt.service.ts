import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import OpenAI from 'openai';
import { AssistantType, CreateThreadDto } from './dto/create-thread.dto';
import { ThreadEntity } from 'src/gpt/entities/thread.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

// https://blog.kooky-ai.com/g-18506
// https://velog.io/@d159123/Nest.js-ChatGPT-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
// https://www.developerfastlane.com/blog/2023/11/09/creating-ai-assistant-with-openai-assistants-api
//https://stephenwalther.com/build-an-openai-assistant-app-with-nodejs-in-less-than-15-minutes/
// const ASSISTANT_NAME = 'FUNNYMAN';

@Injectable()
export class GptService {
  private readonly openAiApi: OpenAI;
  private readonly logger = new Logger(GptService.name);
  private readonly ASSISTANT_ID_MAP: Record<AssistantType, string>;
  pollingIntervalId: NodeJS.Timeout;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    const configuration = {
      // organization: this.configService.get<string>('CHAT_GPT_ORGANIZATION_ID'),
      apiKey: this.configService.get<string>('gpt.apiKey'),
    };
    this.openAiApi = new OpenAI(configuration);
    this.ASSISTANT_ID_MAP = {
      Funny: this.configService.get<string>('gpt.funnyAssistantId'),
      Feedback: this.configService.get<string>('gpt.feedbackAssistantId'),
      Kind: this.configService.get<string>('gpt.kindAssistantId'),
      Default: this.configService.get<string>('gpt.defaultAssistantId'),
    };
  }

  async createThread(createThreadDto: CreateThreadDto) {
    const thread = await this.openAiApi.beta.threads.create();
    const user = await this.userRepository.findOne({
      where: { email: createThreadDto.email },
    });

    if (thread.id) {
      const type = createThreadDto.type;
      this.threadRepository.save({
        user,
        threadId: thread.id,
        type,
      });
    }
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
    console.log('Adding a message Result', response);

    return response;
  }

  async getMessages(threadId: string) {
    const messages = await this.openAiApi.beta.threads.messages.list(threadId);
    return messages;
  }

  async runAssistant(threadId: string, type: AssistantType) {
    console.log('Running assistant for thread' + threadId);
    const response = await this.openAiApi.beta.threads.runs.create(threadId, {
      assistant_id: this.ASSISTANT_ID_MAP[type],
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
      console.log('messagesList', messagesList);

      messagesList.data.forEach((message) => {
        messages.push(message.content);
      });

      return messages;
    } else {
      return null;
    }
  }

  async getThreads(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['threads'],
    });
    return user.threads.map((thread) => ({
      threadId: thread.threadId,
      type: thread.type,
    }));
  }

  async findThreadIdByType(assistantType: AssistantType, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['threads'],
    });

    const thread = user.threads.find((thread) => thread.type === assistantType);
    return thread?.threadId || '';
  }
}
