import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [newsletter, setNewsletter] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch projects and clients on mount
  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_URL}/clients`);
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/contacts`, formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/newsletter`, { email: newsletter });
      toast.success("Subscribed successfully!");
      setNewsletter("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Trust Build
          </h1>
          <div className="hidden md:flex gap-8 items-center">
            <a
              href="#projects"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Projects
            </a>
            <a
              href="#testimonials"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-slate-600 hover:text-blue-600 transition"
            >
              Contact
            </a>
            <a
              href="/admin"
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-400 text-sm uppercase tracking-widest mb-4">
                Premium Real Estate
              </p>
              <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Find your next
                <br />
                dream property
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Explore handpicked properties in prime locations, curated for
                modern living with exceptional design, comfort, and value.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  href="#projects"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition"
                >
                  Browse Properties
                </a>
                <a
                  href="#contact"
                  className="px-8 py-3 border border-slate-600 hover:border-blue-500 rounded-full font-medium transition"
                >
                  Talk to Expert
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-3xl font-bold">150+</h3>
                  <p className="text-slate-400 text-sm">Properties Sold</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">20+</h3>
                  <p className="text-slate-400 text-sm">Cities Covered</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">4.9★</h3>
                  <p className="text-slate-400 text-sm">Client Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={
                    projects[0]?.image ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt="Modern Apartment"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="projects" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900">
              Featured Properties
            </h3>
            <p className="text-slate-500 hidden md:block">Updated weekly</p>
          </div>

          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  {project.image && (
                    <img src={project.image} alt={project.name} />
                  )}
                  <div className="project-card-content">
                    <p className="text-blue-600 text-sm font-medium mb-2">
                      {project.location || "Premium Location"}
                    </p>
                    <h3>{project.name}</h3>
                    <p className="text-slate-600 mb-4">{project.description}</p>
                    {project.price && (
                      <p className="text-lg font-bold text-slate-900">
                        ₹ {project.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl">
                <p className="text-slate-500">
                  No projects available yet. Add some from the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-slate-900 mb-12">
            What our clients say
          </h3>

          <div className="clients-grid">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div key={client._id} className="client-card">
                  {/* Client Image with fallback */}
                  {client.image ? (
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-600 mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {client.name.charAt(0)}
                    </div>
                  )}

                  <h4 className="text-lg font-semibold text-slate-900">
                    {client.name}
                  </h4>
                  <p className="text-blue-600 text-sm mb-4">
                    {client.designation || "Home Owner"}
                  </p>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{client.testimonial}"
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                <p className="text-slate-500">
                  No testimonials yet. Add clients from the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-slate-900 mb-4 text-center">
            Get in Touch
          </h3>
          <p className="text-slate-600 text-center mb-12">
            Have questions? We're here to help you find your dream property.
          </p>

          <form
            onSubmit={handleContactSubmit}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
          >
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
                rows="5"
                placeholder="Tell us about your requirements..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-blue-100 mb-8">
            Get the latest property listings and real estate news delivered to
            your inbox.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              value={newsletter}
              onChange={(e) => setNewsletter(e.target.value)}
              required
              placeholder="Enter your email"
              className="flex-1"
            />
            <button
              type="submit"
              className="btn bg-white text-blue-600 hover:bg-slate-100"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Trust Build</h4>
              <p className="text-slate-400">
                Your trusted partner in finding the perfect property.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#projects"
                    className="text-slate-400 hover:text-white"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-slate-400 hover:text-white"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-slate-400 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <p className="text-slate-400">Email: info@trustbuild.com</p>
              <p className="text-slate-400">Phone: +91 1234567890</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © {new Date().getFullYear()} Trust Build. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
