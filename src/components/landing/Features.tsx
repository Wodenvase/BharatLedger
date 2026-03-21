import React from 'react';
import { BarChart3, Zap, Eye, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Holistic Credit Scoring',
      description: 'Go beyond traditional credit scores with comprehensive analysis of your financial behavior and patterns.'
    },
    {
      icon: Zap,
      title: 'Automated Data Entry',
      description: 'Effortlessly track your finances with automatic transaction categorization and SMS parsing.'
    },
    {
      icon: Eye,
      title: 'Actionable Insights',
      description: 'Understand your spending patterns like never before with detailed analytics and personalized recommendations.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and under your complete control. We never share your information without permission.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose BharatLedger?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of credit assessment in India, designed specifically 
            for the needs of informal borrowers and progressive lenders.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 rounded-full p-3 w-14 h-14 mb-6">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;