import { PROFILE_PICS_BUCKET } from "@src/types/defaults";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { configDotenv } from "dotenv";
import { Service } from "typedi";

const FILE_SIZE_LIMIT = 204800; // Bytes, which is 200 KB

@Service()
export class SupabaseService {
    supabase!: SupabaseClient;

    async connect() {
        configDotenv();

        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await this.testConnection();
        await this.setBucket();
    }

    private async setBucket() {
        try {
            console.log("Setting bucket...");

            const { data: buckets, error: listError } =
                await this.supabase.storage.listBuckets();
            if (listError) {
                throw new Error(`Error listing buckets: ${listError.message}`);
            }

            const bucketExists = buckets.some(
                (bucket) => bucket.name === PROFILE_PICS_BUCKET
            );
            if (!bucketExists) {
                console.log(
                    `Bucket ${PROFILE_PICS_BUCKET} doesn't exist. Creating it now...`
                );
                const { error: createError } =
                    await this.supabase.storage.createBucket(
                        PROFILE_PICS_BUCKET,
                        {
                            public: true,
                            allowedMimeTypes: ["image/*"],
                            fileSizeLimit: FILE_SIZE_LIMIT,
                        }
                    );

                if (createError) {
                    throw new Error(
                        `Error creating bucket: ${createError.message}`
                    );
                }
            }
            console.log(`Bucket ready`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error:", err.message);
        }
    }

    private async testConnection() {
        try {
            const { error } = await this.supabase
                .from("users")
                .select("*")
                .limit(1);

            if (error)
                console.error("Error connecting to Supabase", error.message);
            else console.log("Supabase connected");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(
                "Unexpected error during Supabase connection test:",
                err.message
            );
        }
    }
}
