import { Injectable } from '@nestjs/common';
import { compileComponent } from '../scripts/compile-component';
import { compileServices, getServiceList } from '../scripts/compile-service';

@Injectable()
export class AppService {
  public getCompiledComponent(path: string) {
    return compileComponent(path);
  }

  public getCompiledServices() {
    return compileServices();
  }

  public getServiceList() {
    return getServiceList();
  }
}
