import backgroundImage from "../assets/home.png";
function Home() {
   return (
  <div
   className="max-w-3xl mx-auto text-center mt-12 py-16 px-10 bg-cover bg-center bg-white/30 border border-gray-200 rounded-lg shadow-sm"
    style={{ backgroundImage: `url(${backgroundImage})` }}
>
        <h1 className="text-4xl font-bold !text-gray-800 mb-4">
            Job Portal
        </h1>

       <p className="text-gray-600 text-lg max-w-xl mx-auto">
    Find your next job opportunity and take the next step in your career.
</p>
<button
    onClick={() => window.location.href = "/jobs"}
    className="mt-6 bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    Browse Jobs
</button>
    </div>
);
}

export default Home;