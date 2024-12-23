import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const handleServerError = (
    res: Response,
    error: unknown,
    internalErrorMessage: string
) => {
    console.error(internalErrorMessage);
    console.error(error);

    if (!res.headersSent) res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};
