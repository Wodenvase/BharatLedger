import React from 'react';
import { User, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TargetAudience: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Built for Real India
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're an individual looking to build credit or a lender 
            seeking better risk assessment, BharatLedger is designed for you.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Borrowers */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 lg:p-12">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mb-6">
              <User className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">For Borrowers</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Build a formal credit history even without traditional banking relationships</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Understand your financial patterns and get personalized improvement tips</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Access better loan terms by showcasing your true financial behavior</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Generate professional credit reports to share with lenders</p>
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors group"
            >
              Start Building Credit
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* For Lenders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 lg:p-12">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mb-6">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">For Lenders & MFIs</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Reduce risk by accessing comprehensive financial behavior data</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Lend confidently to previously "credit invisible" populations</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Automate due diligence with AI-powered risk assessment</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">Integrate our APIs into your existing loan processing workflow</p>
              </div>
            </div>
            
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group">
              Partner With Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;