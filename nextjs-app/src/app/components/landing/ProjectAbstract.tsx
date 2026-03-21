import React from 'react';
import { BookOpen, Target, Zap } from 'lucide-react';

const ProjectAbstract: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Project Abstract
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            This capstone project addresses the critical challenge of financial exclusion in India, 
            where over 190 million adults remain "credit invisible" due to lack of formal credit history. 
            BharatLedger introduces a novel hybrid credit scoring methodology that leverages alternative 
            data sources including SMS transaction records and CSV bank statements.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Motivation</h3>
            <p className="text-gray-600 leading-relaxed">
              Traditional credit scoring systems fail to assess the creditworthiness of India's 
              informal economy participants, creating barriers to financial inclusion and economic growth.
            </p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Methodology</h3>
            <p className="text-gray-600 leading-relaxed">
              Our system employs advanced data processing pipelines using Python, Polars, and DuckDB, 
              combined with LightGBM machine learning models to generate explainable credit scores.
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-8 text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Impact</h3>
            <p className="text-gray-600 leading-relaxed">
              The project demonstrates significant socio-technical impact by providing fair, 
              transparent credit assessment tools that can bridge the financial inclusion gap.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Technical Contributions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Backend Architecture:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Robust data pipeline for SMS and CSV transaction processing</li>
                <li>• Hybrid machine learning model using LightGBM for credit scoring</li>
                <li>• FastAPI-based RESTful services for real-time score computation</li>
                <li>• Advanced data validation and anomaly detection systems</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Frontend Innovation:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Interactive React dashboard with real-time data visualization</li>
                <li>• Advanced filtering and search capabilities for transaction analysis</li>
                <li>• "What-If" scenario simulation for credit score forecasting</li>
                <li>• Professional PDF report generation for stakeholder communication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectAbstract;