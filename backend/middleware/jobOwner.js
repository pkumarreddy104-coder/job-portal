const Job = require("../models/job");

const jobOwner = async (req, res, next) => {

    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    // Admin can modify any job
    if (req.user.role === "admin") {
        req.job = job;
        return next();
    }

    // Recruiter can modify only their own job
    if (job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You can only modify your own jobs"
        });
    }

    req.job = job;

    next();
};

module.exports = jobOwner;