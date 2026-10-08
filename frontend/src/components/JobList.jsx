import JobCard from "./JobCard";

function JobList(){
    return(
        <div>
            <h1>Available Jobs</h1>
            <JobCard/>
            <JobCard/>
            <JobCard/>
        </div>
    )
}

export default JobList;