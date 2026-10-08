import { useState } from "react";
function SignupForm(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const handleSignUp = async(e)=>{
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
    alert("All fields are required");
    return;
}
if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
}
    setLoading(true);
    const response = await fetch("https://job-portal-ex9x.onrender.com/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password
      })
    });
    const data = await response.json();
    if (!response.ok) {
    setLoading(false);
    alert(data.message);
    return;
}
setLoading(false);
setSuccess("Account created successfully!");

setName("");
setEmail("");
setPassword("");
  
  }
    return(
        <>
           <form
    onSubmit={handleSignUp}
    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
>
        <h2 className="text-2xl font-semibold !text-gray-800 mb-6 text-center">
    Signup
</h2>
       <input
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter Name"
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
      <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter email"
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
       <input
    type="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter Password"
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>
{success && (
    <p className="text-center text-green-600 font-medium mb-4">
        {success}
    </p>
)}
       <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    {loading ? "Creating Account..." : "Signup"}
</button>
<p className="text-center text-gray-600 mt-4">
    Already have an account?{" "}
    <button
        type="button"
        onClick={() => window.location.href = "/login"}
        className="text-blue-500 hover:text-blue-600 font-medium"
    >
        Login
    </button>
</p>
      </form>
        </>
    )
}

export default SignupForm;