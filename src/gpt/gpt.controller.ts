// https://www.youtube.com/watch?v=rlbKpEGWiT0
import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get('/thread')
  async createThread(@Response() res) {
    const thread = await this.gptService.createThread();
    return res.json({
      threadId: thread.id,
    });
  }

  @Post('/message')
  async sendMessage(@Body() body, @Response() res) {
    const { message: userMessage, threadId } = body;
    console.log(userMessage, threadId);
    const message = await this.gptService.addMessage(threadId, userMessage);
    // run assistant
    const run = await this.gptService.runAssistant(threadId);
    const runId = run.id;

    this.gptService.pollingIntervalId = setInterval(async () => {
      // check status
      const response = await this.gptService.checkingStatus(threadId, runId);
      if (response !== null) {
        return res.json({
          messages: response,
        });
      }
    }, 5000);
  }
}
