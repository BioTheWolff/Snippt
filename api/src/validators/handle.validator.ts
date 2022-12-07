import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ name: "handleValidator", async: false })
export class HandleValidator implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return value.match(/[^a-zA-Z0-9_-]/g) === null;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `${validationArguments.targetName} should only contain alphanumerical characters, dashes (-) and underscores (_)`
    }
}