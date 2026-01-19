import { useAuth } from "../../hooks/UseAuth";
import { Navigate } from "react-router-dom";
interface Iprobs {
    children: React.ReactNode;
}
function AdminRoute({ children }: Iprobs) {
    const { isAdmin ,isLoading} = useAuth()
    if(isLoading){
        return <p>Loading...</p>;
    }

    if (isAdmin) {
        return <>{children}</>;
    }
    return <Navigate to="/unauthorized" replace />;
}
export default AdminRoute