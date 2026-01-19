import './style.scss';
import { useAuth } from '../../hooks/UseAuth';
import { Link } from "react-router-dom";
import { useCartAuth } from '../../hooks/UseCartAuth';
import { useWhislistAuth } from '../../hooks/UseAuthWhislist';

function Navbar() {
    const { isAuthenticated, handleLogout, isAdmin } = useAuth();
    const { cartItems } = useCartAuth();
    const { wishlistItems } = useWhislistAuth();

    return (
        <nav className="navbar">
            {/* Logo & Navigation */}
            <div className="navbar-left">
                <p className="logo">photo</p>
                <ul className="nav-links">
                    <li><Link to="/">browse</Link></li>
                    <li><Link to="/contact">contact us</Link></li>
                    <li><Link to="/about-us">about us</Link></li>
                    {isAuthenticated && (
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>logout</a>
                        </li>
                    )}
                    {isAdmin && <li><Link to="/dashboard">admin dashboard</Link></li>}
                </ul>
            </div>

            {/* User Actions */}
            <div className="navbar-right">
                {!isAuthenticated ? (
                    <ul className="auth-links">
                        <li><Link to="/sign-up">sign up</Link></li>
                        <li><Link to="/sign-in">sign in</Link></li>
                    </ul>
                ) : (
                    <ul className="user-links">
                        {/* Cart */}
                        <li className="icon-link">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                <span className="badge">{cartItems?.length ?? 0}</span>
                            </div>
                            <Link to="cart-items" className="link-text">cart items</Link>
                        </li>

                        {/* Wishlist */}
                        <li className="icon-link">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <span className="badge">{wishlistItems?.length ?? 0}</span>
                            </div>
                            <Link to="whishlist" className="link-text">whislist</Link>
                        </li>

                        {/* Profile */}
                        <li><Link to="/profile">profile</Link></li>
                    </ul>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
