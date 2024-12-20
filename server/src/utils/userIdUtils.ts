import * as cryptoRandomString from "crypto-random-string";

const DEFAULT_UNIQUE_ID_LENGTH = 8;
export const SALT_LENGTH = 10;

export const generateUserID = (
    fullName: string,
    uniqueIdLength: number = DEFAULT_UNIQUE_ID_LENGTH
) => {
    const initials = extractInitials(fullName);
    const uniqueId = cryptoRandomString.default({
        length: uniqueIdLength,
        type: "alphanumeric",
    });

    return `${initials}-${uniqueId}`;
};

const extractInitials = (fullName: string) => {
    const initials: string = fullName
        .split(" ")
        .map((name) => name[0])
        .join("");

    return initials;
};
