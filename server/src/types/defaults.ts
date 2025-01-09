export const LOCAL_PORT = "5000";

const DOMAIN_URL = process.env.DOMAIN_URL || `http://localhost:${LOCAL_PORT}`;

export const DEFAULT_USER_PROFILE_PIC_URL = `${DOMAIN_URL}/profile-pics/default-user-profile-pic.png`;
export const DEFAULT_LOFT_PROFILE_PIC_URL = `${DOMAIN_URL}/profile-pics/default-loft-profile-pic.png`;
export const DEFAULT_LOFT_DESCRIPTION = "No description";

export const PROFILE_PICS_BUCKET = "profile-pics";
