import type { User } from '../entities/user';
import type { GenericService } from '../utils/types/service';

export interface UserService extends GenericService<User> {
    findByName: (name: string) => Promise<User | undefined>;
    findByEmail: (email: string) => Promise<User | undefined>;
}