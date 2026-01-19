import { useContext } from "react";

import { createContext } from "react";
import type {IWishlistContext} from "../data/interfaces";

// import { createContext } from "react";
export const WhishlistAuthContext = createContext<IWishlistContext | undefined >({} as IWishlistContext);

export function useWhislistAuth() {
    const context = useContext(WhishlistAuthContext);
    if (!context) {
        throw new Error("useCartAuth must be used within an AuthCartProvider");
    }
    return context;
}