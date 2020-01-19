import { IRootService } from './root-sevice.interface';
import { IUser } from '../models/user.model';
export declare class UserService implements IRootService {
    loading: boolean;
    private data;
    get user(): IUser;
    get isGuest(): boolean;
    private setLoading;
    useUserChange(callback: (user: IUser) => void): void;
    useHook(): void;
    checkAuth(): void;
}
