import { Loft } from "@common/loft";
import { Service } from "typedi";
import { PostgresDbService } from "./postgres-db.service";

@Service()
export class LoftManagementService {
    constructor(private postgresDb: PostgresDbService) {}

    async createLoft(loftData: Loft, userId: string): Promise<Loft> {
        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            INSERT INTO lofts (name, description, profile_pic_url, owner_id)
            VALUES (${loftData.name}, ${loftData.description}, ${loftData.profilePicUrl}, ${userId})
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
        console.log(lofts);

        return lofts;
    }

    async searchLofts(query: string, userId: string): Promise<Loft[]> {
        if (!query.length) return [];

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
            words.every((word: string) => loft.name.includes(word))
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
            WHERE lofts.id = ${loftId};
        `;
        console.log(lofts);

        return lofts[0];
    }
}
