import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('/memory-view')
  @UseGuards(JwtAuthGuard)
  async createMemoryViewEventLog(@CurrentUser() userId: string, @Body() body) {
    const { type } = body;
    const event = await this.eventService.createMemoryEventLog({
      eventType: 'Watch',
      agentType: type,
      userId,
    });
    console.log('event', event);

    if (event) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  }
}
