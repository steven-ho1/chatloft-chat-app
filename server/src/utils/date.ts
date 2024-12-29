export interface DateConfiguration {
    onlyDate?: boolean;
    onlyTime?: boolean;
}

export const getMontrealDateTime = ({
    onlyDate = false,
    onlyTime = false,
}: DateConfiguration = {}) => {
    if (onlyTime && onlyDate) {
        throw new Error(
            "Cannot specify both 'onlyTime' and 'onlyDate' at the same time."
        );
    }

    let now: Date | string = new Date();

    const locales: Intl.LocalesArgument = "en-GB";
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Montreal",
    };

    if (onlyDate) now = now.toLocaleDateString(locales, options);
    else if (onlyTime) now = now.toLocaleTimeString(locales, options);
    else now = now.toLocaleString(locales, options);

    return now;
};
