import { useEffect, useRef, useState } from "react";
import EditJobForm from "../../components/EditJobForm";
import AdminJobForm from "../../components/AdminJobForm";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const editFormRef = useRef(null);
    const handleJobCreated = (newJob) => {
        setJobs([...jobs, newJob]);
    };

    useEffect(() => {
        const getUsers = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch("https://job-portal-ex9x.onrender.com/admin/users", {
                headers: {
                    Authorization: token
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            const data = await response.json();
            setUsers(data);
        };

        getUsers();
    }, []);
    useEffect(() => {
        const getJobs = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch("https://job-portal-ex9x.onrender.com/admin/jobs", {
                headers: {
                    Authorization: token
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            const data = await response.json();
            setJobs(data);
        };

        getJobs();
    }, []);
    useEffect(() => {
    if (editingJob && editFormRef.current) {
        editFormRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}, [editingJob]);
    const deleteUser = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://job-portal-ex9x.onrender.com/admin/users/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        setUsers(
            users.filter(user => user._id !== id)
        );
    };
    const deleteJob = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://job-portal-ex9x.onrender.com/admin/jobs/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        setJobs(
            jobs.filter(job => job._id !== id)
        );
    };
    const updateRole = async (id, role) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `https://job-portal-ex9x.onrender.com/admin/users/${id}/role`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    role: role
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        setUsers(
            users.map(user =>
                user._id === id
                    ? data
                    : user
            )
        );
    };
    return (
        <>
           <h1 className="text-3xl font-bold !text-gray-800 mb-8">
    Admin Dashboard
</h1>

           <h2 className="text-2xl font-semibold !text-gray-800 mb-4">
    User Management
</h2>

            {users.map(user => (
               <div
    key={user._id}
    className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm"
>
                   <p className="text-gray-700 mb-2">
    <span className="font-semibold">Name:</span> {user.name}
</p>

<p className="text-gray-700 mb-2">
    <span className="font-semibold">Email:</span> {user.email}
</p>

<p className="text-gray-700 mb-4">
    <span className="font-semibold">Role:</span> {user.role}
</p>
                   <button
    onClick={() => updateRole(user._id, "user")}
    className="bg-blue-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-blue-600 transition"
>
    Make User
</button>

<button
    onClick={() => updateRole(user._id, "recruiter")}
    className="bg-purple-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-purple-600 transition"
>
    Make Recruiter
</button>
                    <button
    onClick={() => deleteUser(user._id)}
    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
>
    Delete
</button>

                    
                </div>
            ))}
           {editingJob && (
     <div ref={editFormRef} className="mb-8">
        <EditJobForm
            job={editingJob}
            isAdmin={true}
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
            
            <div className="mb-8">
    <AdminJobForm onJobCreated={handleJobCreated} />
</div>

           <h2 className="text-2xl font-semibold !text-gray-800 mt-10 mb-4">
    Job Management
</h2>

            {jobs.map(job => (
               <div
    key={job._id}
    className="bg-white border border-gray-200 rounded-lg p-5 mb-4 shadow-sm"
>
                    <p className="text-lg font-semibold !text-gray-800 mb-2">
    {job.title}
</p>
                   <p className="text-gray-700 mb-2">
    <span className="font-semibold">Company:</span> {job.company}
</p>

<p className="text-gray-700 mb-2">
    <span className="font-semibold">Location:</span> {job.location}
</p>

<p className="text-green-600 font-semibold mb-4">
    Salary: ₹{job.salary}
</p>
                    <button
    onClick={() => setEditingJob(job)}
    className="bg-blue-500 text-white px-3 py-1.5 rounded-md mr-2 hover:bg-blue-600 transition"
>
    Edit
</button>
                   <button
    onClick={() => deleteJob(job._id)}
    className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition"
>
    Delete
</button>

                    
                </div>
            ))}
        </>
    );
}

export default AdminDashboard;