import { Module } from '@nestjs/common';
import { SubscriptionFacade } from './SubscriptionFacade';
import { UserModule } from '../users/user.module';
import { SubscriptionService } from './SubscriptionService';
import { UserFacade } from '../users/UserFacade';
import { SubscriptionRepositorySymbol } from '../subscriptions/ISubscriptionRepository';
import { ImplementationsModule } from '../../implementations/implementations.module';

@Module({
    exports: [SubscriptionFacade],
    imports: [ImplementationsModule, UserModule],
    providers: [
        {
            provide: SubscriptionFacade,
            inject: [SubscriptionService],
            useFactory: service => new SubscriptionFacade(service),
        },
        {
            provide: SubscriptionService,
            inject: [SubscriptionRepositorySymbol, UserFacade],
            useFactory: (repo, users) => new SubscriptionService(repo, users),
        },
    ],
})
export class SubscriptionsModule {}
