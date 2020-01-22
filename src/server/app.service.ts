import { Injectable } from '@nestjs/common';
import { compileComponent } from '../scripts/compile-component';

@Injectable()
export class AppService {
  public getCompiledComponent(path: string) {
    return compileComponent(path);
  }
}
