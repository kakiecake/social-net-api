import { Module } from '@nestjs/common';
import { IUserRepository } from './services/UserService';
import { PostController } from './controllers/PostController';
import { LoginService } from './services/LoginService';
import { FakeUserRepository } from './repositories/FakeUserRepository';
import { AuthGuard } from './controllers/authUtils';
import { UserController } from './controllers/UserController';

const UserRepositorySymbol = Symbol('UserRepository');

@Module({
    controllers: [PostController, UserController],
    providers: [
        AuthGuard,
        {
            provide: LoginService,
            inject: [UserRepositorySymbol],
            useFactory: (userRepository: IUserRepository) => {
                return new LoginService(userRepository, '~privateKey~');
            },
        },
        {
            provide: UserRepositorySymbol,
            useFactory: () => {
                return new FakeUserRepository();
            },
        },
    ],
})
export class AppModule {}
