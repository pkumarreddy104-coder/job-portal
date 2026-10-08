import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [applied, setApplied] = useState(false);
  useEffect(() => {
    const getjob = async () => {
      const response = await fetch(`https://job-portal-ex9x.onrender.com/jobs/${id}`);
      const data = await response.json();
      setJob(data);
    }
    const checkApplication = async () => {

      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await fetch(
        `https://job-portal-ex9x.onrender.com/applications/check/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      );

      const data = await response.json();

      setApplied(data.applied);
    };
    getjob();
    checkApplication();
  }, [id]
  )
  const applyForJob = async () => {
    if (!resume) {
      alert("Please select your resume");
      return;
    }

    const formData = new FormData();

    formData.append("job", id);
    formData.append("resume", resume);

    const token = localStorage.getItem("token");
    if (!token) {
  alert("Please login to apply");
  return;
}

    const response = await fetch("https://job-portal-ex9x.onrender.com/applications", {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData
    });

    const data = await response.json();

    if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
}


if (!response.ok) {
    alert(data.message);
    return;
}


setApplied(true);
setResume(null);
  };

if (!job) {
    return (
        <div className="text-center py-10">
            <p className="text-lg text-gray-500">
                Loading job details...
            </p>
        </div>
    )
}

  
    return (
    <div className="max-w-3xl mx-auto mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold !text-gray-800 mb-6">
            {job.title}
        </h1>

       <p className="text-gray-700 mb-3">
    <span className="font-semibold">Company:</span> {job.company}
</p>

<p className="text-gray-700 mb-3">
    <span className="font-semibold">Location:</span> {job.location}
</p>

<p className="text-green-600 font-semibold mb-4">
    <span className="text-gray-700">Salary:</span> ₹{job.salary}
</p>

<div className="border-t border-gray-100 pt-4 mb-6">
    <p className="text-gray-700 leading-relaxed">
        <span className="font-semibold">Description:</span>{" "}
        {job.description}
    </p>
</div>
     <input
  type="file"
  accept="application/pdf"
  className="w-full border border-gray-300 rounded-md px-3 py-3 mb-4 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      e.target.value = "";
      setResume(null);
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      alert("Resume must be less than 5 MB");
      e.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
  }}
/>
{resume && (
    <p className="text-sm text-gray-600 mb-4">
        Selected resume: <span className="font-medium">{resume.name}</span>
    </p>
)}
      <button
    onClick={applyForJob}
    disabled={applied}
    className="bg-blue-500 text-white px-6 py-2.5 rounded-md hover:bg-blue-600 hover:scale-105 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    {applied ? "Already Applied" : "Apply Now"}
</button>
    </div>
)
      
      

  
}
export default JobDetails;