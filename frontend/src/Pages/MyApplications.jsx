import { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
const viewResume = async (applicationId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:4000/applications/${applicationId}/resume`,
    {
      headers: {
        Authorization: token
      }
    }
  );

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");
};
  useEffect(() => {
    const getApplications = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:4000/applications/my",
        {
          headers: {
            Authorization: token
          }
        }
      );

     const data = await response.json();

if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
}

setApplications(data);
    };

    getApplications();
  }, []);

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
  <p>You haven't applied for any jobs yet.</p>
) : (
  applications.map((application) => (
    <div key={application._id}>
      <h2>{application.job.title}</h2>
      <p>Company: {application.job.company}</p>
      <p>Status: {application.status}</p>
     <button onClick={() => viewResume(application._id)}>
  View Resume
</button>
    </div>
  ))
)}
    </div>
  );
}

export default MyApplications;