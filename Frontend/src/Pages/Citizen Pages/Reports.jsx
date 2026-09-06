import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import CitizenNavbar from "../../Component/Citizen Component/Navar.jsx";
import CitizenSidebar from "../../Component/Citizen Component/Sidebar.jsx";

import {
  FileText,
  MapPin,
  Camera,
  Clock3,
  CheckCircle,
  AlertTriangle,
  Search,
  X,
  Send,
  ChevronRight,
  Loader2,
  Navigation,
  Trash2,
} from "lucide-react";

// =====================================================
// API CONFIG
// =====================================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// =====================================================
// REPORT TYPES
// =====================================================

const reportTypes = [
  {
    value: "landslide",
    label: "Landslide",
  },
  {
    value: "road_blockage",
    label: "Road Blockage",
  },
  {
    value: "flood",
    label: "Flash Flood",
  },
  {
    value: "slop_failure",
    label: "Slope Failure",
  },
  {
    value: "other",
    label: "Other",
  },
];

// =====================================================
// FILTERS
// =====================================================

const reportFilters = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

const CitizenReports = () => {
  const darkMode = useSelector((state) => state.theme?.darkMode || false);

  // ===================================================
  // UI STATES
  // ===================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [successReportId, setSuccessReportId] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [loadingReports, setLoadingReports] = useState(true);

  const [gettingLocation, setGettingLocation] = useState(false);

  // ===================================================
  // FORM STATES
  // ===================================================

  const [reportType, setReportType] = useState("landslide");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  // ===================================================
  // IMAGE
  // ===================================================

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  // ===================================================
  // REPORT LIST
  // ===================================================

  const [reports, setReports] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  const [search, setSearch] = useState("");

  // ===================================================
  // DARK MODE
  // ===================================================

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ===================================================
  // FETCH MY REPORTS
  // ===================================================

  const fetchMyReports = async () => {
    try {
      setLoadingReports(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your reports.");
        return;
      }

      const response = await fetch(`${API_URL}/reports/my-reports`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports.");
      }

      setReports(data.reports || []);
    } catch (err) {
      console.error("FETCH REPORTS ERROR:", err);

      setError(err.message || "Unable to load your reports.");
    } finally {
      setLoadingReports(false);
    }
  };

  // ===================================================
  // LOAD REPORTS
  // ===================================================

  useEffect(() => {
    fetchMyReports();
  }, []);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ===================================================
  // IMAGE SELECT
  // ===================================================

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImage(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));

    setError("");
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = () => {
    setImage(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
  };

  // ===================================================
  // CURRENT LOCATION
  // ===================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");

      return;
    }

    setGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setGettingLocation(false);
      },

      (locationError) => {
        console.error("LOCATION ERROR:", locationError);

        setGettingLocation(false);

        if (locationError.code === 1) {
          setError("Location permission denied. Please allow location access.");
        } else if (locationError.code === 2) {
          setError("Location is currently unavailable.");
        } else {
          setError("Unable to get your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ===================================================
  // SUBMIT REPORT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setShowSuccess(false);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before submitting a report.");

      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError(
        "Please provide the incident location using your current location.",
      );

      return;
    }

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);

    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      setError("Invalid latitude.");
      return;
    }

    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      setError("Invalid longitude.");
      return;
    }

    try {
      setSubmitting(true);

      const body = new FormData();

      body.append("title", formData.title.trim());

      body.append("description", formData.description.trim());

      body.append("reportType", reportType);

      body.append("latitude", formData.latitude);

      body.append("longitude", formData.longitude);

      if (image) {
        body.append("image", image);
      }

      const response = await fetch(`${API_URL}/reports`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit incident report.");
      }

      // SUCCESS

      setShowSuccess(true);

      const generatedId = data.report?._id
        ? `RPT-${data.report._id.slice(-6).toUpperCase()}`
        : "REPORT SUBMITTED";

      setSuccessReportId(generatedId);

      // RESET FORM

      setFormData({
        title: "",
        description: "",
        latitude: "",
        longitude: "",
      });

      setReportType("landslide");

      removeImage();

      // REFRESH

      await fetchMyReports();

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("SUBMIT REPORT ERROR:", err);

      setError(
        err.message || "Something went wrong while submitting the report.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // FILTER REPORTS
  // ===================================================

  const filteredReports = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesFilter =
        activeFilter === "all" || report.status === activeFilter;

      const matchesSearch =
        report.title?.toLowerCase().includes(searchText) ||
        report.description?.toLowerCase().includes(searchText) ||
        report.reportType?.toLowerCase().includes(searchText) ||
        report._id?.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [reports, activeFilter, search]);

  // ===================================================
  // IMAGE BASE URL
  // ===================================================

  const imageBaseURL = API_URL.replace("/api", "");

  // ===================================================
  // JSX
  // ===================================================

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0b1c15] text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* =================================================
          NAVBAR
      ================================================= */}

      <CitizenNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <CitizenSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="pt-[68px] md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>

              <span className="text-sm font-semibold text-green-500">
                CITIZEN REPORTING
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Report an Incident
            </h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Help authorities identify and respond to landslides, road
              blockages and other hazards.
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />

              <div className="flex-1">
                <p className="text-sm font-bold text-red-500">
                  Something went wrong
                </p>

                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-slate-400 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {showSuccess && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />

              <div className="flex-1">
                <p className="text-sm font-bold text-green-500">
                  Report submitted successfully
                </p>

                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Your report has been sent for verification.
                </p>

                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Report ID:
                  <span className="ml-1 font-semibold text-green-500">
                    {successReportId}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="text-slate-400 hover:text-green-400"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* =================================================
              TOP SECTION
          ================================================= */}

          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            {/* =================================================
                REPORT FORM
            ================================================= */}

            <section
              className={`rounded-2xl border p-5 sm:p-6 shadow-xl transition-colors duration-300 ${
                darkMode
                  ? "bg-[#0f241b] border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <FileText className="w-5 h-5 text-green-500" />
                </div>

                <div>
                  <h2 className="font-bold">New Incident Report</h2>

                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Provide accurate information about the incident.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* INCIDENT TYPE */}

                <div>
                  <label className="text-sm font-semibold">Incident Type</label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {reportTypes.map((type) => (
                      <button
                        type="button"
                        key={type.value}
                        onClick={() => setReportType(type.value)}
                        className={`rounded-xl border p-3 text-xs font-semibold transition ${
                          reportType === type.value
                            ? "border-green-500 bg-green-500/10 text-green-500"
                            : darkMode
                              ? "border-white/10 bg-[#07140f] text-slate-400 hover:bg-[#143326]"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TITLE */}

                <div>
                  <label className="text-sm font-semibold">Report Title</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="Example: Landslide near main road"
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      darkMode
                        ? "bg-[#07140f] border-white/10 text-white placeholder:text-slate-600 focus:border-green-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                    }`}
                  />
                </div>

                {/* LOCATION */}

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      Incident Location
                    </label>

                    {formData.latitude && formData.longitude && (
                      <span className="text-[10px] font-semibold text-green-500">
                        ✓ Location captured
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {/* LATITUDE */}

                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                      />

                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                        placeholder="Latitude"
                        className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                          darkMode
                            ? "bg-[#07140f] border-white/10 text-white placeholder:text-slate-600 focus:border-green-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                        }`}
                      />
                    </div>

                    {/* LONGITUDE */}

                    <div className="relative">
                      <Navigation
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                      />

                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                        placeholder="Longitude"
                        className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${
                          darkMode
                            ? "bg-[#07140f] border-white/10 text-white placeholder:text-slate-600 focus:border-green-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* CURRENT LOCATION */}

                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-500 hover:underline disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <MapPin size={14} />
                    )}

                    {gettingLocation
                      ? "Detecting location..."
                      : "Use my current location"}
                  </button>
                </div>

                {/* DESCRIPTION */}

                <div>
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold">Description</label>

                    <span className="text-[10px] text-slate-500">
                      {formData.description.length}
                      /500
                    </span>
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={500}
                    required
                    rows={5}
                    placeholder="Describe what you observed..."
                    className={`mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none ${
                      darkMode
                        ? "bg-[#07140f] border-white/10 text-white placeholder:text-slate-600 focus:border-green-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                    }`}
                  />
                </div>

                {/* IMAGE */}

                <div>
                  <label className="text-sm font-semibold">
                    Upload Image
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      (Optional)
                    </span>
                  </label>

                  {!image ? (
                    <label
                      className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 transition ${
                        darkMode
                          ? "border-white/10 bg-[#07140f] hover:bg-[#143326]"
                          : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                        <Camera className="w-5 h-5 text-green-500" />
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Upload incident image
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImage}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div
                      className={`mt-2 rounded-xl border p-3 ${
                        darkMode
                          ? "border-white/10 bg-[#07140f]"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Incident preview"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">
                            {image.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Report
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* =================================================
                REPORTING GUIDELINES
            ================================================= */}

            <section
              className={`rounded-2xl border p-5 shadow-xl h-fit transition-colors duration-300 ${
                darkMode
                  ? "bg-[#0f241b] border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <h2 className="text-lg font-bold">Reporting Guidelines</h2>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Help us process your report faster.
              </p>

              <div className="mt-5 space-y-4">
                <GuideItem
                  number="01"
                  title="Choose incident type"
                  description="Select the category that best describes the hazard."
                  darkMode={darkMode}
                />

                <GuideItem
                  number="02"
                  title="Add accurate location"
                  description="Provide the exact coordinates or use your current location."
                  darkMode={darkMode}
                />

                <GuideItem
                  number="03"
                  title="Describe the situation"
                  description="Mention important details such as severity, road condition or rainfall."
                  darkMode={darkMode}
                />

                <GuideItem
                  number="04"
                  title="Add a photo"
                  description="A clear photo can help authorities verify the incident."
                  darkMode={darkMode}
                />
              </div>

              {/* SAFETY */}

              <div className="mt-5 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />

                  <div>
                    <p className="text-sm font-bold text-orange-500">
                      Safety First
                    </p>

                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Do not put yourself in danger to collect information or
                      photographs.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              MY REPORTS
          ================================================= */}

          <section
            className={`mt-5 rounded-2xl border p-5 shadow-xl transition-colors duration-300 ${
              darkMode
                ? "bg-[#0f241b] border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold">My Reports</h2>

                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Track the status of incidents you have reported.
                </p>
              </div>

              {/* SEARCH */}

              <div className="relative w-full md:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none ${
                    darkMode
                      ? "bg-[#07140f] border-white/10 text-white placeholder:text-slate-600 focus:border-green-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-green-500"
                  }`}
                />
              </div>
            </div>

            {/* FILTER */}

            <div className="flex gap-2 overflow-x-auto mb-4">
              {reportFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === filter.value
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "bg-white/[0.05] text-slate-400 hover:bg-white/[0.10]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* LOADING */}

            {loadingReports ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />

                <p className="mt-3 text-sm font-semibold">
                  Loading your reports...
                </p>
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <ReportItem
                    key={report._id}
                    report={report}
                    darkMode={darkMode}
                    imageBaseURL={imageBaseURL}
                  />
                ))}
              </div>
            ) : (
              <div
                className={`rounded-xl border py-10 text-center ${
                  darkMode
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <FileText className="mx-auto w-10 h-10 text-slate-400" />

                <p className="mt-3 text-sm font-semibold">No reports found</p>

                <p className="mt-1 text-xs text-slate-500">
                  {reports.length === 0
                    ? "You haven't submitted any reports yet."
                    : "Try changing your search or filter."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

// =====================================================
// GUIDE ITEM
// =====================================================

const GuideItem = ({ number, title, description, darkMode }) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-xs font-bold text-green-500">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p
          className={`mt-1 text-xs leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// =====================================================
// REPORT ITEM
// =====================================================

const ReportItem = ({ report, darkMode, imageBaseURL }) => {
  const typeLabels = {
    landslide: "Landslide",
    flood: "Flash Flood",
    road_blockage: "Road Blockage",
    slop_failure: "Slope Failure",
    other: "Other",
  };

  const statusLabels = {
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",
    resolved: "Resolved",
  };

  const statusStyle = {
    pending: "bg-blue-500/10 text-blue-500",

    verified: "bg-green-500/10 text-green-500",

    rejected: "bg-red-500/10 text-red-500",

    resolved: "bg-purple-500/10 text-purple-500",
  };

  const date = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  const reportId = report._id
    ? `RPT-${report._id.slice(-6).toUpperCase()}`
    : "RPT";

  const imageURL = report.image
    ? report.image.startsWith("http")
      ? report.image
      : `${imageBaseURL}${report.image}`
    : null;

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${
        darkMode
          ? "border-white/10 bg-white/[0.03] hover:bg-[#143326] hover:border-green-500/20"
          : "border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md"
      }`}
    >
      {/* IMAGE / ICON */}

      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-500/10 text-green-500">
        {imageURL ? (
          <img
            src={imageURL}
            alt={report.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <FileText size={21} />
        )}
      </div>

      {/* MAIN */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold">{report.title}</h3>

          <span
            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
              statusStyle[report.status] || "bg-slate-500/10 text-slate-500"
            }`}
          >
            {statusLabels[report.status] || report.status}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          {reportId}
          {" • "}
          {typeLabels[report.reportType] || report.reportType}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin size={12} />
            {report.location?.latitude ?? "--"},
            {report.location?.longitude ?? "--"}
          </span>

          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <Clock3 size={12} />

            {date}
          </span>
        </div>
      </div>

      {/* ARROW */}

      <button type="button" className="self-end sm:self-center">
        <ChevronRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};

export default CitizenReports;
