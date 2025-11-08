import React from 'react';
import { Users, Award, BookOpen } from 'lucide-react';

const TeamSection: React.FC = () => {
  const teamMembers = [
    { name: 'Dipanta Bhattacharyya', role: 'Backend Architecture & ML Pipeline' },
    { name: 'Navneet Agrawal', role: 'Frontend Development & UI/UX' },
    { name: 'Vinayak Dev Mishra', role: 'Data Processing & Analytics' },
    { name: 'Sahil Saxena', role: 'System Integration & Testing' },
    { name: 'Shubhangini Guin', role: 'Research & Documentation' }
  ];

  const supervisors = [
    {
      name: 'Dr. Ajeet Singh',
      role: 'Project Supervisor',
      description: 'Guiding the technical direction and academic rigor of the capstone project'
    }
  ];

  const reviewers = [
    {
      name: 'Dr. Mohammad Sultan Alam',
      role: 'Project Reviewer',
      description: 'Evaluating the technical implementation and innovation aspects'
    },
    {
      name: 'Dr. Shafiul Alom Ahmed',
      role: 'Project Reviewer',
      description: 'Assessing the research methodology and academic contribution'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet the Team & Academic Supervisors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A dedicated team of final-year students working under expert academic guidance 
            to deliver innovative solutions for financial inclusion.
          </p>
        </div>
        
        {/* Team Members */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Development Team</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Academic Supervision */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Supervisor */}
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Project Supervisor</h3>
            </div>
            
            {supervisors.map((supervisor, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl">
                  {supervisor.name.split(' ').slice(-2).map(n => n[0]).join('')}
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{supervisor.name}</h4>
                  <p className="text-green-600 font-semibold mb-4">{supervisor.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{supervisor.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Reviewers */}
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Project Reviewers</h3>
            </div>
            
            <div className="space-y-6">
              {reviewers.map((reviewer, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {reviewer.name.split(' ').slice(-2).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{reviewer.name}</h4>
                      <p className="text-purple-600 font-semibold text-sm mb-2">{reviewer.role}</p>
                      <p className="text-gray-600 text-sm">{reviewer.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Project Stats */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Project Statistics</h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">150</div>
              <div className="text-gray-600">Group Number</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">Academic Supervisors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12+</div>
              <div className="text-gray-600">Months Development</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;