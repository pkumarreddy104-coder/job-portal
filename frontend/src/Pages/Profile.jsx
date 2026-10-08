import { useState, useEffect } from "react";
function Profile() {
    const [user, setUser] = useState(null);
const [error, setError] = useState("");
    useEffect(() => {
    const getProfile = async () => {
        const token = localStorage.getItem("token");

        setError("");

        try {
            const response = await fetch("https://job-portal-ex9x.onrender.com/profile", {
                headers: {
                    Authorization: token
                }
            });

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            setError("Failed to load profile");
        }
    }

    getProfile();
}, [])
    if (error) {
    return (
        <div className="text-center py-10">
           <p className="text-lg font-medium text-red-600">
    {error}
</p>

            <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            >
                Retry
            </button>
        </div>
    )
}
    if (!user) {
    return (
        <div className="text-center py-10">
            <p className="text-lg text-gray-500">
                Loading profile...
            </p>
        </div>
    )
}
    return (
   <div className="max-w-xl mx-auto mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
       <h1 className="text-3xl font-bold !text-gray-800 mb-8">
            Profile
        </h1>

      <p className="text-gray-700 mb-3 pb-3 border-b border-gray-100">
    <span className="font-semibold">Name:</span> {user.name}
</p>

<p className="text-gray-700 mb-3 pb-3 border-b border-gray-100">
    <span className="font-semibold">Email:</span> {user.email}
</p>

<p className="text-gray-700">
    <span className="font-semibold">Role:</span>{" "}
    <span className="text-blue-600 font-semibold">{user.role}</span>
</p>
    </div>
)
}
export default Profile;