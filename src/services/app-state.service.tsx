import { observable } from 'mobx';
import { IRootService } from './root-sevice.interface';

export class AppStateService implements IRootService {
  @observable public loading = false;

  @observable public data = {
    views: []
  };

  public useHook() { }
}
