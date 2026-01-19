import { createBrowserRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom"
import Navbar from "../components/Navbar/Navbar"
import Signup from "../pages/public/Signup"
import Signin from "../pages/public/Signin"
import VerifyEmail from "../pages/public/VerifyEmail"
import Browse from "../pages/public/Browse/Browse"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import Sidebar from "../components/Sidebar"
import PageNotFound from "../pages/errors/Pagenotfound"
import ErrorHandler from "../pages/errors/ErrorHandler"
import Unauthorized from "../pages/errors/Unauthorized"
import AdminRoute from "../components/auth/AdminRoute"
import AdminDashboard from "../pages/dashboard/AdminDashboard"
import Books from "../pages/dashboard/Books"
import UserAdminDashboard from "../pages/dashboard/UserAdminDashboard"
import Profile from "../pages/public/Profile"
import CartItemsPage from "../pages/public/CartItemsPage"
import WhishlistPage from "../pages/public/WhishlistPage"
import CheckoutPage from "../pages/public/CheckoutPage"
import AdminCategories from "../pages/dashboard/AdminCategories"
import Orders from "../pages/dashboard/Orders"
import CommentsDashboard from "../pages/dashboard/CommentsDashboard"
import Contact from "../pages/public/Contact"
import ContactMessages from "../pages/dashboard/ContactMessages"


const Mainroutes =
    createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Outlet />
                    </>
                } errorElement={<ErrorHandler />}>
                    <Route index element={<Browse />} />
                    <Route path="contact" element={<ProtectedRoute redirectPath="/sign-in"><Contact /></ProtectedRoute>} />
                    <Route path="about-us" element={<p>about us</p>} />
                    <Route path="sign-in" element={<Signin />} />
                    <Route path="sign-up" element={<Signup />} />
                    <Route path="profile" element={<ProtectedRoute redirectPath="/sign-in"><Profile /></ProtectedRoute>} />
                    <Route path="cart-items" element={<ProtectedRoute redirectPath="/sign-in"><CartItemsPage /></ProtectedRoute>} />
                    <Route path="checkout/success-popup" element={<CheckoutPage />} />
                    <Route path="whishlist" element={<ProtectedRoute redirectPath="/sign-in"><WhishlistPage /></ProtectedRoute>} />
                </Route>
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                {/* .................. */}
                <Route path="/dashboard" element={
                    <>
                        <AdminRoute>
                            <Navbar />
                            <div className="flex">
                                <Sidebar />
                                <Outlet />
                            </div>
                        </AdminRoute>


                    </>
                } errorElement={<ErrorHandler />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="users" element={<UserAdminDashboard />} />
                    <Route path="comments" element={< CommentsDashboard />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="contactMessages" element={<ContactMessages />} />
                </Route>
                {/* Page Not Found */}
                <Route path="*" element={<PageNotFound />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
            </>
        )
    )
export default Mainroutes