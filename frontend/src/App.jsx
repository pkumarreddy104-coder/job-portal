import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Job from "./Pages/Job";
import JobDetails from "./Pages/JobDetails";
import Profile from "./Pages/Profile";
import RecruiterDashboard from "./Pages/recruiter/RecruiterDashboard";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import MyApplications from "./Pages/MyApplications";


function App() {
  

  return (
    <>
    <BrowserRouter>
      <Navbar/>
    <Routes>
    
      <Route path="/" element={<Home/>}/>
      
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/jobs" element={<Job/>}/>
      <Route path="/jobs/:id" element={<JobDetails/>}/>
     <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>
   <Route
    path="/recruiter/dashboard"
    element={
        <RoleRoute allowedRoles={["recruiter", "admin"]}>
            <RecruiterDashboard />
        </RoleRoute>
    }
/>
    <Route
    path="/admin/dashboard"
    element={
        <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
        </RoleRoute>
    }
/>
<Route
  path="/applications"
  element={
    <ProtectedRoute>
      <MyApplications />
    </ProtectedRoute>
  }
/>
      
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
