'use client';

import React, { useState } from 'react';
import { BarChart3, Mail, MapPin } from 'lucide-react';
import InfoModal from '../shared/InfoModal';

const Footer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);

  const infoMap: Record<string, { title: string; content: React.ReactNode }> = {
    howItWorks: {
      title: 'How It Works',
      content: (
        <div>
          <p className="mb-2">We analyze transaction behavior and alternative data to produce a transparent credit score tailored for informal borrowers.</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li>Data collection (consent-based)</li>
            <li>Behavioral & repayment analytics</li>
            <li>Score generation and lender insights</li>
          </ul>
        </div>
      ),
    },
    forBorrowers: {
      title: 'For Borrowers',
      content: (
        <div>
          <p className="mb-2">Borrowers can access their score, understand factors affecting it, and find fair lending offers.</p>
          <p className="text-sm text-gray-700">We prioritize data privacy and clear explanations.</p>
        </div>
      ),
    },
    forLenders: {
      title: 'For Lenders',
      content: (
        <div>
          <p className="mb-2">Lenders can use our scoring APIs to evaluate creditworthiness of informal borrowers and reduce default risk.</p>
          <p className="text-sm text-gray-700">Includes risk segments, feature importances, and batch scoring.</p>
        </div>
      ),
    },
    apiDocs: {
      title: 'API Documentation',
      content: (
        <div>
          <p className="mb-2">Our REST APIs provide endpoints for score retrieval, consent management, and batch uploads.</p>
          <p className="text-sm text-gray-700">Visit the API docs for authentication details, rate limits, and example requests.</p>
        </div>
      ),
    },
    support: {
      title: 'Support',
      content: (
        <div>
          <p className="mb-2">For product or technical support, reach out via email and our team will assist you within 2 business days.</p>
          <p className="text-sm text-gray-700">Include account details and a clear description of the issue.</p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div>
          <p className="mb-2">We collect data only with consent and use industry-standard safeguards to protect personal information.</p>
          <p className="text-sm text-gray-700">Read the full policy for retention, sharing, and your rights.</p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div>
          <p className="mb-2">Our terms describe permitted uses, liability limits, and service-level expectations.</p>
          <p className="text-sm text-gray-700">Please review before integrating with our platform.</p>
        </div>
      ),
    },
    dataSecurity: {
      title: 'Data Security',
      content: (
        <div>
          <p className="mb-2">We use encryption in transit and at rest, periodic audits, and access controls to secure customer data.</p>
          <p className="text-sm text-gray-700">Contact us for security whitepapers and SOC/ISO reports.</p>
        </div>
      ),
    },
    compliance: {
      title: 'Compliance',
      content: (
        <div>
          <p className="mb-2">Our platform follows applicable financial regulations and local data protection laws.</p>
          <p className="text-sm text-gray-700">We collaborate with partners to ensure regulatory alignment.</p>
        </div>
      ),
    },
    about: {
      title: 'About Us',
      content: (
        <div>
          <p className="mb-2">BharatLedger builds inclusive credit infrastructure for underserved populations in India.</p>
          <p className="text-sm text-gray-700">Our mission is fair access to finance through transparent scoring and privacy-first data use.</p>
        </div>
      ),
    },
  };

  const openInfo = (key: string) => {
    const info = infoMap[key];
    if (!info) return;
    setTitle(info.title);
    setContent(info.content);
    setOpen(true);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">BharatLedger</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering India's informal borrowers with fair, transparent, and 
              comprehensive credit scoring based on real financial behavior.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Dipanta.bhatt@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Bhopal, Madhya Pradesh</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <button type="button" onClick={() => openInfo('howItWorks')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">How It Works</button>
              <button type="button" onClick={() => openInfo('forBorrowers')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">For Borrowers</button>
              <button type="button" onClick={() => openInfo('forLenders')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">For Lenders</button>
              <button type="button" onClick={() => openInfo('apiDocs')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">API Documentation</button>
              <button type="button" onClick={() => openInfo('support')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">Support</button>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <div className="space-y-3">
              <button type="button" onClick={() => openInfo('privacy')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">Privacy Policy</button>
              <button type="button" onClick={() => openInfo('terms')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">Terms of Service</button>
              <button type="button" onClick={() => openInfo('dataSecurity')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">Data Security</button>
              <button type="button" onClick={() => openInfo('compliance')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">Compliance</button>
              <button type="button" onClick={() => openInfo('about')} className="block text-left w-full text-gray-300 hover:text-white transition-colors">About Us</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 BharatLedger. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <InfoModal open={open} title={title} onClose={() => setOpen(false)}>
        {content}
      </InfoModal>
    </footer>
  );
};

export default Footer;