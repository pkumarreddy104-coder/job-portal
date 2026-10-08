import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
function Navbar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
          window.location.href = "/";
    };
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    useEffect(() => {
        const handleLogin = () => {
            setIsLoggedIn(true);
        };

        window.addEventListener("login", handleLogin);

        return () => {
            window.removeEventListener("login", handleLogin);
        };
    }, []);
    return (
        <>

           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-4 bg-gray-900 border-b border-gray-700 shadow-md">
<h2 className="text-2xl font-bold !text-white tracking-wide hover:!text-blue-400 transition">
    Job Portal
</h2>

    <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white">
        <Link to="/"  className="py-2 hover:text-blue-400 transition" >Home</Link>
            <Link to="/jobs" className="py-2 hover:text-blue-400 transition">Jobs</Link>
            {!isLoggedIn && (
                <>
                    <Link to="/login"  className="py-2 hover:text-blue-400 transition">Login</Link>
                    <Link to="/signup" className="py-2 hover:text-blue-400 transition">Signup</Link>
                </> 
            )}
            {isLoggedIn && (
    <Link to="/profile" className="py-2 hover:text-blue-400 transition">Profile</Link>
)}
            {isLoggedIn && (
                <button onClick={handleLogout}
               className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 hover:scale-105 transition">
                    Logout
                </button>
            )}
    </nav>
</div>
           

        </>
    )
}

export default Navbar;