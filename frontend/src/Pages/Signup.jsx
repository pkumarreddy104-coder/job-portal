import SignupForm from "../components/SignupForm";

function Signup(){
   return(
   <div className="max-w-md mx-auto mt-12">
        <h1 className="text-3xl font-bold !text-gray-800 text-center mb-6">
            Create Account
        </h1>

        <SignupForm/>
    </div>
)
}
export default Signup;