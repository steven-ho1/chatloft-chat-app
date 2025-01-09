import "reflect-metadata";
// reflect-metadata must be the first line or else, error
import { Container } from "typedi";
import { Server } from "./server";

// Steps to follow: https://www.npmjs.com/package/typedi
const server: Server = Container.get(Server);
server.init();
