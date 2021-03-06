import debounce from 'debounce';
import { computed, observable, reaction } from 'mobx';
import { useDisposable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { IUser } from '../../src/models/user.model';

export class DemoUserService {
  @observable public loading = true;

  @observable private data: {
    user: IUser;
  } = {
    user: {
      id: -1,
      email: 'tester'
    }
  };

  @computed get user() {
    return this.data.user;
  }

  @computed get isGuest() {
    return !this.data.user && !this.loading;
  }

  private setLoading = debounce<(value: boolean) => void>(value => {
    this.loading = value;
  }, 50);

  public useUserChange(callback: (user: IUser) => void) {
    useDisposable(() => reaction(() => this.data.user, callback));
  }

  // Constructor
  public useHook() {
    useEffect(() => this.checkAuth(), []);
  }

  public checkAuth() {
    this.setLoading(true);

    // TODO: Here you can make auth
    this.data.user = {
      id: -1,
      email: 'user@mail.com'
    };

    this.setLoading(false);
  }
}
