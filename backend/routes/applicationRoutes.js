const express = require('express');
const Application = require('../models/Application');
const auth = require("../auth");
const multer = require("multer");
const Job = require("../models/job");
const router = express.Router();
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});
router.post("/", auth, (req, res, next) => {
    upload.single("resume")(req, res, function (error) {
        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { job } = req.body;
        if (!job) {
            return res.status(400).json({
                message: "Job is required"
            });
        }
        const existingJob = await Job.findById(job);

        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        if (!req.file) {
            return res.status(400).json({
                message: "Resume is required"
            })
        }
        const existingApplication = await Application.findOne({
            job,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }
        const application = await Application.create({
            job,
            applicant: req.user.id,
            resume: req.file.path
        })
        res.status(201).json(application);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        res.status(500).json({
            message: "Failed to apply for job"
        });
    }
})
router.get("/my", auth, async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user.id
        }).populate("job");
        res.json(applications);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get applications"
        })
    }
});
router.get("/recruiter", auth, async (req, res) => {
    try {
        const applications = await Application.find().populate({
            path: "job",
            match: { postedBy: req.user.id }
        }).populate("applicant");
        const filteredApplications = applications.filter(
            application =>
                application.job != null &&
                application.applicant != null
        );
        res.json(filteredApplications);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to get recruiter applications"
        });
    }
})
router.get("/check/:jobId", auth, async (req, res) => {
    try {
        const application = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user.id
        });

        if (application) {
            return res.json({
                applied: true
            });
        }

        res.json({
            applied: false
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to check application"
        });
    }
});
router.patch("/:id/status", auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const application = await Application.findById(req.params.id)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }
        if (!application.job) {
            return res.status(404).json({
                message: "Job no longer exists"
            });
        }

        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this application"
            });
        }

        application.status = status;

        await application.save();

        res.json(application);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update application status"
        });
    }
});
router.get("/:id/resume", auth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }
        if (!application.job) {
    return res.status(404).json({
        message: "Job no longer exists"
    });
}

        if (
            application.job.postedBy.toString() !== req.user.id &&
            application.applicant.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: "You are not allowed to access this resume"
            });
        }

        res.sendFile(path.resolve(application.resume));

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to access resume"
        });
    }
});

module.exports = router;