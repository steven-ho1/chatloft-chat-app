import { SupabaseClient } from "@supabase/supabase-js";
import React from "react";
import { User } from "../../../../common/user";

type UserContextType = {
    setUserSession: (user: User, token: string) => void;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    supabase: SupabaseClient | null;
    clearUserSession: () => void;
};

export const UserContext = React.createContext<UserContextType | undefined>(
    undefined
);
