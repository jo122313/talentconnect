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

  apply: async (id: string, coverLetter?: string) => {
    const response = await api.post(`/jobs/${id}/apply`, { coverLetter })
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

export default api
