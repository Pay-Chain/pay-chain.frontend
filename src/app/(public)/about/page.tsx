import Navbar from '@/presentation/components/organisms/Navbar';
import { Card } from '@/presentation/components/atoms';
import { getServerDictionary } from '@/core/i18n/server';
import { translate } from '@/core/i18n/translate';
import { Shield, Zap, Globe, Cpu, Lock, Network, Code2, Layers } from 'lucide-react';

export default async function AboutPage() {
  const dictionary = await getServerDictionary();
  const t = (key: string) => translate(dictionary, key);
  const techStack = [
    { name: t('public_about.tech_stack.frontend.name'), text: t('public_about.tech_stack.frontend.text') },
    { name: t('public_about.tech_stack.backend.name'), text: t('public_about.tech_stack.backend.text') },
    { name: t('public_about.tech_stack.smart_contracts.name'), text: t('public_about.tech_stack.smart_contracts.text') },
    { name: t('public_about.tech_stack.indexer.name'), text: t('public_about.tech_stack.indexer.text') },
  ];

  const bridges = [
    { 
      name: t('public_about.bridges.ccip.name'), 
      desc: t('public_about.bridges.ccip.desc'),
      type: t('public_about.bridges.ccip.type')
    },
    { 
      name: t('public_about.bridges.hyperbridge.name'), 
      desc: t('public_about.bridges.hyperbridge.desc'),
      type: t('public_about.bridges.hyperbridge.type')
    },
    { 
      name: t('public_about.bridges.wormhole.name'), 
      desc: t('public_about.bridges.wormhole.desc'),
      type: t('public_about.bridges.wormhole.type')
    },
  ];

  const contracts = [
    { name: t('public_about.contracts.gateway.name'), desc: t('public_about.contracts.gateway.desc') },
    { name: t('public_about.contracts.swapper.name'), desc: t('public_about.contracts.swapper.desc') },
    { name: t('public_about.contracts.ccip.name'), desc: t('public_about.contracts.ccip.desc') },
    { name: t('public_about.contracts.hyperbridge.name'), desc: t('public_about.contracts.hyperbridge.desc') },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container-app relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in-up">
            <h1 className="heading-1 mb-6">
              {t('public_about.hero.prefix')} <span className="text-gradient">{t('public_about.hero.highlight')}</span>
            </h1>
            <p className="body-lg text-muted max-w-2xl mx-auto">
              {t('public_about.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* System Architecture Diagram (Conceptual) */}
        <section className="container-app mb-24 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="card-glass p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-6 h-6 text-accent-blue" />
              <h2 className="heading-3">{t('public_about.system_design.title')}</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-muted leading-relaxed">
                  {t('public_about.system_design.description')}
                </p>
                <ol className="list-decimal list-inside space-y-4 text-muted/80 ml-4">
                  <li>{t('public_about.system_design.steps.step_1')}</li>
                  <li>{t('public_about.system_design.steps.step_2')}</li>
                  <li>{t('public_about.system_design.steps.step_3')}</li>
                  <li>{t('public_about.system_design.steps.step_4')}</li>
                </ol>
              </div>
              
              <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                <div className="text-accent-purple mb-2">{t('public_about.system_design.tech_overview')}</div>
                {techStack.map((item) => (
                  <div key={item.name} className="flex flex-col mb-3 last:mb-0">
                    <span className="text-accent-blue font-bold">{item.name}:</span>
                    <span className="text-muted pl-4">→ {item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bridges & Security Grid */}
        <section className="container-app mb-24">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bridge Technology */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="card-glass p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Network className="w-6 h-6 text-accent-purple" />
                  <h2 className="className heading-3">{t('public_about.bridge_infrastructure.title')}</h2>
                </div>
                <div className="space-y-4">
                  {bridges.map((bridge) => (
                    <div key={bridge.name} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-purple/30 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-foreground">{bridge.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                          {bridge.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted">{bridge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Contracts */}
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="card-glass p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Code2 className="w-6 h-6 text-accent-green" />
                  <h2 className="heading-3">{t('public_about.smart_contracts.title')}</h2>
                </div>
                <div className="space-y-4">
                   {contracts.map((contract) => (
                    <div key={contract.name} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="mt-1 p-1.5 rounded-lg bg-accent-green/10 text-accent-green group-hover:bg-accent-green/20">
                         <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-mono text-sm font-semibold text-foreground mb-1">{contract.name}</h4>
                        <p className="text-sm text-muted">{contract.desc}</p>
                      </div>
                    </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="container-app">
          <div className="border border-white/10 rounded-2xl bg-linear-to-br from-black/60 to-accent-green/5 p-8 sm:p-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
             <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 mb-6">
                    <Lock className="w-4 h-4 text-accent-green" />
                    <span className="text-xs text-accent-green font-medium uppercase">{t('public_about.security.badge')}</span>
                 </div>
                 <h2 className="heading-2 mb-6">{t('public_about.security.title')}</h2>
                 <p className="body-lg text-muted mb-6">
                   {t('public_about.security.description')}
                 </p>
                 <ul className="space-y-4">
                   {[
                     t('public_about.security.items.item_1'),
                     t('public_about.security.items.item_2'),
                     t('public_about.security.items.item_3'),
                     t('public_about.security.items.item_4'),
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-muted">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                        {item}
                     </li>
                   ))}
                 </ul>
               </div>
               
               <div className="flex-1 w-full max-w-sm">
                 <div className="aspect-square rounded-2xl bg-black/40 border border-white/10 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-mesh opacity-20" />
                    <Shield className="w-32 h-32 text-accent-green/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">{t('public_about.security.audited_title')}</div>
                        <div className="text-sm text-accent-green">{t('public_about.security.audited_subtitle')}</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
