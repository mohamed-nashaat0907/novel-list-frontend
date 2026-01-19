import { NavLink } from 'react-router-dom';

//     const menuItems = [
//         { name: "Dashboard", icon: <MdDashboard /> },
//         { name: "Books", icon: <MdBook /> },
//         { name: "Orders", icon: <MdShoppingCart /> },
//         { name: "Users", icon: <MdPeople /> },
//         { name: "Comments", icon: <MdComment /> },
//         { name: "Categories", icon: <MdCategory /> },
//         { name: "Settings", icon: <MdSettings /> },
//     ];



function Sidebar() {
    return (
        <aside className="w-60 min-h-screen bg-gray-100 p-4">
            <nav className="flex flex-col gap-2">

                <NavLink
                    to="/dashboard" end
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    dashboard
                </NavLink>
                <NavLink
                    to="/dashboard/books" 
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    books
                </NavLink>
                <NavLink
                    to="/dashboard/orders"
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    orders
                </NavLink>
                <NavLink
                    to="/dashboard/users" 
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    users
                </NavLink>
                <NavLink
                    to="/dashboard/comments"
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    comments
                </NavLink>
                <NavLink
                    to="/dashboard/categories"
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    categories
                </NavLink>
                <NavLink
                    to="/dashboard/contactMessages"
                    className="block px-4 py-2 rounded text-gray-800 hover:bg-blue-100 active:bg-blue-500 active:text-white"
                >
                    messages
                </NavLink>

            </nav>
        </aside>
    );
}

export default Sidebar;
