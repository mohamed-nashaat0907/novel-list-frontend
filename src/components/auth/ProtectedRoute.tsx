import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth";

interface Iprobs {
    redirectPath: string;
    children: React.ReactNode;
}
function ProtectedRoute({ redirectPath, children }: Iprobs) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // يمكنك عرض Loading أو مجرد null
        return <p>Loading...</p>;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
};
export default ProtectedRoute
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../hooks/UseAuth";

// interface Iprobs {
//     redirectPath: string;
//     children: React.ReactNode;
// }
// function ProtectedRoute({ redirectPath, children}: Iprobs) {
//     const { isAuthenticated } = useAuth();
//     const location = useLocation();
//     // console.log(location);
    
//         if (isAuthenticated) {
//             return children
//         };
//         return <Navigate to={redirectPath} replace state={{ from: location.pathname }} />;
    
   
// };
// export default ProtectedRoute