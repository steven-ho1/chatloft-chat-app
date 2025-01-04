import { Loft, LoftCreation } from "@common/loft";
import { Default } from "@src/types/defaults";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

@Service()
export class LoftManagementService {
    constructor(private postgresDb: PostgresDbService) {}

    async createLoft(loftData: LoftCreation, userId: string): Promise<Loft> {
        loftData.name = loftData.name?.trim();
        loftData.description = loftData.description?.trim();

        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            INSERT INTO lofts (name, description, profile_pic_url, owner_id)
            VALUES (${loftData.name}, ${
            loftData.description
                ? loftData.description
                : Default.LoftDescription
        }, ${
            loftData.profilePicUrl
                ? loftData.profilePicUrl
                : Default.LoftProfilePicUrl
        }, ${userId})
            RETURNING *;
        `;

        await this.postgresDb.sql`
            INSERT INTO loft_users (user_id, loft_id)
            VALUES (${userId}, ${lofts[0].id!});
        `;

        return lofts[0];
    }

    async fetchUserLofts(userId: string): Promise<Loft[]> {
        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            SELECT l.* 
            FROM lofts l, loft_users l_u
            WHERE l.id = l_u.loft_id
            AND l_u.user_id = ${userId};
        `;

        return lofts;
    }

    async searchLofts(query: string, userId: string): Promise<Loft[]> {
        const words = query.split(/\s+/);

        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            SELECT l.*,
                EXISTS (SELECT 1
                    FROM loft_users l_u
                    WHERE l_u.loft_id = l.id 
                    AND l_u.user_id = ${userId}
                ) AS is_member
            FROM lofts l;
        `;

        const loftsFound: Loft[] = lofts.filter((loft: Loft) =>
            words.every((word: string) =>
                loft.name.toLowerCase().includes(word)
            )
        );

        return loftsFound;
    }

    async joinLoft(userId: string, loftId: string): Promise<Loft> {
        await this.postgresDb.sql`
            INSERT INTO loft_users (user_id, loft_id)
            VALUES (${userId}, ${loftId});
        `;

        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            SELECT *
            FROM lofts
            WHERE id = ${loftId};
        `;

        return lofts[0];
    }

    async doesLoftExist(loftId: string) {
        const result = await this.postgresDb.sql`
            SELECT EXISTS (
                SELECT 1 FROM lofts WHERE id = ${loftId}
            ) AS loft_exists;
        `;

        return result[0].loftExists;
    }
}
