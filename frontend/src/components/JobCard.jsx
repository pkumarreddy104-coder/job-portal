import { useNavigate } from "react-router-dom";
function JobCard({job}){
    const navigate = useNavigate();
    return(
      <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-7 mb-5 shadow-sm hover:shadow-md hover:border-gray-300 transition">
          <h2 className="text-xl font-bold !text-gray-800 mb-3">
    {job.title}
</h2>
           <p className="text-gray-600 mb-2 leading-relaxed">
    <span className="font-medium">Description:</span> {job.description}
</p>
<p className="text-gray-600 mb-2">
    <span className="font-semibold">Company:</span> {job.company}
</p>

<p className="text-gray-600 mb-2">
    <span className="font-semibold">Location:</span> {job.location}
</p>
<p className="text-green-600 font-semibold mb-4">
    <span className="text-gray-700">Salary:</span> ${job.salary}
</p>
            <button
    onClick={() => navigate(`/jobs/${job._id}`)}
   className="bg-blue-500 text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    View Details
</button>
        </div>
    )
}
export default JobCard;