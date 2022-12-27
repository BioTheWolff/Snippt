/**
 * Taken and adapted from https://github.com/typestack/class-validator/issues/486
 * Credit to: Github user @kuriel-trivu
 */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {ClassConstructor} from 'class-transformer';

export const MatchesWithProperty = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchOtherValidator,
    });
  };
};

@ValidatorConstraint({name: 'matchOtherValidator', async: false})
export class MatchOtherValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [fn] = args.constraints;
    return fn(args.object) === value;
  }
  
  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: Array<() => any> = args.constraints;
    return `${args.property} does not match with ${(constraintProperty + '').split('.')[1]}`;
  }
}