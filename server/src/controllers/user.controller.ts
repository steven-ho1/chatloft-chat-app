import { TokenService } from "@src/services/token.service";
import { UserManagementService } from "@src/services/user-management.service";
import { handleServerError } from "@src/utils/error";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Service } from "typedi";

@Service()
export class UserController {
    router: Router;

    constructor(
        private userManagementService: UserManagementService,
        private tokenService: TokenService
    ) {
        this.router = Router();
        this.configureRouter();
    }

    private configureRouter() {
        this.router.use(this.tokenService.validateToken);
        this.router.patch("/name", this.updateName);
        this.router.patch("/profile-pic", this.updateProfilePic);
    }

    private updateName = async (req: Request, res: Response) => {
        try {
            const fullName = req.body.fullName?.trim().replace(/\s+/g, " ");

            if (typeof fullName !== "string") {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }

            const newUser = await this.userManagementService.updateFullName(
                fullName,
                res.locals.id
            );
            if (!newUser) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }

            res.json(newUser);
        } catch (error) {
            handleServerError(res, error, "Error when updating name");
        }
    };

    private updateProfilePic = async (req: Request, res: Response) => {
        try {
            const profilePicUrl = req.body.profilePicUrl;

            if (typeof profilePicUrl !== "string") {
                res.sendStatus(StatusCodes.BAD_REQUEST);
                return;
            }

            const newUser = await this.userManagementService.updateProfilePic(
                profilePicUrl,
                res.locals.id
            );
            if (!newUser) {
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }

            res.json(newUser);
        } catch (error) {
            handleServerError(res, error, "Error when updating name");
        }
    };
}
