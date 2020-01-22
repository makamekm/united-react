import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/compile')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get('ping')
  ping(): string {
    return 'pong';
  }

  @Get('component')
  async component(@Query('path') path): Promise<string> {
    return await this.appService.getCompiledComponent(path);
  }
}
