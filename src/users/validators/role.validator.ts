import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsRole(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return value === 'user' || value === 'admin';
        },
        defaultMessage(args: ValidationArguments) {
          return `'${args.property}' must be either 'user' or 'admin'`;
        },
      },
    });
  };
}
