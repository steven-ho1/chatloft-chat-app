import cors from "cors";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Service } from "typedi";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";

@Service()
export class Application {
    app: express.Application;

    constructor(
        private authController: AuthController,
        private userController: UserController
    ) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private bindRoutes(): void {
        this.app.use(express.static(path.join(__dirname, "..", "public")));

        this.app.use("/api/auth", this.authController.router);
        this.app.use("/api/users", this.userController.router);
        this.app.use(this.handleNotFound);
    }

    private handleNotFound(_req: Request, res: Response) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        console.log("Route not found");
    }
}
