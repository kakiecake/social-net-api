import { Module, forwardRef } from '@nestjs/common';
import { UserFacade } from './UserFacade';
import { UserService } from './UserService';
import { ImplementationsModule } from '../../implementations/implementations.module';
import { HashingProviderSymbol } from './IHashingProvider';
import { UserRepositorySymbol } from './IUserRepository';
import { SubscriptionFacade } from '../subscriptions/SubscriptionFacade';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
    exports: [UserFacade],
    imports: [ImplementationsModule, forwardRef(() => SubscriptionsModule)],
    providers: [
        UserFacade,
        {
            provide: UserService,
            inject: [
                UserRepositorySymbol,
                HashingProviderSymbol,
                SubscriptionFacade,
            ],
            useFactory: (repository, hashingProvider, subscriptions) =>
                new UserService(repository, hashingProvider, subscriptions),
        },
    ],
})
export class UserModule {}
