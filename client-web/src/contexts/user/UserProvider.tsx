import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../../common/user";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const navigate = useNavigate();

    const connectSupabaseClient = (customToken: string) => {
        const client: SupabaseClient = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${customToken}`,
                    },
                },
            }
        );
        setSupabase(client);
        console.log(customToken);
    };

    const disconnectSupabaseClient = () => {
        createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: "",
                    },
                },
            }
        );
        setSupabase(null);
    };

    const setUserSession = (user: User, token: string) => {
        localStorage.setItem("token", token);
        connectSupabaseClient(token);
        setUser(user);
        navigate("/lofts", { replace: true });
    };

    const clearUserSession = () => {
        localStorage.removeItem("token");
        disconnectSupabaseClient();
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                setUserSession,
                user,
                setUser,
                supabase,
                clearUserSession,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
