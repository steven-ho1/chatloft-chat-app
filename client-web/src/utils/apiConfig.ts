export enum EndPoint {
    Login = "/api/auth/login",
    Register = "/api/auth/register",
    SessionLoading = "/api/auth/session-loading",
    Name = "/api/users/name",
    ProfilePic = "/api/users/profile-pic",
}

export const getEndPoint = (endpoint: EndPoint) =>
    import.meta.env.VITE_API_URL + endpoint;
