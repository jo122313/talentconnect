
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// TypeScript interfaces
interface User {
  _id: string
  fullName: string
  email: string
  phone?: string
  location?: string
  role: string
  status: string
  companyDescription?: string
  website?: string
}

interface Job {
  _id: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  status: string
  createdAt: string
  applicationsCount: number
  salary?: {
    min: number
    max: number
    currency: string
  }
  experience?: string
  education?: string
  skills?: string[]
  benefits?: string[]
}

interface Application {
  _id: string
  job: {
    _id: string
    title: string
    location: string
    type: string
  }
  applicant: {
    _id: string
    fullName: string
    email: string
    phone?: string
    resume?: string
    skills?: string[]
    experience?: string
    education?: string
    gpa?: string
    university?: string
    graduationDate?: string
    location?: string
  }
  status: string
  createdAt: string
  coverLetter?: string
  notes?: string
  interviewDate?: string
}

interface Stats {
  activeJobs: number
  totalJobs: number
  totalApplications: number
  interviewsScheduled: number
}

// Auth API
export const auth = {
  registerJobSeeker: async (formData: FormData) => {
    const response = await api.post("/auth/register/jobseeker", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  registerEmployer: async (formData: FormData) => {
    const response = await api.post("/auth/register/employer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },

  logout: async () => {
    const response = await api.post("/auth/logout")
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    return response.data
  },
}

// Jobs API
export const jobs = {
  getAll: async (params?: {
    search?: string
    location?: string
    type?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get("/jobs", { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },

  apply: async (id: string, applicationData: {
    coverLetter?: string
    gpa?: string
    experienceLevel?: string
    education?: string
    university?: string
    graduationDate?: string
  }) => {
    const response = await api.post(`/jobs/${id}/apply`, applicationData)
    return response.data
  },

  getApplicationStatus: async (id: string) => {
    const response = await api.get(`/jobs/${id}/application-status`)
    return response.data
  },

  getFeatured: async () => {
    const response = await api.get("/jobs/featured/list")
    return response.data
  },

  getStats: async () => {
    const response = await api.get("/jobs/stats/overview")
    return response.data
  },
}

// Employer API
export const employer = {
  getDashboardStats: async () => {
    const response = await api.get("/employer/dashboard/stats")
    return response.data
  },

  getJobs: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get("/employer/jobs", { params })
    return response.data
  },

  createJob: async (jobData: any) => {
    const response = await api.post("/employer/jobs", jobData)
    return response.data
  },

  updateJob: async (id: string, jobData: any) => {
    const response = await api.put(`/employer/jobs/${id}`, jobData)
    return response.data
  },

  toggleJobStatus: async (id: string) => {
    const response = await api.patch(`/employer/jobs/${id}/status`)
    return response.data
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/employer/jobs/${id}`)
    return response.data
  },

  getApplications: async (params?: {
    status?: string
    jobId?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get("/employer/applications", { params })
    return response.data
  },

  updateApplicationStatus: async (id: string, status: string, notes?: string, interviewDate?: string) => {
    const response = await api.patch(`/employer/applications/${id}/status`, {
      status,
      notes,
      interviewDate,
    })
    return response.data
  },

  sendInterviewNotification: async (id: string, interviewDetails: {
    date: string
    time: string
    location: string
    additionalNotes?: string
  }) => {
    const response = await api.post(`/employer/applications/${id}/interview-notification`, interviewDetails)
    return response.data
  },

  getApplicationDetails: async (id: string) => {
    const response = await api.get(`/employer/applications/${id}`)
    return response.data
  },
}

// Admin API
export const admin = {
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats")
    return response.data
  },

  getEmployers: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get("/admin/employers", { params })
    return response.data
  },

  updateEmployerStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/employers/${id}/status`, { status })
    return response.data
  },

  getUsers: async (params?: {
    role?: string
    page?: number
    limit?: number
    search?: string
  }) => {
    const response = await api.get("/admin/users", { params })
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  getJobs: async (params?: {
    status?: string
    page?: number
    limit?: number
    search?: string
  }) => {
    const response = await api.get("/admin/jobs", { params })
    return response.data
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/admin/jobs/${id}`)
    return response.data
  },

  updateJobStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/jobs/${id}/status`, { status })
    return response.data
  },
}

// User API
export const user = {
  getProfile: async () => {
    const response = await api.get("/user/profile")
    return response.data
  },

  updateProfile: async (formData: FormData) => {
    const response = await api.put("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateResume: async (formData: FormData) => {
    const response = await api.post("/user/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  getApplications: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get("/user/applications", { params })
    return response.data
  },

  getApplicationDetails: async (id: string) => {
    const response = await api.get(`/user/applications/${id}`)
    return response.data
  },

  withdrawApplication: async (id: string) => {
    const response = await api.delete(`/user/applications/${id}`)
    return response.data
  },

  getDashboardStats: async () => {
    const response = await api.get("/user/dashboard/stats")
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post("/user/change-password", {
      currentPassword,
      newPassword,
    })
    return response.data
  },
}

// Saved Jobs API
export const savedJobs = {
  save: async (jobId: string) => {
    const response = await api.post(`/saved-jobs/${jobId}`)
    return response.data
  },

  remove: async (jobId: string) => {
    const response = await api.delete(`/saved-jobs/${jobId}`)
    return response.data
  },

  getAll: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/saved-jobs', { params })
    return response.data
  },

  checkStatus: async (jobId: string) => {
    const response = await api.get(`/saved-jobs/${jobId}/status`)
    return response.data
  },
}

export default api