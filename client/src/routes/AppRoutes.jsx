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
                    <Route
                        path="/my-applications"
                        element={
                            <ProtectedRoute>
                                <MyApplications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id/applicants"
                        element={
                            <ProtectedRoute>
                                <Applicants />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/saved-jobs"
                        element={
                            <ProtectedRoute>
                                <SavedJobs />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/companies"
                        element={
                            <ProtectedRoute>
                                <CompanyList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/companies/create"
                        element={
                            <ProtectedRoute>
                                <CreateCompany />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/companies/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditCompany />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/create"
                        element={
                            <ProtectedRoute>
                                <CreateJob />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/recruiter/jobs"
                        element={
                            <ProtectedRoute>
                                <MyJobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditJob />
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