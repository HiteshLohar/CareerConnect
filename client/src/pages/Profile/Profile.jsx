import { useEffect, useState } from "react";

import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

import api from "../../services/api";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "", phone: "", headline: "", location: "", skills: "", degree: "", college: "", year: "", branch: "", profilePhoto: null, resume: null,
    });


    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response = await api.get("/users/profile");

            const profile = response.data.user;

            setUser(profile);

            setFormData({

                fullName: profile.fullName || "",

                phone: profile.phone || "",

                headline: profile.headline || "",

                location: profile.location || "",

                skills: profile.skills?.join(", ") || "",

                degree: profile.education?.[0]?.degree || "",

                college: profile.education?.[0]?.college || "",

                year: profile.education?.[0]?.year || "",

                branch: profile.education?.[0]?.branch || ""

            });

            setUser(response.data.user);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const handleUpdateProfile = async () => {

        if (saving) return;

        try {

            setSaving(true);

            const data = new FormData();

            data.append("fullName", formData.fullName);

            data.append("phone", formData.phone);

            data.append("headline", formData.headline);

            data.append("location", formData.location);

            data.append(
                "skills",
                JSON.stringify(
                    formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                )
            );

            data.append(
                "education",
                JSON.stringify([
                    {
                        degree: formData.degree,
                        college: formData.college,
                        branch: formData.branch,
                        year: formData.year
                    }
                ])
            );

            if (formData.profilePhoto) {
                data.append("profilePhoto", formData.profilePhoto);
            }

            if (formData.resume) {
                data.append("resume", formData.resume);
            }

            const response = await api.put("/users/profile", data);

            toast.success(response.data.message);

            setUser(response.data.user);

            setIsEditing(false);

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {

            setSaving(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);

    if (loading) {

        return (

            <div className="text-center py-20 text-xl">

                Loading Profile...

            </div>

        );

    }

    if (isEditing) {

        return (

            <div className="max-w-5xl mx-auto py-10 px-4">

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold mb-8">

                        Edit Profile

                    </h1>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <label className="block mb-2 font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        fullName: e.target.value
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">
                                Phone
                            </label>

                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">
                                Headline
                            </label>

                            <input
                                type="text"
                                value={formData.headline}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        headline: e.target.value
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">
                                Location
                            </label>

                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        <div className="mt-6">

                            <label className="block mb-2 font-medium">
                                Skills
                            </label>

                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        skills: e.target.value
                                    })
                                }
                                placeholder="React, Node.js, MongoDB"
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Separate skills using commas.
                            </p>

                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mt-6">

                            <div>

                                <label className="block mb-2 font-medium">
                                    Degree
                                </label>

                                <input
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            degree: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="block mb-2 font-medium">
                                    College
                                </label>

                                <input
                                    type="text"
                                    value={formData.college}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            college: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="block mb-2 font-medium">
                                    Branch
                                </label>

                                <input
                                    type="text"
                                    value={formData.branch}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            branch: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-2"
                                />

                            </div>

                            <div>

                                <label className="block mb-2 font-medium">
                                    Year
                                </label>

                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            year: e.target.value
                                        })
                                    }
                                    className="w-full border rounded-lg px-4 py-2"
                                />

                            </div>

                        </div>

                        <div className="mt-8">

                            <label className="block mb-2 font-medium">
                                Profile Photo
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        profilePhoto: e.target.files[0]
                                    })
                                }
                            />

                        </div>

                        <div className="mt-6">

                            <label className="block mb-2 font-medium">
                                Resume
                            </label>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        resume: e.target.files[0]
                                    })
                                }
                            />

                        </div>

                        <div className="flex justify-end gap-4 mt-8">

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateProfile}
                                disabled={saving}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white transition
        ${saving
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="max-w-5xl mx-auto py-10 px-4">

            <div className="bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}

                <div className="flex justify-between items-start">

                    <div className="flex items-center gap-6">

                        <img
                            src={
                                user.profilePhoto ||
                                `https://ui-avatars.com/api/?name=${user.fullName}`
                            }
                            alt={user.fullName}
                            className="w-28 h-28 rounded-full object-cover border"
                        />

                        <div>

                            <h1 className="text-3xl font-bold">
                                {user.fullName}
                            </h1>

                            <p className="text-gray-600 mt-2">
                                {user.email}
                            </p>

                            <p className="text-blue-600 font-medium mt-2">
                                {user.headline || "No headline added"}
                            </p>

                        </div>

                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </button>

                </div>


                {/* Basic Details */}

                <div className="grid md:grid-cols-2 gap-8 mt-10">

                    <div>

                        <h3 className="text-gray-500 font-semibold">
                            Phone
                        </h3>

                        <p className="mt-2 text-lg">
                            {user.phone || "Not Added"}
                        </p>

                    </div>

                    <div>

                        <h3 className="text-gray-500 font-semibold">
                            Location
                        </h3>

                        <p className="mt-2 text-lg">
                            {user.location || "Not Added"}
                        </p>

                    </div>

                </div>

                {/* Skills */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Skills
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        {
                            user.skills?.length > 0
                                ? user.skills.map((skill) => (

                                    <span
                                        key={skill}
                                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                                    >
                                        {skill}
                                    </span>

                                ))
                                : (
                                    <p className="text-gray-500">
                                        No skills added
                                    </p>
                                )
                        }

                    </div>

                </div>

                {/* Education */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Education
                    </h2>

                    {
                        user.education?.length > 0
                            ? user.education.map((edu, index) => (

                                <div
                                    key={index}
                                    className="border rounded-xl p-5 mb-4"
                                >

                                    <h3 className="font-bold text-lg">
                                        {edu.degree}
                                    </h3>

                                    <p className="text-gray-600 mt-1">
                                        {edu.college}
                                    </p>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {edu.year}
                                    </p>

                                </div>

                            ))
                            : (
                                <p className="text-gray-500">
                                    No education added
                                </p>
                            )
                    }

                </div>

            </div>

        </div>
    )
}

export default Profile;