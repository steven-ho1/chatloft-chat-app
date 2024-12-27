import { AuthData, Credentials } from "@common/auth";
import { DEFAULT_PROFILE_PIC, User } from "@common/user";
import { snakeToCamelCase } from "@src/utils/db";
import { compare, hash } from "bcryptjs";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

const SALT_LENGTH = 10;

@Service()
export class UserManagementService {
    constructor(private postgresDb: PostgresDbService) {}

    async createUser(authData: AuthData) {
        const user = await this.insertUser(authData);
        await this.insertCredentials(authData, user.id);

        return user;
    }

    async authenticate(email: string, password: string) {
        const credentials = await this.findCredentialsByEmail(email);
        if (
            !credentials ||
            !(await compare(password, credentials.passwordHash))
        )
            return null;

        const user = await this.findUserById(credentials.userId);
        if (!user) return null;
        return user;
    }

    async findCredentialsByEmail(email: string) {
        const result = await this.postgresDb.sql`
            SELECT *
            FROM credentials
            WHERE credentials.email = ${email};
        `;

        if (result.length > 0)
            return snakeToCamelCase(result[0]) as Credentials;
        return null;
    }

    async findUserById(userId: string) {
        const result = await this.postgresDb.sql`
            SELECT *
            FROM users
            WHERE users.id = ${userId};
        `;

        if (result.length > 0) return snakeToCamelCase(result[0]) as User;
        return null;
    }

    private async insertUser(authData: AuthData) {
        const result = await this.postgresDb.sql`
            INSERT INTO users (full_name, profile_pic_url)
            VALUES (${authData.fullName!}, ${DEFAULT_PROFILE_PIC})
            RETURNING *;
        `;

        return snakeToCamelCase(result[0]) as User;
    }

    private async insertCredentials(authData: AuthData, userId: string) {
        const passwordHash: string = await hash(authData.password, SALT_LENGTH);

        await this.postgresDb.sql`
            INSERT INTO credentials (user_id, email, password_hash)
            VALUES (${userId} ,${authData.email}, ${passwordHash})
        `;
    }
}
