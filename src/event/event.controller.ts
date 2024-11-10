import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-access.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserService } from '../user/user.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  @Get('admin/:id')
  async getEventsByThreadId(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return {
        success: false,
      };
    }
    const email = user.email;
    const logs = await this.eventService.getEventLogs(email);
    return {
      success: true,
      logs: logs,
    };
    // return
  }

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
