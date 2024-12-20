import cors from "cors";
import express from "express";
import { Service } from "typedi";
import { AuthController } from "./controllers/authController";

@Service()
export class Application {
    app: express.Application;

    constructor(private authController: AuthController) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private bindRoutes(): void {
        this.app.use("/api/auth", this.authController.router);
    }
}
