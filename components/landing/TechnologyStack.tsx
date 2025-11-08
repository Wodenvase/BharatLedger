import React from 'react';
import { Code, Database, Cpu, Globe } from 'lucide-react';

const TechnologyStack: React.FC = () => {
  const technologies = {
    backend: [
      { name: 'Python', description: 'Core backend language for data processing and ML' },
      { name: 'FastAPI', description: 'High-performance API framework for real-time services' },
      { name: 'Polars', description: 'Lightning-fast DataFrame library for data manipulation' },
      { name: 'DuckDB', description: 'Analytical database for complex financial queries' },
      { name: 'LightGBM', description: 'Gradient boosting framework for credit scoring ML model' }
    ],
    frontend: [
      { name: 'React', description: 'Modern UI library for interactive dashboard components' },
      { name: 'TypeScript', description: 'Type-safe development for robust application logic' },
      { name: 'Vite', description: 'Next-generation build tool for fast development' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework for responsive design' },
      { name: 'Recharts', description: 'Composable charting library for data visualization' }
    ]
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Technology Stack Showcase
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our capstone project leverages cutting-edge technologies to deliver a modern, 
            scalable, and maintainable solution for financial inclusion.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Backend Technologies */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center mb-8">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <Database className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Backend & ML Pipeline</h3>
                <p className="text-gray-300">High-performance data processing and machine learning</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {technologies.backend.map((tech, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-blue-300">{tech.name}</h4>
                  <p className="text-gray-300 text-sm mt-1">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Frontend Technologies */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="flex items-center mb-8">
              <div className="bg-green-600 rounded-full p-3 mr-4">
                <Globe className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Frontend & Visualization</h3>
                <p className="text-gray-300">Interactive user interface and data visualization</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {technologies.frontend.map((tech, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-lg font-semibold text-green-300">{tech.name}</h4>
                  <p className="text-gray-300 text-sm mt-1">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Architecture Highlights */}
        <div className="mt-16 bg-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Architecture Highlights</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Scalable Design</h4>
              <p className="text-gray-300 text-sm">
                Microservices architecture with containerized deployment for horizontal scaling
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Code className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Modern Standards</h4>
              <p className="text-gray-300 text-sm">
                Following industry best practices with type safety, testing, and documentation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Database className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Performance Optimized</h4>
              <p className="text-gray-300 text-sm">
                Optimized data pipelines capable of processing millions of transactions efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyStack;