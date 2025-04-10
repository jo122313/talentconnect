
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building,
  ChevronDown,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployerDashboard = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for dashboard
  const stats = [
    { title: "Total Job Posts", value: 12, icon: Briefcase },
    { title: "Active Jobs", value: 8, icon: FileText },
    { title: "Applications", value: 124, icon: Users },
    { title: "Messages", value: 7, icon: MessageSquare },
  ];

  const recentApplications = [
    {
      id: 1,
      position: "Senior Frontend Developer",
      applicant: "John Smith",
      date: "2025-04-05",
      status: "new",
    },
    {
      id: 2,
      position: "UX Designer",
      applicant: "Sarah Johnson",
      date: "2025-04-04",
      status: "reviewed",
    },
    {
      id: 3,
      position: "DevOps Engineer",
      applicant: "Michael Brown",
      date: "2025-04-03",
      status: "interviewed",
    },
    {
      id: 4,
      position: "Product Manager",
      applicant: "Emily Davis",
      date: "2025-04-02",
      status: "shortlisted",
    },
    {
      id: 5,
      position: "Backend Developer",
      applicant: "Alex Wilson",
      date: "2025-04-01",
      status: "rejected",
    },
  ];

  const filteredApplications =
    filter === "all"
      ? recentApplications
      : recentApplications.filter((app) => app.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "reviewed":
        return <Badge className="bg-purple-500">Reviewed</Badge>;
      case "interviewed":
        return <Badge className="bg-amber-500">Interviewed</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-500">Shortlisted</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <EmployerSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">Employer Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="grid gap-6">
              <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <section>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Applications</CardTitle>
                    <Select
                      value={filter}
                      onValueChange={setFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="interviewed">Interviewed</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredApplications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No applications found.
                        </p>
                      ) : (
                        <div className="divide-y rounded-md border">
                          {filteredApplications.map((application) => (
                            <div
                              key={application.id}
                              className="flex items-center justify-between p-4"
                            >
                              <div className="space-y-1">
                                <h3 className="font-medium">
                                  {application.position}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {application.applicant} • Applied on{" "}
                                  {new Date(application.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(application.status)}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex justify-center">
                        <Button variant="outline">View All Applications</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Posts Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center border border-dashed rounded-md bg-muted/20">
                      <p className="text-muted-foreground">Analytics chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full justify-start">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Post a New Job
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Review Applications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Candidates
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Company Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Sidebar component for employer dashboard
const EmployerSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2">
          <Building className="h-6 w-6" />
          <div className="font-semibold">Company Portal</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Briefcase className="h-4 w-4" />
                  <span>Jobs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="h-4 w-4" />
                  <span>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Building className="h-4 w-4" />
                  <span>Company Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col gap-4 px-2">
          <div className="text-xs text-muted-foreground">
            Logged in as <span className="font-medium">HR Manager</span>
          </div>
          <Button variant="outline" size="sm">
            Log out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default EmployerDashboard;
