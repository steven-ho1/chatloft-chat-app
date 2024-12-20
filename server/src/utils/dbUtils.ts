/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const snakeToCamelCase = (obj: {
    [key: string]: any;
}): { [key: string]: any } => {
    const result: { [key: string]: any } = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelCaseKey = key.replace(/_([^_])/g, (_, letter) =>
                letter.toUpperCase()
            );
            result[camelCaseKey] = obj[key];
        }
    }

    return result;
};
