/* eslint-disable no-console */
import { AuthData, Credentials } from "@common/auth";
import { DEFAULT_PROFILE_PIC, User } from "@common/user";
import { snakeToCamelCase } from "@src/utils/dbUtils";
import { generateUserID, SALT_LENGTH } from "@src/utils/userIdUtils";
import { compare, hash } from "bcryptjs";
import { Service } from "typedi";
import { PostgresDb } from "./postgresDb";

@Service()
export class UserManagementService {
    constructor(private postgresDb: PostgresDb) {}

    async createUser(authData: AuthData) {
        const { user, credentials } = await this.populateNewUser(authData);
        await this.insertUser(user);
        await this.insertCredentials(credentials);

        return user;
    }

    async authenticate(email: string, password: string) {
        const credentials = await this.findCredentialsByEmail(email);
        if (!credentials || !(await compare(password, credentials.password)))
            return null;

        const user = await this.findUserById(credentials.userId);
        if (!user) return null;
        return user;
    }

    async findCredentialsByEmail(email: string) {
        const result = await this.postgresDb.sql`
            SELECT *
            FROM credentials
            WHERE credentials.email = ${email}
        `;

        if (result.length > 0)
            return snakeToCamelCase(result[0]) as Credentials;
        return null;
    }

    async findUserById(userId: string) {
        const result = await this.postgresDb.sql`
            SELECT *
            FROM users
            WHERE users.user_id = ${userId}
        `;

        if (result.length > 0) return snakeToCamelCase(result[0]) as User;
        return null;
    }

    private async insertUser(user: User) {
        await this.postgresDb.sql`
          INSERT INTO users (user_id, full_name, profile_pic)
          VALUES (${user.userId}, ${user.fullName}, ${user.profilePic})
        `;
    }

    private async insertCredentials(credentials: Credentials) {
        await this.postgresDb.sql`
          INSERT INTO credentials (user_id, email, password)
          VALUES (${credentials.userId}, ${credentials.email}, ${credentials.password})
        `;
    }

    private async populateNewUser(authData: AuthData) {
        const userId: string = generateUserID(authData.fullName!);
        const passwordHash: string = await hash(authData.password, SALT_LENGTH);

        const newUser: User = {
            userId,
            fullName: authData.fullName!,
            profilePic: DEFAULT_PROFILE_PIC,
        };

        const newUserCredentials: Credentials = {
            userId,
            email: authData.email,
            password: passwordHash,
        };

        return { user: newUser, credentials: newUserCredentials };
    }
}
