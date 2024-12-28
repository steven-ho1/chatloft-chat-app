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
            VALUES (${userId}, ${lofts[0].id!})
        `;

        return lofts[0];
    }

    async getUserLofts(userId: string): Promise<Loft[]> {
        const lofts: Loft[] = await this.postgresDb.sql<Loft[]>`
            SELECT l.id, l.name, l.description, l.profile_pic_url, l.owner_id 
            FROM lofts l, loft_users l_m
            WHERE l.id = l_m.loft_id
            AND l_m.user_id = ${userId};
        `;
        console.log(lofts);
        return lofts;
    }
}
