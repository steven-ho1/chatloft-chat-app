const API_BASE_URL = "http://localhost:8080";

export enum EndPoint {
    Login = "/api/auth/login",
    Register = "/api/auth/register",
    SessionLoading = "/api/auth/session-loading",
}

export const getEndPoint = (endpoint: EndPoint) => API_BASE_URL + endpoint;
