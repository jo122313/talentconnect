import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Eye, Download, Award } from "lucide-react";

const ResumeTips = () => {
  const dosList = [
    "Use a clean, professional format with consistent fonts",
    "Tailor your resume for each job application",
    "Include quantifiable achievements and results",
    "Use action verbs to start bullet points",
    "Keep it to 1-2 pages maximum",
    "Include relevant keywords from the job description",
    "Proofread carefully for spelling and grammar errors"
  ];

  const dontsList = [
    "Don't include personal information like age or photo",
    "Don't use fancy fonts or excessive colors",
    "Don't list every job you've ever had",
    "Don't include references on your resume",
    "Don't use generic objective statements",
    "Don't forget to update contact information",
    "Don't submit without customizing for the role"
  ];

  const resumeSections = [
    {
      title: "Contact Information",
      description: "Name, phone, email, LinkedIn, and location",
      tips: "Use a professional email address and ensure all information is current"
    },
    {
      title: "Professional Summary",
      description: "2-3 sentences highlighting your key qualifications",
      tips: "Focus on your most relevant skills and achievements for the target role"
    },
    {
      title: "Work Experience",
      description: "List positions in reverse chronological order",
      tips: "Use bullet points with quantifiable achievements and action verbs"
    },
    {
      title: "Education",
      description: "Degrees, certifications, and relevant coursework",
      tips: "Include GPA only if it's 3.5 or higher and you're a recent graduate"
    },
    {
      title: "Skills",
      description: "Technical and soft skills relevant to the position",
      tips: "Categorize skills and include proficiency levels where appropriate"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Tips</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Craft a compelling resume that gets you noticed by employers and lands you interviews.
            </p>
          </div>

          {/* Featured Tip */}
          <Card className="mb-12 bg-gradient-to-r from-job-purple to-job-blue text-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <CardTitle className="text-white">Pro Tip</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/95 text-lg">
                Your resume has just 6-10 seconds to make an impression. Make sure the most important information 
                is visible at the top and use strong action verbs to describe your achievements.
              </p>
            </CardContent>
          </Card>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-green-800">Do's</CardTitle>
                </div>
                <CardDescription>Best practices for resume writing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dosList.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-red-800">Don'ts</CardTitle>
                </div>
                <CardDescription>Common mistakes to avoid</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dontsList.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Resume Sections */}
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-job-blue" />
                <CardTitle>Essential Resume Sections</CardTitle>
              </div>
              <CardDescription>
                Key components every resume should include
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resumeSections.map((section, index) => (
                  <div key={index} className="border-l-4 border-job-blue pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-gray-600 mb-2">{section.description}</p>
                    <p className="text-sm text-gray-500 italic">{section.tips}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-job-purple" />
                  <CardTitle className="text-lg">ATS Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  90% of companies use Applicant Tracking Systems (ATS) to screen resumes.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Use standard section headings</li>
                  <li>• Include relevant keywords</li>
                  <li>• Save as PDF or Word document</li>
                  <li>• Avoid tables and graphics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-job-purple" />
                  <CardTitle className="text-lg">Final Review</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Before submitting, make sure to review these critical points.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Spell check and grammar review</li>
                  <li>• Consistent formatting throughout</li>
                  <li>• Contact information is accurate</li>
                  <li>• File name is professional</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResumeTips;