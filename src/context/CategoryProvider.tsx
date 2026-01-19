import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios/axios.config";
import {Categorycontext} from "../hooks/UseCategory";

interface Iprobs {
    children: React.ReactNode;
}

function CategoryProvider({ children }: Iprobs) {
    const fetchCart = async () => {
        const { data } = await axiosInstance.get("/categories");
        return data ?? undefined;
    };

    const { data} = useQuery({
        queryKey: ["fetchcategory"],
        queryFn: fetchCart,
    });
    // const refetchfunction = async (): Promise<void> => {
    //     try {
    //         await refetch(); // نتجاهل القيمة المرجعة
    //     } catch (error) {
    //         console.error("Failed to refetch cart:", error);
    //     }
    // };
    // const usedata = data?? undefined
    // console.log(usedata);
    

//    const {slug ,_id:id} = usedata ?? {}

    return (
        <Categorycontext.Provider
            value={data?.data ?? []}>
            {children}
        </Categorycontext.Provider>
    )
}
export default CategoryProvider;