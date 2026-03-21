import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                BharatLedger: Empowering{' '}
                <span className="text-blue-600">Financial Inclusion</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A comprehensive credit scoring system for India's informal economy, 
                leveraging alternative data sources and machine learning to bridge the financial inclusion gap.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
              >
                View Demo Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Project Documentation
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Credit Score</span>
                  <span className="text-green-600 font-semibold">Excellent</span>
                </div>
                <div className="relative">
                  <div className="text-6xl font-bold text-center text-blue-600">720</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Monthly Income</div>
                    <div className="font-semibold">₹45,000</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Savings Rate</div>
                    <div className="font-semibold">20%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Details Card */}
        <div className="mt-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Final Year Capstone Project</h2>
            <p className="text-lg text-blue-600 font-semibold mb-6 text-center">Group Number: 150</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Team Members:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Dipanta Bhattacharyya
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Navneet Agrawal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Vinayak Dev Mishra
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Sahil Saxena
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Shubhangini Guin
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">Academic Supervisors:</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 font-medium">Supervisor:</p>
                    <p className="text-gray-800 ml-4">Dr. Ajeet Singh</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 font-medium">Reviewers:</p>
                    <ul className="space-y-1 ml-4">
                      <li className="flex items-center text-gray-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Dr. Mohammad Sultan Alam
                      </li>
                      <li className="flex items-center text-gray-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Dr. Shafiul Alom Ahmed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;