'use client';

import Navbar from '@/presentation/components/organisms/Navbar';
import { Card } from '@/presentation/components/atoms';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function TeamPage() {
  const team = [
    {
      name: 'Alex Chen',
      role: 'Lead Architect',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: 'Ex-Google engineer with 5 years of experience in DeFi protocol design.'
    },
    {
      name: 'Sarah Millar',
      role: 'Head of Product',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Product visionary focused on UX/UI and mass adoption of crypto payments.'
    },
    {
      name: 'David Kim',
      role: 'Senior Solidity Dev',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      bio: 'Smart contract security expert and auditor. Previously at Quantstamps.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Frontend Lead',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      bio: 'React and Web3 integration specialist. React Core contributor.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="container-app text-center mb-16 animate-fade-in-up">
          <h1 className="heading-1 mb-6">Meet the <span className="text-gradient">Builders</span></h1>
          <p className="body-lg text-muted max-w-2xl mx-auto">
            A passionate team of engineers, designers, and crypto enthusiasts working together 
            to redefine how the world moves money.
          </p>
        </section>

        <section className="container-app">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card variant="glass" hoverable className="h-full text-center group">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent-purple/50 transition-colors">
                    {/* Using Dicebear avatars for placeholders - safe external image */}
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent-purple text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-muted text-sm mb-6">{member.bio}</p>
                  
                  <div className="flex justify-center gap-4">
                    <button className="text-muted hover:text-white transition-colors">
                      <Github className="w-5 h-5" />
                    </button>
                    <button className="text-muted hover:text-[#1DA1F2] transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="text-muted hover:text-[#0A66C2] transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="container-app mt-24">
          <div className="card-glass p-12 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="heading-2 mb-4">Join Our Team</h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              We're always looking for talented individuals to join our mission. 
              Check out our open positions and help us build the future.
            </p>
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium">
              View Open Roles
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
