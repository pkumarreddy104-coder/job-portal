import { useEffect, useRef, useState } from "react";
import EditJobForm from "../../components/EditJobForm";
import JobForm from "../../components/JobForm";

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
const editFormRef = useRef(null);
useEffect(() => {
    if (editingJob && editFormRef.current) {
        editFormRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}, [editingJob]);
    useEffect(() => {
        const getJobs = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch("https://job-portal-ex9x.onrender.com/jobs/my", {
                headers: {
                    Authorization: token
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            setJobs(data);
            setJobsLoading(false);
        };

        getJobs();
    }, []);
    useEffect(() => {
        const getApplications = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://job-portal-ex9x.onrender.com/applications/recruiter",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            setApplications(data);
            setApplicationsLoading(false);
        };

        getApplications();
    }, []);
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`https://job-portal-ex9x.onrender.com/jobs/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        setJobs(jobs.filter(job => job._id !== id));
    };
    const updateStatus = async (applicationId, status) => {

        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://job-portal-ex9x.onrender.com/applications/${applicationId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        setApplications(
            applications.map(application =>
                application._id === applicationId
                    ? { ...application, status: data.status }
                    : application
            )
        );
    };
    const viewResume = async (applicationId) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://job-portal-ex9x.onrender.com/applications/${applicationId}/resume`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            const data = await response.json();
            alert(data.message);
            return;
        }

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
    };

    return (
       <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold !text-gray-800 mb-8">
                Recruiter Dashboard
            </h1>

            <div className="mb-8">
    <JobForm
        onJobCreated={(newJob) => {
            setJobs([...jobs, newJob]);
        }}
    />
</div>

            <h2 className="text-2xl font-semibold !text-gray-800 mb-4">
                Jobs
            </h2>

            {editingJob && (
        <div ref={editFormRef} className="mb-8">
        <EditJobForm
            job={editingJob}
            onUpdate={(updatedJob) => {
                setJobs(
                    jobs.map(job =>
                        job._id === updatedJob._id
                            ? updatedJob
                            : job
                    )
                );
                setEditingJob(null);
            }}
            onCancel={() => setEditingJob(null)}
        />
    </div>
)}

            {jobsLoading ? (
                <div className="text-center py-8">
                    <p className="text-lg text-gray-500">
                        Loading jobs...
                    </p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-lg text-gray-500">
                        No jobs created yet.
                    </p>
                </div>
            ) : (
                jobs.map(job => (
                    <div
                        key={job._id}
                        className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm"
                    >
                        <h3 className="text-lg font-semibold !text-gray-800 mb-2">
                            {job.title}
                        </h3>

                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Description:</span>{" "}
                            {job.description}
                        </p>

                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Company:</span>{" "}
                            {job.company}
                        </p>

                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Location:</span>{" "}
                            {job.location}
                        </p>

                        <p className="text-green-600 font-semibold mb-4">
                            <span className="text-gray-700">Salary:</span> ₹{job.salary}
                        </p>

                        <button
                            onClick={() => setEditingJob(job)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(job._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
            <h2 className="text-2xl font-semibold !text-gray-800 mt-10 mb-4">
                Applications
            </h2>

            {
                applicationsLoading ? (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-500">
                            Loading applications...
                        </p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-lg text-gray-500">
                            No applications yet.
                        </p>
                    </div>
                ) : (
                    applications.map(application => (
                        <div key={application._id}
                            className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm">
                            <h3 className="text-lg font-semibold !text-gray-800 mb-2">
                                {application.job.title}
                            </h3>

                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Applicant:</span>{" "}
                                {application.applicant.name}
                            </p>

                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Email:</span>{" "}
                                {application.applicant.email}
                            </p>

                            <p className="text-gray-700 mb-4">
                                <span className="font-semibold">Status:</span>{" "}
                                {application.status}
                            </p>
                            <button
    onClick={() => viewResume(application._id)}
    className="bg-gray-700 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-gray-800 transition"
>
    View Resume
</button>

<button
    onClick={() => updateStatus(application._id, "accepted")}
    className="bg-green-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-green-600 transition"
>
    Accept
</button>

<button
    onClick={() => updateStatus(application._id, "rejected")}
    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
>
    Reject
</button>
                        </div>
                    ))
                )}
        </div>
    );
}

export default RecruiterDashboard;