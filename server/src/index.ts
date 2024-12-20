import "reflect-metadata";
// reflect-metadata must be the first line or else, error
import { Server } from "@src/server";
import { Container } from "typedi";

// Steps to follow: https://www.npmjs.com/package/typedi
const server: Server = Container.get(Server);
server.init();
