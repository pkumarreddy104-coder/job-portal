import LoginForm from "../components/LoginForm";

function Login(){
   return(
    <div className="max-w-md mx-auto mt-10">
        <h1 className="text-3xl font-bold !text-gray-800 text-center mb-6">
            Login
        </h1>

        <LoginForm/>
    </div>
)
}
export default Login;