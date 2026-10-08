import { useState } from "react";

function EditJobForm({job, onUpdate, onCancel, isAdmin }) {
    const [title, setTitle] = useState(job.title);
    const [description, setDescription] = useState(job.description);
    const [company, setCompany] = useState(job.company);
    const [location, setLocation] = useState(job.location);
    const [salary, setSalary] = useState(job.salary);

    const handleUpdate = async (e) => {
        e.preventDefault();
       if (salary === "") {
    alert("All fields are required");
    return;
}

if (Number(salary) <= 0) {
    alert("Salary must be greater than 0");
    return;
}

        const token = localStorage.getItem("token");

        const response = await fetch(
    isAdmin
        ? `https://job-portal-ex9x.onrender.com/admin/jobs/${job._id}`
        : `https://job-portal-ex9x.onrender.com/jobs/${job._id}`,
    {
        method: isAdmin ? "PATCH" : "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            title,
            description,
            company,
            location,
            salary
        })
    }
);

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

        onUpdate(isAdmin ? data : data.job);
    };

    return (
        <form
    onSubmit={handleUpdate}
    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
>
            <h2 className="text-2xl font-semibold !text-gray-800 mb-6 text-center">
    Edit Job
</h2>

            <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
/>

           <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 min-h-28 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
/>

            <input
                type="text"
                value={company}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setCompany(e.target.value)}
            />

            <input
                type="text"
                value={location}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setLocation(e.target.value)}
            />

            <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
    type="submit"
    className="bg-blue-500 text-white px-5 py-2 rounded-md mr-2 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
>
    Update Job
</button>

           <button
    type="button"
    onClick={onCancel}
    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition"
>
    Cancel
</button>
        </form>
    );
}

export default EditJobForm;