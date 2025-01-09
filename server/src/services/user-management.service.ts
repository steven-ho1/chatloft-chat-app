import { compare, hash } from "bcryptjs";
import { Service } from "typedi";
import { AuthData, Credentials } from "../auth";
import { DEFAULT_USER_PROFILE_PIC_URL } from "../types/defaults";
import { User } from "../user";
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
        const result: Credentials[] = await this.postgresDb.sql<Credentials[]>`
            SELECT *
            FROM credentials
            WHERE email = ${email};
        `;

        if (!result.length) return null;
        return result[0];
    }

    async findUserById(userId: string) {
        const result: User[] = await this.postgresDb.sql<User[]>`
            SELECT *
            FROM users
            WHERE id = ${userId};
        `;

        if (!result.length) return null;
        return result[0];
    }

    async updateFullName(fullName: string, userId: string) {
        const users: User[] = await this.postgresDb.sql<User[]>`
            UPDATE users
            SET full_name = ${fullName}
            WHERE id = ${userId}
            RETURNING *;
        `;

        if (!users.length) return null;
        return users[0];
    }

    async updateProfilePic(profilePicUrl: string, userId: string) {
        const users: User[] = await this.postgresDb.sql<User[]>`
            UPDATE users
            SET profile_pic_url = ${profilePicUrl}
            WHERE id = ${userId}
            RETURNING *;
        `;

        if (!users.length) return null;
        return users[0];
    }

    private async insertUser(authData: AuthData) {
        const result: User[] = await this.postgresDb.sql<User[]>`
            INSERT INTO users (full_name, profile_pic_url)
            VALUES (${authData.fullName!}, ${DEFAULT_USER_PROFILE_PIC_URL})
            RETURNING *;
        `;

        return result[0];
    }

    private async insertCredentials(authData: AuthData, userId: string) {
        const passwordHash: string = await hash(authData.password, SALT_LENGTH);

        await this.postgresDb.sql`
            INSERT INTO credentials (user_id, email, password_hash)
            VALUES (${userId} ,${authData.email}, ${passwordHash})
        `;
    }
}
