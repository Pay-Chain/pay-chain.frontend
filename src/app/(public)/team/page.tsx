import Navbar from '@/presentation/components/organisms/Navbar';
import { Card } from '@/presentation/components/atoms';
import { getServerDictionary } from '@/core/i18n/server';
import { translate } from '@/core/i18n/translate';
import { ENV } from '@/core/config/env';
import { Github, Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export default async function TeamPage() {
  const dictionary = await getServerDictionary();
  const t = (key: string) => translate(dictionary, key);
  let team: TeamMember[] = [];
  try {
    const response = await fetch(`${ENV.BACKEND_URL}/api/v1/teams`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (response.ok) {
      const json = await response.json();
      team = (json?.items || []) as TeamMember[];
    }
  } catch {
    team = [];
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <section className="container-app text-center mb-16 animate-fade-in-up">
          <h1 className="heading-1 mb-6">{t('public_team.hero.prefix')} <span className="text-gradient">{t('public_team.hero.highlight')}</span></h1>
          <p className="body-lg text-muted max-w-2xl mx-auto">
            {t('public_team.hero.subtitle')}
          </p>
        </section>

        <section className="container-app">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div 
                key={member.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card variant="glass" hoverable className="h-full text-center group">
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent-purple/50 transition-colors">
                    {/* Using Dicebear avatars for placeholders - safe external image */}
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent-purple text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-muted text-sm mb-6">{member.bio}</p>
                  
                  <div className="flex justify-center gap-4">
                    <a href={member.githubUrl || '#'} className="text-muted hover:text-white transition-colors" target="_blank" rel="noreferrer">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={member.twitterUrl || '#'} className="text-muted hover:text-[#1DA1F2] transition-colors" target="_blank" rel="noreferrer">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={member.linkedinUrl || '#'} className="text-muted hover:text-[#0A66C2] transition-colors" target="_blank" rel="noreferrer">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="container-app mt-24">
          <div className="card-glass p-12 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="heading-2 mb-4">{t('public_team.cta.title')}</h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              {t('public_team.cta.subtitle')}
            </p>
            <a href="#" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium">
              {t('public_team.cta.button')}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
