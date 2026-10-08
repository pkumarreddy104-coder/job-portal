const express = require("express");
const Job = require("../models/job");
const auth = require("../auth");
const requireRole = require("../requireRole");
const jobOwner = require("../middleware/jobOwner");
const job = require("../models/job");

const router = express.Router();


// CREATE JOB
router.post("/", auth, requireRole("admin", "recruiter"), async (req, res) => {

    const { title, description, company, location, salary } = req.body;

    if (
        !title?.trim() ||
        !description?.trim() ||
        !company?.trim() ||
        !location?.trim() ||
        !salary
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (Number(salary) <= 0) {
        return res.status(400).json({
            message: "Salary must be greater than 0"
        });
    }

    const job = await Job.create({
        title,
        description,
        company,
        location,
        salary,
        postedBy: req.user.id
    });

    res.status(201).json({
        message: "Job created successfully",
        job
    });
});


// GET ALL JOBS
router.get("/", async (req, res) => {
    const search = req.query.search?.trim();
    const location = req.query.location?.trim();
    const minSalary = req.query.minSalary;
    const maxSalary = req.query.maxSalary;
    const sortSalary = req.query.sortSalary;
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let jobs;
    let query = {};
    if (search) {

        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }

        ]

    }

    if (location) {

        query.location = { $regex: location, $options: "i" }
    }
    if (minSalary || maxSalary) {
        query.salary = {};

        if (minSalary) {
            query.salary.$gte = Number(minSalary);
        }

        if (maxSalary) {
            query.salary.$lte = Number(maxSalary);
        }
    }
    let sort = {};

    if (sortSalary === "asc") {
        sort.salary = 1;
    }

    if (sortSalary === "desc") {
        sort.salary = -1;
    }

    totalJobs = await Job.countDocuments(query);
    jobs = await Job.find(query).sort(sort).skip(skip).limit(limit);


    res.json({ jobs, totalJobs });
});
router.get("/my", auth, requireRole("admin", "recruiter"), async (req, res) => {
    const jobs = await Job.find({
        postedBy: req.user.id
    });

    res.json(jobs);
});

// GET ONE JOB
router.get("/:id", async (req, res) => {

    const job = await Job.findById(req.params.id);

    res.json(job);
});


// UPDATE JOB
router.put(
    "/:id",
    auth,
    requireRole("admin", "recruiter"),
    jobOwner,
    async (req, res) => {
     console.log(req.body);
        const {
            title,
            description,
            company,
            location,
            salary
        } = req.body;
        

        if (
            !title?.trim() ||
            !description?.trim() ||
            !company?.trim() ||
            !location?.trim() ||
            salary === "" ||
            salary === undefined ||
            salary === null
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (Number(salary) <= 0) {
            return res.status(400).json({
                message: "Salary must be greater than 0"
            });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                company,
                location,
                salary
            },
            { returnDocument: "after" }
        );

        res.json({
            message: "Job updated successfully",
            job
        });
    }
);


// DELETE JOB
router.delete(
    "/:id",
    auth,
    requireRole("admin", "recruiter"),
    jobOwner,
    async (req, res) => {

        await Job.findByIdAndDelete(req.params.id);

        res.json({
            message: "Job deleted successfully"
        });
    }
);


module.exports = router;