import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/UseAuth";
import type { UserType, TokenType } from "../data/interfaces";

interface Iprobs {
    children: React.ReactNode;
}

function AuthProvider({ children }: Iprobs) {
    // const navigate = useNavigate();

    const [user, setUser] = useState<UserType>(null)
    const [token, setToken] = useState<TokenType>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isAuthenticated = !!(user && token);
    const isAdmin = user?.role === "admin";
    // console.log(isAdmin);

    useEffect(() => {
        const storedUserstring = localStorage.getItem("user");
        const storedTokenstring = localStorage.getItem("token");
        const storedExpirationdateString = localStorage.getItem("expirationdate");

        if (storedUserstring && storedTokenstring && storedExpirationdateString) {
            const storedUser = JSON.parse(storedUserstring);
            const storedToken = JSON.parse(storedTokenstring);
            const storedExpirationdate = JSON.parse(storedExpirationdateString);
            const now = Date.now() / 1000;

            if (now < storedExpirationdate) {
                setUser(storedUser);
                setToken(storedToken);
            } else {
                handleLogout();
            }
        }

        // مهما حصل، ننهي التحميل
        setIsLoading(false);
    }, []);




    // console.log(user);


    const handleLogin = (userData: UserType, token: string, expiration: number) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expirationdate", JSON.stringify(expiration));
    }
    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("expirationdate");
        // navigate('/');
    }
    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface UserType {
//   id: string;
//   email: string;
//   // باقي خصائص المستخدم
// }

// interface AuthContextType {
//   user: UserType | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (user: UserType, token: string, exp: number) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
//   const isAuthenticated = !!user && !!token;

//   // عند التحميل، نسترجع من localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     const storedExp = localStorage.getItem("tokenExp");

//     if (storedUser && storedToken && storedExp) {
//       const exp = parseInt(storedExp, 10);
//       const now = Date.now() / 1000;
//       if (now < exp) {
//         setUser(JSON.parse(storedUser));
//         setToken(storedToken);
//         setTokenExpiration(exp);
//       } else {
//         clearAuthData();
//       }
//     }
//   }, []);

//   // تابع لحفظ بيانات الدخول
//   const login = (userData: UserType, jwtToken: string, exp: number) => {
//     setUser(userData);
//     setToken(jwtToken);
//     setTokenExpiration(exp);

//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", jwtToken);
//     localStorage.setItem("tokenExp", exp.toString());
//   };

//   // تابع لتسجيل الخروج
//   const logout = () => {
//     clearAuthData();
//   };

//   const clearAuthData = () => {
//     setUser(null);
//     setToken(null);
//     setTokenExpiration(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     localStorage.removeItem("tokenExp");
//   };

//   // مراقبة انتهاء التوكن (logout تلقائي)
//   useEffect(() => {
//     if (!tokenExpiration) return;

//     const now = Date.now() / 1000;
//     const expiresIn = tokenExpiration - now;

//     if (expiresIn <= 0) {
//       logout();
//     } else {
//       const timeout = setTimeout(() => {
//         logout();
//       }, expiresIn * 1000);

//       return () => clearTimeout(timeout);
//     }
//   }, [tokenExpiration]);

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
