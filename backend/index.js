require("dotenv").config({ path: __dirname + "/.env" });

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const User = require("./models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes")

const app = express();
const auth = require('./auth');
const admin = require('./admin');
const requireRole = require('./requireRole');
const Application = require('./models/Application');
const Job = require('./models/job');
app.use(express.json());
app.use(cors());
app.use("/jobs", jobRoutes);
app.use("/applications",applicationRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database Connected")
}).catch((err) => {
    console.log("Error Occured", err);
})


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log("register is ", user);

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({
            message: "Registration failed"
        });
    }
});


app.post("/login", async (req, res) => {
    const { email,password} = req.body;
    const user = await User.findOne({
        email
    })
    if (!user) {
    return res.status(401).json({
        message: "Invalid email or password"
    });
}

    const isMatch = await bcrypt.compare(password,user.password);
    if(isMatch){
        console.log("Worked");
        const token = jwt.sign(
           {id:user._id,role:user.role},
           "mysecretkey",
           {expiresIn:"1h"}
        );
        res.json({
            massage:"VAlid",
            token:token
        })
    }else{
         console.log(" not Worked")
          res.json({
            massage:"INVAlid"
        })
    }

})
app.get("/profile",auth,async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json({
        message:"You are Authorised",
        user
    })
})

app.get("/admin", auth, admin, (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
});
app.get("/admin/users", auth, requireRole("admin"), async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to get users"
        });
    }
});
app.get("/admin/jobs", auth, requireRole("admin"), async (req, res) => {
    try {
        const jobs = await Job.find();

        res.json(jobs);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to get jobs"
        });
    }
});
app.delete("/admin/users/:id", auth, requireRole("admin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user._id.toString() === req.user.id.toString()) {
    return res.status(400).json({
        message: "You cannot delete your own admin account"
    });
}

        if (user.role === "admin") {
            return res.status(400).json({
                message: "Admin users cannot be deleted"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete user"
        });
    }
});
app.delete("/admin/jobs/:id", auth, requireRole("admin"), async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);

        res.json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to delete job"
        });
    }
});
app.patch("/admin/users/:id/role", auth, requireRole("admin"), async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "recruiter", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "Admin users cannot have their role changed"
            });
        }

        user.role = role;
        await user.save();

        const updatedUser = await User.findById(user._id).select("-password");

        res.json(updatedUser);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update user role" });
    }
});
app.patch("/admin/jobs/:id", auth, requireRole("admin"), async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;

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

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        if (Number(salary) <= 0) {
    return res.status(400).json({
        message: "Salary must be greater than 0"
    });
}

        res.json(job);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update job"
        });
    }
});
app.post("/admin/jobs", auth, requireRole("admin"), async (req, res) => {
    try {
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

        res.status(201).json(job);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create job" });
    }
});
app.get("/test", (req, res) => {
    res.send("Server is working");
});

app.listen("4000", () => {
    console.log("Server is running on 4000 Port")
})