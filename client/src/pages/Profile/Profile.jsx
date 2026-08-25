import { useEffect, useState } from "react";

import {
    FaSpinner,
    FaEdit,
    FaPhone,
    FaMapMarkerAlt,
    FaEnvelope,
    FaGraduationCap,
    FaCode,
    FaFilePdf,
    FaExternalLinkAlt,
    FaCamera,
    FaBriefcase,
    FaPlus,
    FaTrash
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import api from "../../services/api";


function Profile() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    const [saving, setSaving] = useState(false);


    // =========================
    // EMPTY EDUCATION
    // =========================

    const emptyEducation = {
        degree: "",
        college: "",
        branch: "",
        year: ""
    };


    // =========================
    // EMPTY EXPERIENCE
    // =========================

    const emptyExperience = {
        jobTitle: "",
        company: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: ""
    };


    // =========================
    // FORM DATA
    // =========================

    const [formData, setFormData] = useState({

        fullName: "",
        phone: "",
        headline: "",
        location: "",
        skills: "",

        education: [
            {
                ...emptyEducation
            }
        ],

        experience: [
            {
                ...emptyExperience
            }
        ],

        profilePhoto: null,

        resume: null

    });


    // =========================
    // FETCH PROFILE
    // =========================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                "/users/profile"
            );

            const profile = response.data.user;

            setUser(profile);


            // =========================
            // EDUCATION
            // =========================

            const educationData =
                profile.education?.length > 0
                    ? profile.education.map((edu) => ({

                        degree: edu.degree || "",

                        college: edu.college || "",

                        branch: edu.branch || "",

                        year: edu.year || ""

                    }))
                    : [
                        {
                            ...emptyEducation
                        }
                    ];


            // =========================
            // EXPERIENCE
            // =========================

            const experienceData =
                profile.experience?.length > 0
                    ? profile.experience.map((exp) => ({

                        jobTitle: exp.jobTitle || "",

                        company: exp.company || "",

                        employmentType:
                            exp.employmentType || "",

                        startDate:
                            exp.startDate
                                ? exp.startDate.substring(0, 10)
                                : "",

                        endDate:
                            exp.endDate
                                ? exp.endDate.substring(0, 10)
                                : "",

                        currentlyWorking:
                            exp.currentlyWorking || false,

                        description:
                            exp.description || ""

                    }))
                    : [
                        {
                            ...emptyExperience
                        }
                    ];


            setFormData({

                fullName:
                    profile.fullName || "",

                phone:
                    profile.phone || "",

                headline:
                    profile.headline || "",

                location:
                    profile.location || "",

                skills:
                    profile.skills?.join(", ") || "",

                education:
                    educationData,

                experience:
                    experienceData,

                profilePhoto: null,

                resume: null

            });


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProfile();

    }, []);


    // =========================
    // HANDLE BASIC INPUT
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =========================
    // HANDLE EDUCATION CHANGE
    // =========================

    const handleEducationChange = (
        index,
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setFormData((prev) => {

            const updatedEducation =
                [...prev.education];


            updatedEducation[index] = {

                ...updatedEducation[index],

                [name]: value

            };


            return {

                ...prev,

                education:
                    updatedEducation

            };

        });

    };


    // =========================
    // ADD EDUCATION
    // =========================

    const addEducation = () => {

        setFormData((prev) => ({

            ...prev,

            education: [

                ...prev.education,

                {
                    ...emptyEducation
                }

            ]

        }));

    };


    // =========================
    // REMOVE EDUCATION
    // =========================

    const removeEducation = (index) => {

        setFormData((prev) => {

            if (
                prev.education.length === 1
            ) {

                return prev;

            }


            return {

                ...prev,

                education:
                    prev.education.filter(
                        (_, educationIndex) =>
                            educationIndex !== index
                    )

            };

        });

    };


    // =========================
    // HANDLE EXPERIENCE CHANGE
    // =========================

    const handleExperienceChange = (
        index,
        e
    ) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setFormData((prev) => {

            const updatedExperience =
                [...prev.experience];


            updatedExperience[index] = {

                ...updatedExperience[index],

                [name]:
                    type === "checkbox"
                        ? checked
                        : value

            };


            // If currently working
            // is enabled, remove end date

            if (
                name === "currentlyWorking" &&
                checked
            ) {

                updatedExperience[index]
                    .endDate = "";

            }


            return {

                ...prev,

                experience:
                    updatedExperience

            };

        });

    };


    // =========================
    // ADD EXPERIENCE
    // =========================

    const addExperience = () => {

        setFormData((prev) => ({

            ...prev,

            experience: [

                ...prev.experience,

                {
                    ...emptyExperience
                }

            ]

        }));

    };


    // =========================
    // REMOVE EXPERIENCE
    // =========================

    const removeExperience = (index) => {

        setFormData((prev) => {

            if (
                prev.experience.length === 1
            ) {

                return prev;

            }


            return {

                ...prev,

                experience:
                    prev.experience.filter(
                        (_, experienceIndex) =>
                            experienceIndex !== index
                    )

            };

        });

    };


    // =========================
    // UPDATE PROFILE
    // =========================

    const handleUpdateProfile = async () => {

        if (saving) return;


        try {

            setSaving(true);


            const data = new FormData();


            // =========================
            // BASIC INFORMATION
            // =========================

            data.append(
                "fullName",
                formData.fullName
            );

            data.append(
                "phone",
                formData.phone
            );

            data.append(
                "headline",
                formData.headline
            );

            data.append(
                "location",
                formData.location
            );


            // =========================
            // SKILLS
            // =========================

            data.append(
                "skills",
                JSON.stringify(

                    formData.skills
                        .split(",")
                        .map(
                            (skill) =>
                                skill.trim()
                        )
                        .filter(Boolean)

                )
            );


            // =========================
            // EDUCATION
            // =========================

            const cleanedEducation =
                formData.education
                    .filter((edu) => {

                        return (

                            edu.degree?.trim() ||
                            edu.college?.trim() ||
                            edu.branch?.trim() ||
                            edu.year

                        );

                    });


            data.append(
                "education",
                JSON.stringify(
                    cleanedEducation
                )
            );


            // =========================
            // EXPERIENCE
            // =========================

            /*
             * IMPORTANT:
             *
             * Empty experience forms are removed.
             *
             * employmentType is only included
             * when it has a valid value.
             *
             * This prevents:
             *
             * experience.0.employmentType:
             * "" is not a valid enum value
             */

            const cleanedExperience =
                formData.experience

                    .filter((exp) => {

                        return (

                            exp.jobTitle?.trim() ||
                            exp.company?.trim() ||
                            exp.employmentType ||
                            exp.startDate ||
                            exp.endDate ||
                            exp.currentlyWorking ||
                            exp.description?.trim()

                        );

                    })

                    .map((exp) => {

                        const cleaned = {

                            jobTitle:
                                exp.jobTitle?.trim() || "",

                            company:
                                exp.company?.trim() || "",

                            startDate:
                                exp.startDate || null,

                            endDate:
                                exp.currentlyWorking
                                    ? null
                                    : (
                                        exp.endDate ||
                                        null
                                    ),

                            currentlyWorking:
                                Boolean(
                                    exp.currentlyWorking
                                ),

                            description:
                                exp.description?.trim() || ""

                        };


                        // =========================
                        // EMPLOYMENT TYPE
                        // =========================

                        if (
                            exp.employmentType
                        ) {

                            cleaned.employmentType =
                                exp.employmentType;

                        }


                        return cleaned;

                    });


            data.append(
                "experience",
                JSON.stringify(
                    cleanedExperience
                )
            );


            // =========================
            // PROFILE PHOTO
            // =========================

            if (
                formData.profilePhoto
            ) {

                data.append(
                    "profilePhoto",
                    formData.profilePhoto
                );

            }


            // =========================
            // RESUME
            // =========================

            if (
                formData.resume
            ) {

                data.append(
                    "resume",
                    formData.resume
                );

            }


            // =========================
            // API REQUEST
            // =========================

            const response =
                await api.put(
                    "/users/profile",
                    data
                );


            // =========================
            // SUCCESS
            // =========================

            toast.success(
                response.data.message
            );


            setUser(
                response.data.user
            );


            setIsEditing(false);


            setFormData((prev) => ({

                ...prev,

                profilePhoto: null,

                resume: null

            }));


        } catch (error) {

            toast.error(

                error.response?.data?.message ||
                "Failed to update profile"

            );

        } finally {

            setSaving(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <div className="flex items-center gap-3 text-gray-500">

                    <FaSpinner className="animate-spin text-blue-600" />

                    <span>
                        Loading Profile...
                    </span>

                </div>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (!user) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <p className="text-gray-500">
                    Unable to load profile.
                </p>

            </div>

        );

    }


    // =========================
    // EDIT PROFILE
    // =========================

    if (isEditing) {

        const previewPhoto =
            formData.profilePhoto

                ? URL.createObjectURL(
                    formData.profilePhoto
                )

                : user.profilePhoto ||

                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.fullName
                )}&background=2563eb&color=fff`;


        return (

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">


                    {/* =========================
                        EDIT HEADER
                    ========================= */}

                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 sm:px-8 sm:py-8">

                        <div className="flex items-center gap-4 sm:gap-5">

                            <div className="relative">

                                <img
                                    src={previewPhoto}
                                    alt={user.fullName}
                                    className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
                                />


                                <label className="absolute bottom-0 right-0 w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow">

                                    <FaCamera size={15} />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            setFormData(
                                                (prev) => ({
                                                    ...prev,
                                                    profilePhoto:
                                                        e.target.files?.[0] ||
                                                        null
                                                })
                                            )
                                        }
                                    />

                                </label>

                            </div>


                            <div className="min-w-0 text-white">

                                <h1 className="text-xl font-bold sm:text-2xl">
                                    Edit Profile
                                </h1>

                                <p className="text-blue-100 mt-1">
                                    Keep your professional profile updated.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                        FORM
                    ========================= */}

                    <div className="p-4 sm:p-6 lg:p-8">


                        {/* =========================
                            BASIC INFORMATION
                        ========================= */}

                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">


                            {/* FULL NAME */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* PHONE */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* HEADLINE */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Professional Headline
                                </label>

                                <input
                                    type="text"
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                    placeholder="e.g. Backend Developer | Node.js | MongoDB"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* LOCATION */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* SKILLS */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Node.js, Express, MongoDB"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    Separate skills using commas.
                                </p>

                            </div>

                        </div>


                        {/* =========================
                            EDUCATION
                        ========================= */}

                        <div className="mt-10">


                            {/* EDUCATION HEADER */}

                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-2">

                                    <FaGraduationCap className="text-blue-600" />

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Education
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={addEducation}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <FaPlus size={13} />

                                    Add Education

                                </button>

                            </div>


                            {/* EDUCATION LIST */}

                            <div className="space-y-6">

                                {formData.education.map(
                                    (education, index) => (

                                        <div
                                            key={index}
                                            className="relative rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-6"
                                        >


                                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <h3 className="font-semibold text-gray-800">
                                                    Education {index + 1}
                                                </h3>


                                                {formData.education.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeEducation(index)
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm"
                                                    >

                                                        <FaTrash size={13} />

                                                        Remove

                                                    </button>

                                                )}

                                            </div>


                                            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">


                                                {/* DEGREE */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Degree
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="degree"
                                                        value={
                                                            education.degree
                                                        }
                                                        onChange={(e) =>
                                                            handleEducationChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="B.E / B.Tech"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* COLLEGE */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        College
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="college"
                                                        value={
                                                            education.college
                                                        }
                                                        onChange={(e) =>
                                                            handleEducationChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="College / University"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* BRANCH */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Branch
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="branch"
                                                        value={
                                                            education.branch
                                                        }
                                                        onChange={(e) =>
                                                            handleEducationChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Computer Engineering"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* YEAR */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Graduation Year
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="year"
                                                        value={
                                                            education.year
                                                        }
                                                        onChange={(e) =>
                                                            handleEducationChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="2026"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =========================
                            EXPERIENCE
                        ========================= */}

                        <div className="mt-10">


                            {/* EXPERIENCE HEADER */}

                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-2">

                                    <FaBriefcase className="text-blue-600" />

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Experience
                                    </h2>

                                </div>


                                {/* ADD EXPERIENCE */}

                                <button
                                    type="button"
                                    onClick={addExperience}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <FaPlus size={13} />

                                    Add Experience

                                </button>

                            </div>


                            {/* EXPERIENCE LIST */}

                            <div className="space-y-6">

                                {formData.experience.map(
                                    (experience, index) => (

                                        <div
                                            key={index}
                                            className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-6"
                                        >


                                            {/* EXPERIENCE HEADER */}

                                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                                <h3 className="font-semibold text-gray-800">
                                                    Experience {index + 1}
                                                </h3>


                                                {formData.experience.length > 1 && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeExperience(
                                                                index
                                                            )
                                                        }
                                                        className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm"
                                                    >

                                                        <FaTrash size={13} />

                                                        Remove

                                                    </button>

                                                )}

                                            </div>


                                            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">


                                                {/* JOB TITLE */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Job Title
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="jobTitle"
                                                        value={
                                                            experience.jobTitle
                                                        }
                                                        onChange={(e) =>
                                                            handleExperienceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Backend Developer"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* COMPANY */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Company
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="company"
                                                        value={
                                                            experience.company
                                                        }
                                                        onChange={(e) =>
                                                            handleExperienceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Company Name"
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* EMPLOYMENT TYPE */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Employment Type
                                                    </label>

                                                    <select
                                                        name="employmentType"
                                                        value={
                                                            experience.employmentType
                                                        }
                                                        onChange={(e) =>
                                                            handleExperienceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >

                                                        <option value="">
                                                            Select employment type
                                                        </option>

                                                        <option value="Full-time">
                                                            Full-time
                                                        </option>

                                                        <option value="Part-time">
                                                            Part-time
                                                        </option>

                                                        <option value="Internship">
                                                            Internship
                                                        </option>

                                                        <option value="Freelance">
                                                            Freelance
                                                        </option>

                                                        <option value="Contract">
                                                            Contract
                                                        </option>

                                                    </select>

                                                </div>


                                                {/* START DATE */}

                                                <div>

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Start Date
                                                    </label>

                                                    <input
                                                        type="date"
                                                        name="startDate"
                                                        value={
                                                            experience.startDate
                                                        }
                                                        onChange={(e) =>
                                                            handleExperienceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>


                                                {/* CURRENTLY WORKING */}

                                                <div className="md:col-span-2">

                                                    <label className="flex items-center gap-3 cursor-pointer">

                                                        <input
                                                            type="checkbox"
                                                            name="currentlyWorking"
                                                            checked={
                                                                experience.currentlyWorking
                                                            }
                                                            onChange={(e) =>
                                                                handleExperienceChange(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            className="w-4 h-4 text-blue-600 rounded"
                                                        />

                                                        <span className="text-sm font-semibold text-gray-700">
                                                            I currently work here
                                                        </span>

                                                    </label>

                                                </div>


                                                {/* END DATE */}

                                                {!experience.currentlyWorking && (

                                                    <div>

                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            End Date
                                                        </label>

                                                        <input
                                                            type="date"
                                                            name="endDate"
                                                            value={
                                                                experience.endDate
                                                            }
                                                            onChange={(e) =>
                                                                handleExperienceChange(
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />

                                                    </div>

                                                )}


                                                {/* DESCRIPTION */}

                                                <div className="md:col-span-2">

                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Description
                                                    </label>

                                                    <textarea
                                                        name="description"
                                                        value={
                                                            experience.description
                                                        }
                                                        onChange={(e) =>
                                                            handleExperienceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        rows="4"
                                                        placeholder="Describe your responsibilities, achievements and work..."
                                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =========================
                            RESUME
                        ========================= */}

                        <div className="mt-10">

                            <div className="flex items-center gap-2 mb-4">

                                <FaFilePdf className="text-red-500" />

                                <h2 className="text-xl font-bold text-gray-900">
                                    Resume
                                </h2>

                            </div>


                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setFormData(
                                        (prev) => ({
                                            ...prev,
                                            resume:
                                                e.target.files?.[0] ||
                                                null
                                        })
                                    )
                                }
                                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                            />


                            <p className="text-xs text-gray-500 mt-2">
                                Upload your resume in PDF format.
                            </p>

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:mt-10 sm:flex-row sm:justify-end">


                            <button
                                onClick={() =>
                                    setIsEditing(false)
                                }
                                disabled={saving}
                                className="w-full rounded-xl border border-gray-300 px-6 py-3 text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                            >
                                Cancel
                            </button>


                            <button
                                onClick={handleUpdateProfile}
                                disabled={saving}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition sm:w-auto ${
                                    saving
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


    // =========================
    // VIEW PROFILE
    // =========================

    return (

        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">


            {/* =========================
                PROFILE HEADER
            ========================= */}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">


                {/* COVER */}

                <div className="relative h-40 overflow-hidden sm:h-48">

                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">


                        <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-blue-500/20"></div>

                        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-indigo-400/10"></div>


                        <div className="absolute top-8 right-32 w-2 h-2 rounded-full bg-white/40"></div>

                        <div className="absolute top-16 right-20 w-1.5 h-1.5 rounded-full bg-blue-300/50"></div>

                        <div className="absolute bottom-10 right-44 w-2 h-2 rounded-full bg-indigo-300/40"></div>


                        <div className="relative flex h-full items-center px-5 sm:px-8 md:px-12">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-sm sm:tracking-[0.2em]">
                                    CareerConnect
                                </p>

                                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                                    Your career. Your next opportunity.
                                </h2>

                                <p className="text-blue-100/80 text-sm mt-2 max-w-xl">
                                    Build your profile and connect with opportunities.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* PROFILE INFO */}

                <div className="px-4 pb-6 sm:px-8 sm:pb-8">

                    <div className="relative flex flex-col md:flex-row md:items-start md:justify-between">


                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">


                            {/* PHOTO */}

                            <div className="relative -mt-14 z-10 flex-shrink-0">

                                <img
                                    src={
                                        user.profilePhoto ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            user.fullName
                                        )}&background=2563eb&color=fff`
                                    }
                                    alt={user.fullName}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                                />

                            </div>


                            {/* NAME */}

                            <div className="pt-5 sm:pt-6">

                                <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {user.fullName}
                                </h1>

                                <p className="text-blue-600 font-medium mt-1">
                                    {user.headline ||
                                        "No headline added"}
                                </p>

                            </div>

                        </div>


                        {/* EDIT */}

                        <div className="mt-5 md:mt-6">

                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                            >

                                <FaEdit />

                                Edit Profile

                            </button>

                        </div>

                    </div>


                    {/* CONTACT */}

                    <div className="mt-7 flex flex-col gap-3 text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">


                        <div className="flex min-w-0 items-center gap-2">

                            <FaEnvelope className="text-blue-500" />

                            <span className="break-all">
                                {user.email}
                            </span>

                        </div>


                        <div className="flex min-w-0 items-center gap-2">

                            <FaPhone className="text-blue-500" />

                            <span>
                                {user.phone ||
                                    "Phone not added"}
                            </span>

                        </div>


                        <div className="flex min-w-0 items-center gap-2">

                            <FaMapMarkerAlt className="text-blue-500" />

                            <span>
                                {user.location ||
                                    "Location not added"}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-3">


                {/* LEFT */}

                <div className="lg:col-span-2 space-y-6">


                    {/* SKILLS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                        <div className="flex items-center gap-2 mb-5">

                            <FaCode className="text-blue-600" />

                            <h2 className="text-xl font-bold text-gray-900">
                                Skills
                            </h2>

                        </div>


                        {user.skills?.length > 0 ? (

                            <div className="flex flex-wrap gap-2 sm:gap-3">

                                {user.skills.map(
                                    (skill) => (

                                        <span
                                            key={skill}
                                            className="break-words rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 sm:px-4"
                                        >
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-gray-500">
                                No skills added yet.
                            </p>

                        )}

                    </div>


                    {/* EDUCATION */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                        <div className="flex items-center gap-2 mb-6">

                            <FaGraduationCap className="text-blue-600" />

                            <h2 className="text-xl font-bold text-gray-900">
                                Education
                            </h2>

                        </div>


                        {user.education?.length > 0 ? (

                            <div className="space-y-4">

                                {user.education.map(
                                    (edu, index) => (

                                        <div
                                            key={index}
                                            className="rounded-xl border border-gray-200 p-4 transition hover:shadow-sm sm:p-5"
                                        >

                                            <div className="flex items-start gap-4">


                                                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">

                                                    <FaGraduationCap />

                                                </div>


                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {edu.degree}
                                                    </h3>

                                                    <p className="text-gray-600 mt-1">
                                                        {edu.college}
                                                    </p>

                                                    <p className="text-sm text-gray-500 mt-2">

                                                        {edu.branch}

                                                        {edu.branch &&
                                                        edu.year
                                                            ? " • "
                                                            : ""}

                                                        {edu.year}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-gray-500">
                                No education added yet.
                            </p>

                        )}

                    </div>


                    {/* EXPERIENCE */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">

                        <div className="flex items-center gap-2 mb-6">

                            <FaBriefcase className="text-blue-600" />

                            <h2 className="text-xl font-bold text-gray-900">
                                Experience
                            </h2>

                        </div>


                        {user.experience?.length > 0 ? (

                            <div className="space-y-4">

                                {user.experience.map(
                                    (exp, index) => (

                                        <div
                                            key={index}
                                            className="rounded-xl border border-gray-200 p-4 transition hover:shadow-sm sm:p-5"
                                        >

                                            <div className="flex items-start gap-4">


                                                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">

                                                    <FaBriefcase />

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        {exp.jobTitle}
                                                    </h3>


                                                    <p className="text-gray-600 mt-1">
                                                        {exp.company}
                                                    </p>


                                                    <p className="text-sm text-blue-600 mt-2 font-medium">
                                                        {exp.employmentType}
                                                    </p>


                                                    <p className="text-sm text-gray-500 mt-2">

                                                        {exp.startDate
                                                            ? new Date(
                                                                exp.startDate
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : ""}

                                                        {exp.startDate
                                                            ? " - "
                                                            : ""}

                                                        {exp.currentlyWorking
                                                            ? "Present"
                                                            : exp.endDate
                                                            ? new Date(
                                                                exp.endDate
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )
                                                            : ""}

                                                    </p>


                                                    {exp.description && (

                                                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                                            {exp.description}
                                                        </p>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <p className="text-gray-500">
                                No experience added yet.
                            </p>

                        )}

                    </div>

                </div>


                {/* RIGHT SIDEBAR */}

                <div className="space-y-6">


                    {/* RESUME */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

                        <div className="flex items-center gap-2 mb-4">

                            <FaFilePdf className="text-red-500" />

                            <h2 className="text-lg font-bold text-gray-900">
                                Resume
                            </h2>

                        </div>


                        {user.resumeUrl ? (

                            <>

                                <p className="text-sm text-gray-500 mb-4">
                                    Your latest resume is available.
                                </p>


                                <a
                                    href={user.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                                >

                                    <FaExternalLinkAlt size={14} />

                                    View Resume

                                </a>

                            </>

                        ) : (

                            <p className="text-sm text-gray-500">
                                No resume uploaded yet.
                            </p>

                        )}

                    </div>


                    {/* CAREER PROFILE */}

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                <FaBriefcase />

                            </div>


                            <div>

                                <h3 className="font-bold text-gray-900">
                                    Career Profile
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    Keep your profile updated.
                                </p>

                            </div>

                        </div>


                        <p className="text-sm text-gray-600 mt-4">
                            A complete profile helps recruiters understand your skills and experience.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Profile;
