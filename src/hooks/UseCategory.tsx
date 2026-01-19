import { useContext } from "react";
import { createContext } from "react";
import {type IcategoryContext } from "../data/interfaces";

export const Categorycontext = createContext<IcategoryContext[]>([]);

export const useCategory = () => {
    const context = useContext(Categorycontext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }  
    return context;     
}