import { handleServerError } from "@src/utils/error";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Service } from "typedi";

@Service()
export class TokenService {
    validateToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = this.getToken(req);
        if (!token) {
            console.log("No token found");
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            return;
        }

        verify(token, process.env.TOKEN_SECRET!, (error, decodedToken) => {
            try {
                if (error) {
                    res.sendStatus(StatusCodes.UNAUTHORIZED);
                    console.log("Token error: " + error.message);
                    return;
                }

                console.log("Token validated");
                res.locals.id = (decodedToken as JwtPayload).id;
                next();
            } catch (error) {
                handleServerError(res, error, "Error when validating token");
            }
        });
    };

    getToken(req: Request) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        return token;
    }

    generateToken(id: string) {
        const token = sign({ id }, process.env.TOKEN_SECRET!);
        return token;
    }
}
