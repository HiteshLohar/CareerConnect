import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';
import Jobs from '../pages/Jobs/Jobs';
import JobDetails from "../pages/JobDetails/JobDetails";
import Profile from '../pages/Profile/Profile';
import MyApplications from "../pages/MyApplications/MyApplications";
import Applicants from "../pages/Applicants/Applicants";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import CompanyList from "../pages/Company/CompanyList";
import CreateCompany from "../pages/Company/CreateCompany";
import EditCompany from "../pages/Company/EditCompany";
import CreateJob from "../pages/Recruiter/CreateJob";
import MyJobs from "../pages/Recruiter/MyJobs";
import EditJob from "../pages/Recruiter/EditJob";
import RecruiterDashboard from "../pages/RecruiterDashboard/RecruiterDashboard";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import RecruiterAnalytics from "../pages/RecruiterAnalytics/RecruiterAnalytics";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminCompanies from "../pages/Admin/AdminCompanies";
import AdminJobs from "../pages/Admin/AdminJobs";
import AdminApplications from "../pages/Admin/AdminApplications";

import ProtectedRoute from "../components/common/ProtectedRoute";
import PublicRoute from "../components/common/PublicRoute";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Pages Without Navbar */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />


                {/* Pages with Navbar + Footer */}

                <Route element={<MainLayout />}>

                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />


                    // Student Routes
                    <Route
                        path="/student/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/saved-jobs"
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <SavedJobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-applications"
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <MyApplications />
                            </ProtectedRoute>
                        }
                    />


                    // Recruiter Routes
                    <Route
                        path="/companies"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <CompanyList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/companies/create"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <CreateCompany />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/companies/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <EditCompany />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/create"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <CreateJob />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <EditJob />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id/applicants"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <Applicants />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/jobs"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <MyJobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <RecruiterDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/recruiter/analytics"
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]}>
                                <RecruiterAnalytics />
                            </ProtectedRoute>
                        }
                    />


                    // Admin Routes
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminUsers />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/companies"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminCompanies />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/jobs"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminJobs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/applications"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminApplications />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;