import { CartAuthContext } from "../hooks/UseCartAuth";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios.config";
import { useAuth } from "../hooks/UseAuth";

interface Iprobs {
    children: React.ReactNode;
}

function AuthCartProvider({ children }: Iprobs) {
    const { token } = useAuth();
    const fetchCart = async () => {
        const { data } = await axiosInstance.get("/cart", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        return data ?? undefined;
    };

    const { data, refetch } = useQuery({
        queryKey: ["fetchcart", token],
        queryFn: fetchCart,
        enabled: !!token,
    });
    const refetchfunction = async (): Promise<void> => {
        try {
            await refetch(); // نتجاهل القيمة المرجعة
        } catch (error) {
            console.error("Failed to refetch cart:", error);
        }
    };
    const usedata = data?.data ?? undefined
    // console.log(usedata);

    return (
        <CartAuthContext.Provider
            value={{ cartItems: usedata?.cartItems ?? [], totalPrice: usedata?.totalPrice ?? 0, totalQuantity: usedata?.totalQuantity ?? 0, refetchCart: refetchfunction }}>
            {children}
        </CartAuthContext.Provider>
    )
}
export default AuthCartProvider;