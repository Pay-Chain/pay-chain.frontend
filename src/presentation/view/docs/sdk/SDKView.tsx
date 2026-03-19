'use client';

import { Card, Badge, Button } from '@/presentation/components/atoms';
import { Download, Github, ExternalLink, Copy, Check } from 'lucide-react';
import { useSDK } from './useSDK';

export function SDKView() {
  const { sdks, copiedSdk, handleCopy } = useSDK();

  return (
    <div className="max-w-7xl space-y-16 animate-fade-in">
      <div className="animate-fade-in-up">
        <h1 className="heading-1 text-foreground">SDKs & Libraries</h1>
        <p className="body-lg text-muted mt-2">
          Official SDKs for easy integration with Payment Kita
        </p>
      </div>

      {/* Featured SDKs */}
      <div className="grid gap-6 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {sdks.filter(sdk => sdk.featured).map((sdk) => (
          <Card key={sdk.name} variant="glass" size="lg" hoverable className="border-primary/20 bg-white/5 shadow-glow-purple/10">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="heading-3 text-foreground group-hover:text-primary transition-colors">{sdk.name}</h3>
                <Badge variant="success" className="shadow-glow-green/20">Recommended</Badge>
              </div>
              <p className="text-sm text-muted">{sdk.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted">Installation</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(sdk.install, `${sdk.name}-install`)}
                    aria-label={`Copy ${sdk.install}`}
                    className="h-8 w-8 p-0"
                  >
                    {copiedSdk === `${sdk.name}-install` ? (
                      <Check className="h-4 w-4 text-accent-green" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-sm font-mono overflow-x-auto border border-white/10 text-foreground/80">
                  <span className="text-primary mr-2">$</span> {sdk.install}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" className="rounded-xl flex-1 border-white/10 hover:bg-white/5">
                  <a href={sdk.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full">
                    <Github className="h-4 w-4 mr-2" aria-hidden="true" />
                    GitHub
                  </a>
                </Button>
                <Button size="sm" className="rounded-xl flex-1 shadow-glow-purple">
                  <a href={sdk.docs} className="flex items-center justify-center w-full">
                    <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                    Documentation
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Other SDKs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="heading-2 text-foreground mb-4">Other SDKs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {sdks.filter(sdk => !sdk.featured).map((sdk) => (
            <Card key={sdk.name} className="bg-white/5 border-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-colors">
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="heading-4 text-foreground">{sdk.name}</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed">{sdk.description}</p>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider opacity-60">Install:</span>
                  <code className="text-[11px] bg-white/5 px-3 py-1.5 rounded-xl block overflow-x-auto border border-white/5 text-primary-100 font-mono">
                    {sdk.install}
                  </code>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/5 hover:bg-white/5 flex-1">
                    <a href={sdk.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-xs">
                      <Github className="h-3 w-3 mr-1" aria-hidden="true" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-white/5 flex-1 text-muted">
                    <a href={sdk.docs} className="flex items-center justify-center text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                      Docs
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <Card variant="glass" size="lg" className="bg-white/5 border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading-3 text-foreground">Quick Start Example</h3>
              <p className="text-sm text-muted mt-1">Get started with the JavaScript SDK</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(`import PaymentKita from '@payment-kita/sdk';\n\n// Initialize client\nconst client = new PaymentKita('YOUR_API_KEY');`, 'code-example')}
              className="rounded-xl border border-white/5"
            >
              {copiedSdk === 'code-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-px bg-linear-to-r from-primary/20 via-accent-green/20 to-accent-blue/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <pre className="relative bg-black/40 p-6 rounded-2xl text-[13px] leading-relaxed overflow-x-auto border border-white/10 font-mono text-primary-100">
              {`import PaymentKita from '@payment-kita/sdk';

// Initialize client
const client = new PaymentKita('YOUR_API_KEY');

// Create a payment
const payment = await client.payment.create({
  amount: '100.00',
  currency: 'USDC',
  destChain: 'eip155:8453',
  metadata: {
    orderId: 'ORDER_123',
  },
});

// Get payment status
const status = await client.payment.getStatus(payment.id);
console.log('Payment status:', status);

// Handle webhook
app.post('/webhook', (req, res) => {
  const event = client.webhook.verify(req.body, req.headers);
  
  if (event.type === 'payment.completed') {
    console.log('Payment completed:', event.data);
  }
  
  res.send('OK');
});`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
