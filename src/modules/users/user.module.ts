import { Module } from '@nestjs/common';
import { UserFacade } from './UserFacade';
import { UserService } from './UserService';
import { ImplementationsModule } from '../../implementations/implementations.module';
import { HashingProviderSymbol } from './IHashingProvider';
import { UserRepositorySymbol } from './IUserRepository';

@Module({
    exports: [UserFacade],
    imports: [ImplementationsModule],
    providers: [
        {
            provide: UserFacade,
            inject: [UserService],
            useFactory: service => new UserFacade(service),
        },
        {
            provide: UserService,
            inject: [UserRepositorySymbol, HashingProviderSymbol],
            useFactory: (repository, hashingProvider) =>
                new UserService(repository, hashingProvider),
        },
    ],
})
export class UserModule {}
