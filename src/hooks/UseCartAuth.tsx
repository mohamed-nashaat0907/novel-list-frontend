import { useContext } from "react";

import { createContext } from "react";
import type {IcartContext} from "../data/interfaces";

// import { createContext } from "react";
export const CartAuthContext = createContext<IcartContext | undefined >({} as IcartContext);

export function useCartAuth() {
    const context = useContext(CartAuthContext);
    if (!context) {
        throw new Error("useCartAuth must be used within an AuthCartProvider");
    }
    return context;
}