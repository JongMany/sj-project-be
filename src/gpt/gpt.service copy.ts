// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import OpenAI from 'openai';

// // https://blog.kooky-ai.com/g-18506
// // https://velog.io/@d159123/Nest.js-ChatGPT-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
// // https://www.developerfastlane.com/blog/2023/11/09/creating-ai-assistant-with-openai-assistants-api
// //https://stephenwalther.com/build-an-openai-assistant-app-with-nodejs-in-less-than-15-minutes/
// const ASSISTANT_NAME = 'FUNNYMAN';

// @Injectable()
// export class GptService {
//   private readonly openAiApi: OpenAI;
//   private readonly logger = new Logger(GptService.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private jwtService: JwtService,
//   ) {
//     const configuration = {
//       // organization: this.configService.get<string>('CHAT_GPT_ORGANIZATION_ID'),
//       apiKey: this.configService.get<string>('gpt.apiKey'),
//     };
//     this.openAiApi = new OpenAI(configuration);
//   }

//   // 질문
//   async getAssistantResponse(recognizedText: string) {
//     try {
//       // const assistant = await this.openAiApi.beta.assistants.retrieve(
//       //   process.env.GPTSKEY1,
//       // );
//       const assistants = await this.openAiApi.beta.assistants.list();
//       let assistant = assistants.data.find(
//         (assistant) => assistant.name === ASSISTANT_NAME,
//       );

//       if (!assistant) {
//         assistant = await this.openAiApi.beta.assistants.create({
//           name: ASSISTANT_NAME,
//           instructions:
//             'You are a helpful assistant who is obsessed with Barbie movies.',

//           model: 'gpt-4-turbo-preview',
//         });
//       }

//       // Create a new thread
//       const thread = await this.openAiApi.beta.threads.create();

//       await this.openAiApi.beta.threads.messages.create(thread.id, {
//         role: 'user',
//         content: recognizedText,
//       });

//       const run = await this.openAiApi.beta.threads.runs.create(thread.id, {
//         assistant_id: assistant.id,
//         instructions: '',
//       });

//       await this.checkRunStatus(thread.id, run.id);

//       const message = await this.openAiApi.beta.threads.messages.list(
//         thread.id,
//       );

//       // const contents = message.body.data[0].content[0].text.value; // GPTs가 제공한 답변

//       // TODO: 이걸 중간에 저장해야 함...!

//       // return contents;
//     } catch (error) {
//       this.logger.error('Error during OpenAI API call', error);
//       throw new Error('Failed to retrieve assistant response');
//     }
//   }

//   private async checkRunStatus(threadId: string, runId: string) {
//     let run = await this.openAiApi.beta.threads.runs.retrieve(threadId, runId);

//     while (run.status !== 'completed') {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second wait
//       run = await this.openAiApi.beta.threads.runs.retrieve(threadId, runId);
//     }
//   }
// }
