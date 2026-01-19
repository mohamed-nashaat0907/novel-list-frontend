import { WhishlistAuthContext } from "../hooks/UseAuthWhislist";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios.config";
import { useAuth } from "../hooks/UseAuth";

interface Iprobs {
    children: React.ReactNode;
}

function AuthWhislistProvider({ children }: Iprobs) {
    const { token } = useAuth();
    const fetchCart = async () => {
        const { data } = await axiosInstance.get("/wishlist", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return data ?? undefined;
    };

    const { data, refetch } = useQuery({
        queryKey: ["fetchwhishlist", token],
        queryFn: fetchCart,
        enabled: !!token,
    });
    const refetchfunction = async (): Promise<void> => {
        try {
            await refetch(); // نتجاهل القيمة المرجعة
        } catch (error) {
            console.error("Failed to refetch whislist:", error);
        }
    };
    const usedata = data?.data ?? undefined
    // console.log(usedata);

    return (
        <WhishlistAuthContext.Provider
            value={{ wishlistItems: usedata?.wishlistItems ?? [], totalQuantity: usedata?.totalQuantity ?? 0, refetchWishlist: refetchfunction }}>
            {children}
        </WhishlistAuthContext.Provider>
    )
}
export default AuthWhislistProvider;