export const MINIMUM_PASSWORD_LENGTH = 8;

export enum Requirement {
    MinLengthValid,
    HasUppercase,
    HasLowercase,
    HasNumber,
    HasSpecialChar,
}
