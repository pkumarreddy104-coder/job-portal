import { useState } from "react";
import { useNavigate } from "react-router-dom";
function LoginForm(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async(e)=>{
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
    alert("Email and password are required");
    return;
}
        setLoading(true);
        const response = await fetch("https://job-portal-ex9x.onrender.com/login",{
                method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                    email,
                    password
            })
            
        
            }
           
        )
         const data = await response.json();
           
            if (!data.token) {
    alert("Invalid email or password");
    setLoading(false);
    return;
}
            localStorage.setItem("token", data.token);
window.dispatchEvent(new Event("login"));

const payload = JSON.parse(atob(data.token.split(".")[1]));

if (payload.role === "admin") {
    navigate("/admin/dashboard");
} else if (payload.role === "recruiter") {
    navigate("/recruiter/dashboard");
} else {
    navigate("/jobs");
}
    }
    return(
        <>
    <form
    onSubmit={handleLogin}
    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
>
          <h2 className="text-2xl font-semibold !text-gray-800 mb-6 text-center">
    Login
</h2>
      <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email"
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
       <input
    type="Password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
        <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    {loading ? "Logging in..." : "Login"}
</button>
<p className="text-center text-gray-600 mt-4">
    Don't have an account?{" "}
    <button
        type="button"
        onClick={() => navigate("/signup")}
        className="text-blue-500 hover:text-blue-600 font-medium"
    >
        Signup
    </button>
</p>
     </form>
        </>
    )
}
export default LoginForm;