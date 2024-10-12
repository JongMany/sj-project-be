import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { CreateThreadDto } from 'src/gpt/dto/create-thread.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

// https://www.youtube.com/watch?v=rlbKpEGWiT0
//https://dev.to/esponges/build-the-new-openai-assistant-with-function-calling-52f5
// // https://pkgpl.org/2023/11/08/openai-assistants-api%EB%A1%9C-%EB%8C%80%ED%99%94-%EB%82%B4%EC%9A%A9-%EC%A0%80%EC%9E%A5%ED%95%98%EA%B8%B0/
@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('/thread')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createThread(
    @Body() createThreadDto: CreateThreadDto,
    @Response() res,
  ) {
    const thread = await this.gptService.createThread(createThreadDto);
    return res.json({
      threadId: thread.id,
    });
  }

  @Get('/messages/:threadId')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('threadId') threadId: string, @Response() res) {
    const messages = await this.gptService.getMessages(threadId);
    console.log(messages.data);
    return res.json({
      messages: messages.data.reverse(),
      success: true,
    });
  }

  @Get('/threads')
  @UseGuards(JwtAuthGuard)
  async getThreads(@CurrentUser() email: string, @Response() res) {
    const threads = await this.gptService.getThreads(email);

    return res.json({
      threads,
      success: true,
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
      // TODO: Response -> Database
      if (response !== null) {
        return res.json({
          messages: response,
        });
      }
    }, 5000);
  }
}
