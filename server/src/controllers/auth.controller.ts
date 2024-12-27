import { AuthData, AuthResponse } from "@common/auth";
import { User } from "@common/user";
import { TokenService } from "@src/services/token.service";
import { UserManagementService } from "@src/services/user-management.service";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Service } from "typedi";
import { handleServerError } from "../utils/error";

@Service()
export class AuthController {
    router: Router;

    constructor(
        private tokenService: TokenService,
        private userManagementService: UserManagementService
    ) {
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter() {
        this.router.post("/login", this.loginUser);
        this.router.post("/register", this.registerUser);
        this.router.get(
            "/session-loading",
            this.tokenService.validateToken,
            this.loadSession
        );
    }

    private loginUser = async (req: Request, res: Response) => {
        try {
            const authData: AuthData = req.body;
            const email = authData.email?.trim().toLowerCase();
            const password = authData.password;

            if (typeof email !== "string" || typeof password !== "string") {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }

            const user = await this.userManagementService.authenticate(
                email,
                password
            );
            if (!user) {
                res.sendStatus(StatusCodes.UNAUTHORIZED);
                return;
            }

            const token = this.tokenService.generateToken(user.id);
            const payload: AuthResponse = { user, token };
            res.json(payload);
        } catch (error) {
            handleServerError(res, error, "Error on login");
        }
    };

    private registerUser = async (req: Request, res: Response) => {
        try {
            const authData: AuthData = req.body;
            const fullName = authData.fullName?.trim().replace(/\s+/g, " ");
            const email = authData.email?.trim().toLowerCase();
            const password = authData.password;

            if (
                typeof fullName !== "string" ||
                typeof email !== "string" ||
                typeof password !== "string"
            ) {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }

            const credentials =
                await this.userManagementService.findCredentialsByEmail(email);
            if (credentials) {
                res.sendStatus(StatusCodes.CONFLICT);
                return;
            }

            const newUser: User = await this.userManagementService.createUser({
                fullName,
                email,
                password,
            });
            const token: string = this.tokenService.generateToken(newUser.id);
            const payload: AuthResponse = { user: newUser, token };
            res.json(payload);
        } catch (error) {
            handleServerError(res, error, "Error on register");
        }
    };

    private loadSession = async (_req: Request, res: Response) => {
        try {
            const userId = res.locals.id;

            const userFound = await this.userManagementService.findUserById(
                userId
            );
            if (!userFound) {
                res.sendStatus(StatusCodes.UNAUTHORIZED);
                return;
            }

            const newToken = this.tokenService.generateToken(userId);
            const payload: AuthResponse = { user: userFound, token: newToken };
            res.json(payload);
        } catch (error) {
            handleServerError(res, error, "Error when loading session");
        }
    };
}
