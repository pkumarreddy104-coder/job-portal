import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

function Job() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [sortSalary, setSortSalary] = useState("");
    const [totalJobs, setTotaljobs] = useState(0);
    const [page, setPage] = useState(1);
    const getjobs = async (searchValue = search,
        locationValue = location,
        minSalaryValue = minSalary,
        maxSalaryValue = maxSalary,
        sortSalaryValue = sortSalary,
        pageValue = page) => {

        setLoading(true);
        setError("");

        try {
           

            const response = await fetch(`http://localhost:4000/jobs?search=${encodeURIComponent(searchValue)}&location=${encodeURIComponent(locationValue)}&minSalary=${encodeURIComponent(minSalaryValue)}&maxSalary=${encodeURIComponent(maxSalaryValue)}&sortSalary=${encodeURIComponent(sortSalaryValue)}&page=${pageValue}`);

            const data = await response.json();

            setJobs(data.jobs);
            setTotaljobs(data.totalJobs);

        } catch (error) {
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    }
    const totalPages = Math.max(1, Math.ceil(totalJobs / 5));
    useEffect(() => {

        getjobs();
    }, [])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <input type="text" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <input type="text" className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} />
                <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Minimum Salary"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                />

                <input
                    type="number"
                   className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Maximum Salary"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}

                />
                <select
                    value={sortSalary}
                   className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onChange={(e) => setSortSalary(e.target.value)}
                >
                    <option value="">Sort by Salary</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
                <button type="button"
                    className="border border-gray-300 rounded-md px-3 py-2"
                    onClick={() => {
                        setPage(1);
                        getjobs(search, location, minSalary, maxSalary, sortSalary, 1);
                    }}>Search</button>
                <button type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                    onClick={() => {
                        setSearch("");
                        setLocation("");
                        setMinSalary("");
                        setMaxSalary("");
                        setSortSalary("");
                        setPage(1);
                        getjobs("", "", "", "", "", 1);
                    }}>Clear</button>

            </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <button
                    type="button"
                    disabled={page == 1}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    onClick={() => {
                        setPage(page - 1);

                        getjobs(search, location, minSalary, maxSalary, sortSalary, page - 1);
                    }}
                >
                    Previous
                </button>
                <span>page {page} of {totalPages}</span>
                <button
                    type="button"
                    disabled={page == totalPages}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    onClick={() => {
                        setPage(page + 1);
                        getjobs(search, location, minSalary, maxSalary, sortSalary, page + 1);
                    }}
                >
                    Next
                </button>
            </div>



           <h1 className="text-3xl font-bold !text-gray-800 mt-8 mb-6">
    Available Jobs
</h1>

            {loading ? (
                <div className="text-center py-10">
                    <p className="text-lg text-gray-500">
                        Loading jobs...
                    </p>
                </div>
            ) : error ? (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold !text-red-600">
                        {error}
                    </h2>

                    <button
                        onClick={() => getjobs()}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Retry
                    </button>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-10">
                    <h2 className="text-2xl font-semibold !text-gray-700">
                        No jobs found
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Try changing your search or filters.
                    </p>
                </div>
            ) : (
                jobs.map(job => (
                    <JobCard key={job._id} job={job} />
                ))
            )}
        </div>
    )
}
export default Job;