import React from 'react';
import { Upload, Brain, Award, Unlock } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Data Ingestion',
      description: 'Advanced data pipeline processes CSV bank statements and SMS transaction records using Python and Polars for high-performance data manipulation.'
    },
    {
      icon: Brain,
      title: 'ML Processing',
      description: 'LightGBM-based hybrid machine learning model analyzes spending patterns, income stability, and financial behavior with explainable AI techniques.'
    },
    {
      icon: Award,
      title: 'Score Generation',
      description: 'FastAPI backend generates real-time credit scores with detailed explanations and confidence intervals for transparent assessment.'
    },
    {
      icon: Unlock,
      title: 'Dashboard Visualization',
      description: 'Interactive React dashboard provides comprehensive financial insights, scenario simulation, and professional PDF report generation.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            System Architecture & Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our capstone project demonstrates a complete end-to-end solution from raw data 
            ingestion to actionable financial insights through four key stages.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl p-8 shadow-lg border hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                      Stage {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-blue-200"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;