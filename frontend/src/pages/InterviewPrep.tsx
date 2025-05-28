import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Clock, Users, Briefcase, Brain, Star } from "lucide-react";

const InterviewPrep = () => {
  const commonQuestions = [
    {
      question: "Tell me about yourself",
      tip: "Prepare a 2-minute elevator pitch focusing on your professional background and relevant achievements"
    },
    {
      question: "Why do you want this job?",
      tip: "Research the company and role thoroughly, then explain how your goals align with the position"
    },
    {
      question: "What are your strengths and weaknesses?",
      tip: "Choose real strengths relevant to the job and a weakness you're actively working to improve"
    },
    {
      question: "Where do you see yourself in 5 years?",
      tip: "Show ambition while demonstrating commitment to growing within the company"
    },
    {
      question: "Why are you leaving your current job?",
      tip: "Stay positive and focus on growth opportunities rather than negative aspects"
    }
  ];

  const interviewTypes = [
    {
      icon: MessageCircle,
      title: "Phone/Video Interview",
      description: "First round screening interviews",
      tips: [
        "Test your technology beforehand",
        "Find a quiet, well-lit space",
        "Have your resume and notes ready",
        "Dress professionally even on video"
      ]
    },
    {
      icon: Users,
      title: "Panel Interview",
      description: "Multiple interviewers asking questions",
      tips: [
        "Make eye contact with all panel members",
        "Address questions to the person who asked",
        "Remember each interviewer's name",
        "Bring multiple copies of your resume"
      ]
    },
    {
      icon: Briefcase,
      title: "Case Study Interview",
      description: "Problem-solving and analytical skills",
      tips: [
        "Think out loud during your analysis",
        "Ask clarifying questions",
        "Structure your approach clearly",
        "Consider multiple solutions"
      ]
    },
    {
      icon: Brain,
      title: "Behavioral Interview",
      description: "Past experiences and situational questions",
      tips: [
        "Use the STAR method (Situation, Task, Action, Result)",
        "Prepare specific examples from your experience",
        "Focus on your role in team successes",
        "Be honest about challenges and lessons learned"
      ]
    }
  ];

  const preparationSteps = [
    "Research the company, its culture, and recent news",
    "Review the job description and match your skills",
    "Prepare your own questions about the role and company",
    "Practice your answers to common interview questions",
    "Plan your outfit and route to the interview location",
    "Prepare multiple copies of your resume and references"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Preparation</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the art of interviewing with our comprehensive guide to preparation and best practices.
            </p>
          </div>

          {/* STAR Method Feature */}
          <Card className="mb-12 bg-gradient-to-r from-job-blue to-job-purple text-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <CardTitle className="text-white">The STAR Method</CardTitle>
              </div>
              <CardDescription className="text-white/90">
                A proven framework for answering behavioral interview questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Situation</h4>
                  <p className="text-white/90 text-sm">Set the context and background</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Task</h4>
                  <p className="text-white/90 text-sm">Describe what needed to be done</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Action</h4>
                  <p className="text-white/90 text-sm">Explain what you specifically did</p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Result</h4>
                  <p className="text-white/90 text-sm">Share the positive outcome</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Types of Interviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewTypes.map((type, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-job-blue/10 rounded-lg">
                        <type.icon className="w-6 h-6 text-job-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-job-purple rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Questions */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Common Interview Questions</CardTitle>
              <CardDescription>
                Prepare thoughtful answers to these frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {commonQuestions.map((item, index) => (
                  <div key={index} className="border-l-4 border-job-purple pl-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">"{item.question}"</h3>
                    <p className="text-gray-600 text-sm">{item.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preparation Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-job-blue" />
                  <CardTitle>Pre-Interview Checklist</CardTitle>
                </div>
                <CardDescription>
                  Essential steps to take before your interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {preparationSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-job-blue text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Day of Interview Tips</CardTitle>
                <CardDescription>
                  Make a great impression on interview day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Before the Interview</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Arrive 10-15 minutes early</li>
                      <li>• Bring extra copies of your resume</li>
                      <li>• Turn off your phone</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">During the Interview</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maintain good eye contact</li>
                      <li>• Listen actively and ask questions</li>
                      <li>• Be enthusiastic and authentic</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">After the Interview</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Send a thank-you email within 24 hours</li>
                      <li>• Follow up if you haven't heard back</li>
                      <li>• Reflect on areas for improvement</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InterviewPrep;