import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'userTag', async: false })
export class UserTag implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        return text.startsWith('@') && text.length < 16;
    }

    defaultMessage(args: ValidationArguments) {
        return 'User tag must start with @ and be less than 16 characters long';
    }
}
