// src/pages/LandingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BriefcaseIcon, ClipboardCheck, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import TestimonialsSection from '../../components/layout/TestimonialsSection';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      name: 'Job Search & Tracking',
      description: 'Search and track all your job applications in one place with our intuitive Kanban board.',
      icon: BriefcaseIcon,
    },
    {
      name: 'Smart Documents',
      description: 'AI-powered resume parser and cover letter generator to help you stand out.',
      icon: FileText,
    },
    {
      name: 'Application Analytics',
      description: 'Get insights into your job search with detailed analytics and progress tracking.',
      icon: ClipboardCheck,
    },
  ];

  // Animation classes for elements as they enter viewport
  const fadeInUp = "opacity-0 translate-y-10 transition duration-1000 ease-out";
  const fadeIn = "opacity-0 transition duration-1000 ease-out";

  useEffect(() => {
    // Simple intersection observer for fade-in animations
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1
    });

    // Observe all elements with animation classes
    document.querySelectorAll('.animate').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className={`animate ${fadeInUp}`}>
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  Latest Updates
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </span>
              </a>
            </div>
            <div className={`animate ${fadeInUp}`}>
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Smart Job Application Tracker
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Streamline your job search with our intelligent application tracking system. 
                From resume parsing to interview preparation, we&apos;ve got you covered.
              </p>
            </div>
            <div className={`animate ${fadeInUp} mt-10 flex items-center gap-x-6`}>
              <button
                onClick={() => navigate('/register')}
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Sign in <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className={`animate ${fadeIn} mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0`}>
            <img
              src="/api/placeholder/800/600"
              alt="App screenshot"
              className="w-[48rem] rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className={`animate ${fadeInUp} mx-auto max-w-2xl lg:text-center`}>
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            All-in-One Job Application Management
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Keep track of your entire job search journey with our comprehensive suite of tools and features.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className={`animate ${fadeInUp}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-blue-600" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Stats Section */}
      <div className={`animate ${fadeInUp} bg-white py-24 sm:py-32`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by thousands of job seekers worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join our growing community of successful professionals
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { id: 1, name: 'Active Users', value: '8,000+' },
                { id: 2, name: 'Jobs Tracked', value: '50,000+' },
                { id: 3, name: 'Success Rate', value: '75%' },
                { id: 4, name: 'Companies', value: '2,000+' },
              ].map((stat) => (
                <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`animate ${fadeInUp} relative isolate overflow-hidden bg-gray-900`}>
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to supercharge your job search?
              <br />
              Get started today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of successful job seekers who have streamlined their application process with our platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/register')}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold leading-6 text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25" />
        </div>
      </div>

      <Footer />
    </div>
  );
}