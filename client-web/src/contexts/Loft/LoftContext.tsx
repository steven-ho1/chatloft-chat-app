import { createContext } from "react";
import { Loft } from "../../../../common/loft";

type LoftContext = {
    activeLoft: Loft | null;
    setActiveLoft: React.Dispatch<React.SetStateAction<Loft | null>>;
};

export const LoftContext = createContext<LoftContext | null>(null);
