import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get('ping')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test(): Promise<string> {
    return await this.appService.test();
  }
}
