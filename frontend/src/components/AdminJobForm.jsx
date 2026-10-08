import { useState } from "react";

function AdminJobForm({ onJobCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
 if (Number(salary) <= 0) {
    alert("Salary must be greater than 0");
    return;
}
        const token = localStorage.getItem("token");
       

        const response = await fetch("https://job-portal-ex9x.onrender.com/admin/jobs", {
            method: "POST",
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

        onJobCreated(data);

        setTitle("");
        setDescription("");
        setCompany("");
        setLocation("");
        setSalary("");
    };

    return (
    <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
        <h2 className="text-2xl font-semibold !text-gray-800 mb-6 text-center">
            Create Job
        </h2>

        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 min-h-28 resize-y focus:outline-none focus:ring-2 focus:ring-blue-300"
        ></textarea>

        <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2.5 rounded-md hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
            Create Job
        </button>
    </form>
);
}

export default AdminJobForm;