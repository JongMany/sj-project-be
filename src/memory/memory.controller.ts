import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemoryService } from './memory.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';
import { EditMemoryDto } from 'src/memory/dto/edit-memory.dto';
import { EventService } from 'src/event/event.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('memory')
export class MemoryController {
  constructor(
    private readonly memoryService: MemoryService,
    private readonly eventService: EventService,
  ) {}

  @Get('/:threadId')
  @UseGuards(JwtAuthGuard)
  async getMemories(@Param('threadId') threadId: string, @Response() res) {
    const memories = await this.memoryService.getMemoriesByThreadId(threadId);
    return res.json({
      memories: memories,
      success: true,
    });
  }

  @Delete('/:memoryId')
  @UseGuards(JwtAuthGuard)
  async deleteMemory(
    @CurrentUser() userId,
    @Param('memoryId') memoryId: string,
    @Response() res,
  ) {
    const { memories, threadType } =
      await this.memoryService.deleteMemory(memoryId);
    console.log('memories', memories, threadType);

    if (threadType) {
      await this.eventService.createMemoryEventLog({
        eventType: 'Delete',
        agentType: threadType,
        userId,
      });
      return res.json({
        success: true,
        memories: memories,
      });
    }
  }

  @Put('/:memoryId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async updateMemory(
    @CurrentUser() userId,
    @Param('memoryId') memoryId: string,
    @Body() @Response() editMemoryDto: EditMemoryDto,
    @Res() res,
  ) {
    console.log('editMemoryDto', editMemoryDto);
    const memory = await this.memoryService.updateMemory(
      memoryId,
      editMemoryDto.description,
    );
    if (memory) {
      await this.eventService.createMemoryEventLog({
        eventType: 'Edit',
        agentType: editMemoryDto.type,
        userId: userId,
      });

      return res.json({
        success: true,
        description: memory.description,
        id: memory.id,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  }
}
