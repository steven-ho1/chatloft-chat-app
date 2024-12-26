export enum EndPoint {
    Login = "/api/auth/login",
    Register = "/api/auth/register",
    SessionLoading = "/api/auth/session-loading",
}

export const getEndPoint = (endpoint: EndPoint) =>
    import.meta.env.VITE_API_URL + endpoint;
