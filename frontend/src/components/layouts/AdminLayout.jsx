import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    }
    const dashboardicon = (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
        </svg>
    );

    const overviewicon = (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.111 20A3.111 3.111 0 0 1 4 16.889v-12C4 4.398 4.398 4 4.889 4h4.444a.89.89 0 0 1 .89.889v12A3.111 3.111 0 0 1 7.11 20Zm0 0h12a.889.889 0 0 0 .889-.889v-4.444a.889.889 0 0 0-.889-.89h-4.389a.889.889 0 0 0-.62.253l-3.767 3.665a.933.933 0 0 0-.146.185c-.868 1.433-1.581 1.858-3.078 2.12Zm0-3.556h.009m7.933-10.927 3.143 3.143a.889.889 0 0 1 0 1.257l-7.974 7.974v-8.8l3.574-3.574a.889.889 0 0 1 1.257 0Z" />
        </svg>
    );

    const productsIcon = (
    <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
    </svg>
    );

    const categoryIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    );

    const sidebarLinks = [
        { name: "Dashboard", path: "", icon: dashboardicon },
        { name: "Orders", path: "orders", icon: overviewicon },
        { name: "Products", path: "products", icon: productsIcon },
        {name: "Others", path: "category", icon: categoryIcon}
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

        <div className="flex items-center justify-between border-b py-3 bg-cocoprimary px-10">
            <img src={assets.logo} alt="Logo" className="md:w-80 w-60"/>
            <button className="border rounded-full text-sm px-4 py-1 text-background cursor-pointer" onClick={handleLogout}>
            Logout
            </button>
        </div>

        <div className="flex flex-1">
            <aside className="md:w-64 w-16 border-r border-gray-300 pt-4 flex flex-col">
            {sidebarLinks.map((item, index) => (
                <NavLink
                key={index}
                to={item.path}
                end
                className={({ isActive }) =>
                    `flex items-center py-3 px-4 gap-3 transition
                    ${isActive
                    ? "border-r-4 bg-red-500/8 border-primary text-primary"
                    : "hover:bg-gray-100 text-gray-700"}`
                }
                >
                {item.icon}
                <p className="md:block hidden">{item.name}</p>
                </NavLink>
            ))}
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
            </main>

        </div>
        </div>
    );
    };

    export default AdminLayout;
