import { useState } from "react";
import { Loft } from "../../../../common/loft";

import { LoftContext } from "./LoftContext";

const LoftProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeLoft, setActiveLoft] = useState<Loft | null>(null);

    return (
        <LoftContext.Provider value={{ activeLoft, setActiveLoft }}>
            {children}
        </LoftContext.Provider>
    );
};

export default LoftProvider;
