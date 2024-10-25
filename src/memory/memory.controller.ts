import {
  Controller,
  Delete,
  Get,
  Param,
  Response,
  UseGuards,
} from '@nestjs/common';
import { MemoryService } from './memory.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';

@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

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
  async deleteMemory(@Param('memoryId') memoryId: string, @Response() res) {
    const memories = await this.memoryService.deleteMemory(memoryId);
    return res.json({
      success: true,
      memories: memories,
    });
  }
}
