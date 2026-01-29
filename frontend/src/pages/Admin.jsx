import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for all data
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newsletter, setNewsletter] = useState([]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    image: null,
  });
  const [clientForm, setClientForm] = useState({
    name: "",
    designation: "",
    testimonial: "",
    image: null,
  });
  const [editingProject, setEditingProject] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all data on mount
  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchContacts();
    fetchNewsletter();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_URL}/clients`);
      setClients(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/contacts`);
      setContacts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNewsletter = async () => {
    try {
      const res = await axios.get(`${API_URL}/newsletter`);
      setNewsletter(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Project CRUD
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", projectForm.name);
    formData.append("description", projectForm.description);
    formData.append("location", projectForm.location);
    formData.append("price", projectForm.price);
    if (projectForm.image) formData.append("image", projectForm.image);

    try {
      if (editingProject) {
        await axios.put(`${API_URL}/projects/${editingProject}`, formData);
        toast.success("Project updated successfully!");
        setEditingProject(null);
      } else {
        await axios.post(`${API_URL}/projects`, formData);
        toast.success("Project added successfully!");
      }
      setProjectForm({
        name: "",
        description: "",
        location: "",
        price: "",
        image: null,
      });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to save project");
      console.error(error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        toast.success("Project deleted!");
        fetchProjects();
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name,
      description: project.description,
      location: project.location || "",
      price: project.price || "",
      image: null,
    });
    setEditingProject(project._id);
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();

    // Validate
    if (
      !clientForm.name ||
      !clientForm.designation ||
      !clientForm.testimonial
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // 🔍 DEBUG: Check what's in clientForm
    console.log("📝 Client Form Data:", clientForm);
    console.log("   Name:", clientForm.name);
    console.log("   Designation:", clientForm.designation);
    console.log("   Testimonial:", clientForm.testimonial);
    console.log("   Image:", clientForm.image);

    const formData = new FormData();
    formData.append("name", clientForm.name.trim());
    formData.append("designation", clientForm.designation.trim());
    formData.append("testimonial", clientForm.testimonial.trim());

    // 🔍 DEBUG: Check FormData
    console.log("📦 FormData contents:");
    for (let pair of formData.entries()) {
      console.log(`   ${pair[0]}:`, pair[1]);
    }

    if (clientForm.image) {
      formData.append("image", clientForm.image);
    }

    try {
      const response = await axios.post(`${API_URL}/clients`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Client added successfully!");

      // Reset form
      setClientForm({
        name: "",
        designation: "",
        testimonial: "",
        image: null,
      });

      // Reset file input
      const fileInput = document.querySelector('input[name="clientImage"]');
      if (fileInput) fileInput.value = "";

      fetchClients();
    } catch (error) {
      console.error("Full error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to add client");
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`${API_URL}/clients/${id}`);
        toast.success("Client deleted!");
        fetchClients();
      } catch (error) {
        toast.error("Failed to delete client");
      }
    }
  };

  // Contact & Newsletter Delete
  const handleDeleteContact = async (id) => {
    if (window.confirm("Delete this contact?")) {
      try {
        await axios.delete(`${API_URL}/contacts/${id}`);
        toast.success("Contact deleted!");
        fetchContacts();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleDeleteNewsletter = async (id) => {
    if (window.confirm("Delete this subscriber?")) {
      try {
        await axios.delete(`${API_URL}/newsletter/${id}`);
        toast.success("Subscriber deleted!");
        fetchNewsletter();
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const tabs = [
    { id: "dashboard", name: "Overview" },
    { id: "projects", name: "Projects" },
    { id: "clients", name: "Clients" },
    { id: "contacts", name: "Contacts" },
    { id: "newsletter", name: "Newsletter" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Projects Management</h2>

            {/* Add/Edit Project Form */}
            <div className="card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    required
                    rows="3"
                  ></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={projectForm.location}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={projectForm.price}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? "Update Project" : "Add Project"}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          name: "",
                          description: "",
                          location: "",
                          price: "",
                          image: null,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Projects Table */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">All Projects</h3>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td>
                          {project.image && (
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                        </td>
                        <td className="font-medium">{project.name}</td>
                        <td>{project.location || "N/A"}</td>
                        <td>
                          {project.price
                            ? `₹${project.price.toLocaleString("en-IN")}`
                            : "N/A"}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-secondary px-3 py-1 text-sm"
                              onClick={() => handleEditProject(project)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger px-3 py-1 text-sm"
                              onClick={() => handleDeleteProject(project._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "clients":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Clients Management</h2>

            {/* Add Client Form */}
            <div className="card p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Add New Client</h3>
              <form onSubmit={handleClientSubmit} className="space-y-4">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    type="text"
                    value={clientForm.name}
                    onChange={(e) =>
                      setClientForm({ ...clientForm, name: e.target.value })
                    }
                    required
                    placeholder="Enter client name"
                  />
                </div>

                <div className="form-group">
                  <label>Designation *</label>
                  <input
                    type="text"
                    value={clientForm.designation}
                    onChange={(e) =>
                      setClientForm({
                        ...clientForm,
                        designation: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g., Home Owner, CEO"
                  />
                </div>

                <div className="form-group">
                  <label>Testimonial *</label>
                  <textarea
                    value={clientForm.testimonial}
                    onChange={(e) =>
                      setClientForm({
                        ...clientForm,
                        testimonial: e.target.value,
                      })
                    }
                    required
                    rows="4"
                    placeholder="Client's feedback..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Client Photo</label>
                  <input
                    type="file"
                    name="clientImage"
                    accept="image/*"
                    onChange={(e) =>
                      setClientForm({ ...clientForm, image: e.target.files[0] })
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Add Client
                </button>
              </form>
            </div>

            {/* Clients Grid */}
            <div className="clients-grid">
              {clients.map((client) => (
                <div key={client._id} className="client-card">
                  {client.image && <img src={client.image} alt={client.name} />}
                  <h4>{client.name}</h4>
                  <p className="text-blue-600 text-sm mb-3">
                    {client.designation}
                  </p>
                  <p className="text-slate-700 italic mb-4">
                    "{client.testimonial}"
                  </p>
                  <button
                    className="btn btn-danger text-sm"
                    onClick={() => handleDeleteClient(client._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "contacts":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Submissions</h2>
            <div className="card p-6">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="font-medium">{contact.name}</td>
                      <td>{contact.email}</td>
                      <td className="max-w-xs truncate">{contact.message}</td>
                      <td>
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger px-3 py-1 text-sm"
                          onClick={() => handleDeleteContact(contact._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "newsletter":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Newsletter Subscribers</h2>
            <div className="card p-6">
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Subscribed On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.map((sub) => (
                    <tr key={sub._id}>
                      <td className="font-medium">{sub.email}</td>
                      <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-danger px-3 py-1 text-sm"
                          onClick={() => handleDeleteNewsletter(sub._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Projects</p>
                <h3>{projects.length}</h3>
              </div>
              <div className="stat-card">
                <p>Active Clients</p>
                <h3>{clients.length}</h3>
              </div>
              <div className="stat-card">
                <p>Contact Submissions</p>
                <h3>{contacts.length}</h3>
              </div>
              <div className="stat-card">
                <p>Newsletter Subscribers</p>
                <h3>{newsletter.length}</h3>
              </div>
            </div>

            <div className="card p-6 mt-8">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveTab("projects")}
                >
                  + Add Project
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setActiveTab("clients")}
                >
                  + Add Client
                </button>
                <a href="/" className="btn btn-secondary">
                  View Website
                </a>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">RealTrust</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="admin-content">
        {/* Mobile menu button */}
        <button
          className="md:hidden mb-4 p-2 bg-slate-900 text-white rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          Menu
        </button>

        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
