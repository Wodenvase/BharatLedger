import React from 'react';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';

const TrustSecurity: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted both in transit and at rest using industry-standard protocols.'
    },
    {
      icon: Eye,
      title: 'Full Transparency',
      description: 'You can see exactly how your credit score is calculated and what factors influence it.'
    },
    {
      icon: Shield,
      title: 'Your Data, Your Control',
      description: 'You decide what data to share, with whom, and for how long. Revoke access anytime.'
    },
    {
      icon: CheckCircle,
      title: 'Regulatory Compliant',
      description: 'We follow all RBI guidelines and data protection regulations to keep your information safe.'
    }
  ];

  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Your Trust is Our Foundation
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We understand the importance of financial privacy. That's why we've built 
            BharatLedger with security and transparency at its core.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="bg-blue-800 rounded-full p-4 w-16 h-16 mx-auto mb-6 group-hover:bg-blue-700 transition-colors">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 bg-blue-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Security Certifications</h3>
          <p className="text-blue-100 mb-6">
            We maintain the highest standards of data protection and security compliance.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="bg-blue-700 px-4 py-2 rounded-lg">ISO 27001 Certified</div>
            <div className="bg-blue-700 px-4 py-2 rounded-lg">RBI Compliant</div>
            <div className="bg-blue-700 px-4 py-2 rounded-lg">GDPR Ready</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecurity;