import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Building, MapPin, Calendar } from "lucide-react";

const SalaryGuide = () => {
  const salaryByRole = [
    {
      role: "Software Engineer",
      junior: "$65,000 - $85,000",
      mid: "$85,000 - $120,000",
      senior: "$120,000 - $180,000"
    },
    {
      role: "Product Manager",
      junior: "$70,000 - $95,000",
      mid: "$95,000 - $140,000",
      senior: "$140,000 - $200,000"
    },
    {
      role: "Data Scientist",
      junior: "$75,000 - $100,000",
      mid: "$100,000 - $150,000",
      senior: "$150,000 - $220,000"
    },
    {
      role: "UX Designer",
      junior: "$55,000 - $75,000",
      mid: "$75,000 - $110,000",
      senior: "$110,000 - $160,000"
    },
    {
      role: "Marketing Manager",
      junior: "$50,000 - $70,000",
      mid: "$70,000 - $100,000",
      senior: "$100,000 - $150,000"
    },
    {
      role: "Sales Representative",
      junior: "$40,000 - $60,000",
      mid: "$60,000 - $90,000",
      senior: "$90,000 - $130,000"
    }
  ];

  const factors = [
    {
      icon: MapPin,
      title: "Location",
      description: "Geographic location significantly impacts salary ranges",
      details: "Major tech hubs like San Francisco and New York typically offer 20-40% higher salaries"
    },
    {
      icon: Calendar,
      title: "Experience",
      description: "Years of experience in the field",
      details: "Each year of relevant experience can increase salary by 3-8% on average"
    },
    {
      icon: Building,
      title: "Company Size",
      description: "Organization size affects compensation packages",
      details: "Large corporations often offer higher base salaries, while startups may offer equity"
    },
    {
      icon: Users,
      title: "Industry",
      description: "Different industries have varying compensation standards",
      details: "Tech, finance, and healthcare typically offer higher compensation packages"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Salary Guide</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive salary insights to help you understand market rates and negotiate better compensation.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-job-blue to-job-purple text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-6 h-6" />
                  <CardTitle className="text-white">Average Salary Growth</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">5.2%</p>
                <p className="text-white/90">Year over year increase</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-job-purple to-job-blue text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6" />
                  <CardTitle className="text-white">Top Paying Industry</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">Technology</p>
                <p className="text-white/90">Leading compensation packages</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <CardTitle className="text-white">Remote Work Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">+12%</p>
                <p className="text-white/90">Average salary increase</p>
              </CardContent>
            </Card>
          </div>

          {/* Salary by Role */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-job-blue" />
                <span>Salary Ranges by Role</span>
              </CardTitle>
              <CardDescription>
                Annual salary ranges based on experience level (USD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-green-600">Junior (0-2 years)</th>
                      <th className="text-left py-3 px-4 font-semibold text-blue-600">Mid-level (3-5 years)</th>
                      <th className="text-left py-3 px-4 font-semibold text-purple-600">Senior (5+ years)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryByRole.map((role, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{role.role}</td>
                        <td className="py-3 px-4 text-green-600">{role.junior}</td>
                        <td className="py-3 px-4 text-blue-600">{role.mid}</td>
                        <td className="py-3 px-4 text-purple-600">{role.senior}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Factors Affecting Salary */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Factors Affecting Salary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {factors.map((factor, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-job-blue/10 rounded-lg">
                        <factor.icon className="w-6 h-6 text-job-blue" />
                      </div>
                      <CardTitle className="text-xl">{factor.title}</CardTitle>
                    </div>
                    <CardDescription>{factor.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{factor.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Negotiation Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Negotiation Tips</CardTitle>
              <CardDescription>
                Strategies to help you negotiate a better compensation package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Before Negotiating</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Research market rates for your role</li>
                    <li>• Document your achievements and value</li>
                    <li>• Consider total compensation, not just salary</li>
                    <li>• Practice your negotiation pitch</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">During Negotiation</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Be confident but respectful</li>
                    <li>• Present data to support your request</li>
                    <li>• Be prepared to discuss alternatives</li>
                    <li>• Listen actively to the employer's response</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SalaryGuide;