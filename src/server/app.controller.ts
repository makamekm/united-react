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
  component(@Query('path') path) {
    return this.appService.getCompiledComponent(path);
  }

  @Get('services')
  service() {
    return this.appService.getCompiledServices();
  }
}
