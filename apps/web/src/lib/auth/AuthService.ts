import { map } from 'rxjs';

import { User } from '@/lib/auth/auth.types.ts';
import { IDBStorageService } from '@/lib/storage/IdbStorageService.ts';

class AuthService {
  userStorage = new IDBStorageService<User>('user');
  tokenStorage = new IDBStorageService<string>('access_token');

  isAuthenticated$ = this.userStorage.data$.pipe(map((user) => Boolean(user)));

  async logout() {
    await this.userStorage.clear();
    await this.tokenStorage.clear();
  }
}

export const authService = new AuthService();
