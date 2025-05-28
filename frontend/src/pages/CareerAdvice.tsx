import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, TrendingUp, Users, BookOpen, Star } from "lucide-react";

const CareerAdvice = () => {
  const adviceCategories = [
    {
      icon: Target,
      title: "Career Planning",
      description: "Set clear goals and create a roadmap for your professional journey",
      tips: [
        "Define your short-term and long-term career goals",
        "Research industry trends and future opportunities",
        "Identify skills gaps and create a learning plan",
        "Build a personal brand that aligns with your goals"
      ]
    },
    {
      icon: TrendingUp,
      title: "Professional Growth",
      description: "Strategies to advance your career and increase your value",
      tips: [
        "Seek mentorship and guidance from industry leaders",
        "Take on challenging projects outside your comfort zone",
        "Develop leadership and communication skills",
        "Stay updated with industry certifications"
      ]
    },
    {
      icon: Users,
      title: "Networking",
      description: "Build meaningful professional relationships",
      tips: [
        "Attend industry events and conferences",
        "Join professional associations and online communities",
        "Maintain relationships with former colleagues",
        "Offer help to others before asking for favors"
      ]
    },
    {
      icon: BookOpen,
      title: "Skill Development",
      description: "Continuously improve and learn new skills",
      tips: [
        "Identify in-demand skills in your field",
        "Take online courses and attend workshops",
        "Practice new skills through side projects",
        "Document your learning journey"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Advice</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert guidance to help you navigate your career journey and achieve professional success.
            </p>
          </div>

          {/* Featured Article */}
          <Card className="mb-12 bg-gradient-to-r from-job-blue to-job-purple text-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <CardTitle className="text-white">Featured Career Insight</CardTitle>
              </div>
              <CardDescription className="text-white/90">
                The key to career success in today's rapidly changing job market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/95 mb-4">
                In today's dynamic professional landscape, adaptability and continuous learning are more important than ever. 
                The most successful professionals are those who embrace change, stay curious, and proactively develop new skills.
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-1">
                <li>Stay ahead of industry trends</li>
                <li>Build a diverse skill set</li>
                <li>Cultivate emotional intelligence</li>
                <li>Embrace digital transformation</li>
              </ul>
            </CardContent>
          </Card>

          {/* Advice Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {adviceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-job-blue/10 rounded-lg">
                      <category.icon className="w-6 h-6 text-job-blue" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-job-purple mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Career Tips</CardTitle>
              <CardDescription>
                Essential advice for every professional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Be Proactive</h4>
                  <p className="text-gray-600 text-sm">Take initiative and don't wait for opportunities to come to you.</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Stay Curious</h4>
                  <p className="text-gray-600 text-sm">Always be learning and asking questions about your industry.</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Build Relationships</h4>
                  <p className="text-gray-600 text-sm">Your network is your net worth - invest in meaningful connections.</p>
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

export default CareerAdvice;