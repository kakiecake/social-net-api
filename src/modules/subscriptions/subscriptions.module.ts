import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionFacade } from './SubscriptionFacade';
import { UserModule } from '../users/user.module';
import { SubscriptionService } from './SubscriptionService';
import { UserFacade } from '../users/UserFacade';
import { SubscriptionRepositorySymbol } from '../subscriptions/ISubscriptionRepository';
import { ImplementationsModule } from '../../implementations/implementations.module';

@Module({
    exports: [SubscriptionFacade],
    imports: [
        forwardRef(() => ImplementationsModule),
        forwardRef(() => UserModule),
    ],
    providers: [
        SubscriptionFacade,
        {
            provide: SubscriptionService,
            inject: [SubscriptionRepositorySymbol, UserFacade],
            useFactory: (repo, users) => new SubscriptionService(repo, users),
        },
    ],
})
export class SubscriptionsModule {}
