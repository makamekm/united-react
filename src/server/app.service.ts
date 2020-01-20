import { Injectable } from '@nestjs/common';
import { compileComponent } from '../scripts/compile-component';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public test() {
    return compileComponent();
  }
}
