import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import OpenAI from "openai";
import { AssistantType, CreateThreadDto } from "./dto/create-thread.dto";
import { ThreadEntity } from "src/gpt/entities/thread.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { saveUserProfileTools } from "src/constants/function_calling";
import { MemoryService } from "src/memory/memory.service";

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
    private readonly memoryService: MemoryService,
    @InjectRepository(ThreadEntity)
    private readonly threadRepository: Repository<ThreadEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    const configuration = {
      // organization: this.configService.get<string>('CHAT_GPT_ORGANIZATION_ID'),
      apiKey: this.configService.get<string>("gpt.apiKey")
    };
    this.openAiApi = new OpenAI(configuration);
    this.ASSISTANT_ID_MAP = {
      Funny: this.configService.get<string>("gpt.funnyAssistantId"),
      Feedback: this.configService.get<string>("gpt.feedbackAssistantId"),
      Kind: this.configService.get<string>("gpt.kindAssistantId"),
      Default: this.configService.get<string>("gpt.defaultAssistantId")
    };
  }

  async createThread(createThreadDto: CreateThreadDto) {
    const thread = await this.openAiApi.beta.threads.create({});
    const user = await this.userRepository.findOne({
      where: { email: createThreadDto.email }
    });

    if (thread.id) {
      const type = createThreadDto.type;
      this.threadRepository.save({
        user,
        threadId: thread.id,
        type
      });
    }
    return thread;
  }

  async addMessage(threadId: string, userMessage: string) {
    console.log("Adding a message to the thread", threadId);
    const response = await this.openAiApi.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: userMessage
      }
    );
    console.log("Adding a message Result", response);

    return response;
  }

  async getMessages(threadId: string) {
    const messages = [];
    let afterId = null;
    while (true) {
      const message = await this.openAiApi.beta.threads.messages.list(
        threadId,
        {
          limit: 100,
          after: afterId ?? null
          // order: 'desc',
          // before: beforeId ?? null,
        }
      );
      if (!message.data.length) {
        break;
      }

      messages.push(...message.data);
      afterId = message.data.at(-1)?.id;
    }

    return messages;
  }

  async runAssistant(threadId: string, type: AssistantType, userGroup: "A" | "B" | "C" | "D") {
    console.log("Running assistant for thread" + threadId);
    // TODO: Assistant Additional Instructions을 추가해야함
    const isFnCallingTarget = ["B", "D"].includes(
      userGroup
    );
    const toolChoiceByUserGroup: "auto" | "none" = isFnCallingTarget
      ? "auto"
      : "none";

    const memories = await this.memoryService.getMemoriesByThreadId(threadId);
    const additionalInformation = memories.reduce((acc, cur, index) => {
      return `${acc}\n${index + 1}. ${cur.description}`;
    }, '');
    const response = await this.openAiApi.beta.threads.runs.createAndPoll(
      threadId,
      {
        assistant_id: this.ASSISTANT_ID_MAP[type],
        tool_choice: toolChoiceByUserGroup, // required는 오래 걸림 / auto는 빠름
        tools: [
          {
            type: "function",
            function: saveUserProfileTools
          }
        ],
        additional_instructions:
          `\n 유저가 자신의 정보(한 일, 좋아하는 것, 하고 싶은 일)를 주면 반드시 function_calling(tools)을 호출해서 required_action 상태로 만들어주고, 무조건, 제일 마지막에 유저가 보낸 메시지를 기반으로만 데이터를 수집해줘.
          ${
            isFnCallingTarget &&
            `${`현재 알고 있는 대화 상대의 정보는 다음과 같아. 이게 우선 순위가 더 높아야 해
            ${additionalInformation}`}`
          }
          `
      }
    );
    console.log("Assistant response2", response);
    return response;
  }

  // async handleRequiresAction(
  //   run: OpenAI.Beta.Threads.Runs.Run,
  //   threadId: string,
  // ) {
  //   // Check if there are tools that require outputs
  //   try {
  //     if (
  //       run.required_action &&
  //       run.required_action.submit_tool_outputs &&
  //       run.required_action.submit_tool_outputs.tool_calls
  //     ) {
  //       console.log('Tool outputs required.');
  //       // Loop through each tool in the required action section
  //       const toolOutputs = run.required_action.submit_tool_outputs.tool_calls
  //         .map((tool) => {
  //           console.log('Tool function name : ', tool.function.name);
  //           if (tool.function.name === ' saveUserProfile') {
  //             return {
  //               tool_call_id: tool.id,
  //               output: '57',
  //             };
  //           } else {
  //             console.log('Tool not found');
  //           }
  //         })
  //         .filter((output) => output !== undefined);
  //       console.log('Tool outputs:', toolOutputs);
  //       // Submit all tool outputs at once after collecting them in a list
  //       if (toolOutputs && toolOutputs.length > 0) {
  //         run = await this.openAiApi.beta.threads.runs.submitToolOutputsAndPoll(
  //           threadId,
  //           run.id,
  //           { tool_outputs: toolOutputs },
  //         );
  //         console.log('Tool outputs submitted successfully.', toolOutputs);
  //       } else {
  //         console.log('No tool outputs to submit.');
  //       }

  //       // Check status after submitting tool outputs
  //       return this.checkingStatus(threadId, run.id);
  //     }
  //   } catch (error) {
  //     console.error('Error handling required action:', error);
  //     return this.openAiApi.beta.threads.runs.cancel(threadId, run.id);
  //   }
  // }

  // https://platform.openai.com/docs/assistants/tools/function-calling?context=without-streaming
  async checkingStatus(
    threadId: string,
    runId: string
  ): Promise<{
    messages: OpenAI.Beta.Threads.Messages.MessageContent[][] | null;
    isFunctionCalling: boolean;
  }> {
    let runObject = await this.openAiApi.beta.threads.runs.retrieve(
      threadId,
      runId
    );

    let status = runObject.status;
    console.log("Run status is", status);

    // if (status === 'completed') {
    //   clearInterval(this.pollingIntervalId);

    //   const messagesList =
    //     await this.openAiApi.beta.threads.messages.list(threadId);
    //   const messages: OpenAI.Beta.Threads.Messages.MessageContent[][] = [];
    //   console.log('messagesList', messagesList);

    //   messagesList.data.forEach((message) => {
    //     messages.push(message.content);
    //   });

    //   return messages;
    // } else if (status === 'requires_action') {
    //   console.log(status);
    //   return await this.handleRequiresAction(runObject, threadId);
    // } else {
    //   console.error('Run did not complete:');
    //   return null;
    // }
    // v3
    // if (status === 'completed') {
    //   const messagesList =
    //     await this.openAiApi.beta.threads.messages.list(threadId);
    //   const messages: OpenAI.Beta.Threads.Messages.MessageContent[][] = [];
    //   // console.log('messagesList', messagesList);
    //   console.log('messagesList is shown');

    //   messagesList.data.forEach((message) => {
    //     messages.push(message.content);
    //   });

    //   return messages;
    // }

    // if (status === 'requires_action') {
    //   this.handleRequiresAction(runObject, threadId);
    // }
    // if (['failed', 'cancelled', 'expired'].includes(status)) {
    //   console.log(`Run status is '${status}'`);
    //   return null;
    // }
    let isFunctionCalling = false;

    while (status !== "completed") {
      // await new Promise((resolve) => setTimeout(resolve, 1200));
      runObject = await this.openAiApi.beta.threads.runs.retrieve(
        threadId,
        runId
      );

      status = runObject.status;

      console.log("Run status is", status);
      if (status === "requires_action") {
        // this.handleRequiresAction(runObject, threadId);
        try {
          console.log(runObject.required_action.submit_tool_outputs.tool_calls);
          const toolCalls =
            runObject.required_action.submit_tool_outputs.tool_calls;
          const toolOutputs = await Promise.all(
            toolCalls.map(async (toolCall) => {
              const functionName = toolCall.function.name;
              console.log("functionName", functionName);

              if (functionName === "saveUserProfile") {
                const args = JSON.parse(toolCall.function.arguments);
                // const argsArray = Object.keys(args).map((key) => args[key]);

                // console.log('argsArray', argsArray);
                console.log("args", args);

                const { memoryData, isFunctionCalling: isSaved } = await this.memoryService.createMemory({
                  threadId,
                  memoryData: args
                });
                isFunctionCalling = isSaved;
                return {
                  tool_call_id: toolCall.id,
                  output: memoryData
                  // output: JSON.stringify(args),
                };
              } else {
                return {
                  tool_call_id: toolCall.id,
                  output: null
                };
              }
            })
          );

          console.log("Tool outputs:", toolOutputs);
          await this.openAiApi.beta.threads.runs.submitToolOutputs(
            threadId,
            runId,
            { tool_outputs: toolOutputs }
          );
        } catch (error) {
          // required action이 발생했을 때, 에러가 발생하면 run을 취소하고 종료(취소를 하지 않으면 계속해서 active 상태가 되어, 채팅을 못치게 된다)
          console.log("Error handling required action:", error);
          await this.openAiApi.beta.threads.runs.cancel(threadId, runId);
        }
      }

      if (["failed", "cancelled", "expired"].includes(status)) {
        console.log(`Run status is '${status}'`);
        break;
      }
    }

    const messagesList =
      await this.openAiApi.beta.threads.messages.list(threadId);
    const messages: OpenAI.Beta.Threads.Messages.MessageContent[][] = [];
    console.log("messagesList is shown");

    messagesList.data.forEach((message) => {
      messages.push(message.content);
    });

    return { messages, isFunctionCalling };
  }

  async getThreads(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["threads"]
    });
    return user.threads.map((thread) => ({
      threadId: thread.threadId,
      type: thread.type
    }));
  }

  async findThreadIdByType(assistantType: AssistantType, email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["threads"]
    });

    const thread = user.threads.find((thread) => thread.type === assistantType);
    return thread?.threadId || "";
  }

  async findThreadById(threadId: string) {
    return this.threadRepository.findOne({
      where: { threadId }
    });
  }
}
