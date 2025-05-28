"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, User, LogOut, Settings, Briefcase } from "lucide-react"
import { useTheme } from "@/context/ThemeContext"
import { auth } from "@/services/api"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const response = await auth.getCurrentUser()
        setUser(response.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("role")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.logout()
      setUser(null)
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear local storage and redirect
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      setUser(null)
      navigate("/")
    }
  }

  const getDashboardLink = () => {
    if (!user) return null

    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "employer":
        return "/employer/dashboard"
      case "jobseeker":
        return "/user/dashboard"
      default:
        return null
    }
  }

  const getUserInitials = () => {
    if (!user?.fullName) return "U"
    return user.fullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-job-blue dark:text-job-purple">
                TalentConnect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-job-blue dark:text-job-purple">
              TalentConnect
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple transition-colors"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/companies"
              className="text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple transition-colors"
            >
              Contact Us
            </Link>

            {/* Dashboard link - only show for logged in users */}
            {user && getDashboardLink() && (
              <Link
                to={getDashboardLink()!}
                className="text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple transition-colors"
              >
                Dashboard
              </Link>
            )}

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-gray-700 dark:text-gray-300">
              {theme === "dark" ? "🌞" : "🌙"}
            </Button>

            {/* User Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-job-blue text-white">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>

                  {getDashboardLink() && (
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()!} className="cursor-pointer">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <div className="border-t border-gray-200 dark:border-gray-700"></div>

                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-job-blue hover:bg-job-purple">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-gray-700 dark:text-gray-300 mr-2">
              {theme === "dark" ? "🌞" : "🌙"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                onClick={() => setIsOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to="/companies"
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                onClick={() => setIsOpen(false)}
              >
                Companies
              </Link>

              {/* Dashboard link for mobile */}
              {user && getDashboardLink() && (
                <Link
                  to={getDashboardLink()!}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {user ? (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="px-3 py-2">
                    <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-job-blue dark:hover:text-job-purple"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
