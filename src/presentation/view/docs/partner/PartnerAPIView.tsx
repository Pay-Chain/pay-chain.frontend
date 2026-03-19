'use client';

import { Card, Badge, Button } from '@/presentation/components/atoms';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/presentation/components/organisms/table';
import { Copy, Check, ShieldCheck, Key, Zap, Bell, Repeat, BarChart3, Code2 } from 'lucide-react';
import { usePartnerAPI } from './usePartnerAPI';
import { cn } from '@/core/utils/cn';

export function PartnerAPIView() {
  const { copiedCode, handleCopy, headers, requestSchema, webhookSchema } = usePartnerAPI();

  return (
    <div className="max-w-7xl space-y-16 animate-fade-in pb-20">
      <div className="space-y-4 animate-fade-in-up">
        <h1 className="heading-display bg-linear-to-r from-primary via-accent-blue to-accent-green bg-clip-text text-transparent">
          Partner API Documentation
        </h1>
        <p className="body-lg text-muted max-w-3xl leading-relaxed">
          The ultimate guide for institutions and high-volume platforms to integrate Payment Kita's cross-chain infrastructure at scale.
        </p>
      </div>

      {/* Authentication Section */}
      <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="heading-2 text-foreground flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Security & Authentication
        </h2>
        <Card variant="glass" size="lg" className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border-t-primary/20">
          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Key className="w-5 h-5 text-accent-blue" />
                    HMAC Authentication
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    Partners authenticate using API keys along with a cryptographic HMAC-SHA256 signature to ensure request integrity and origin.
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <span className="text-xs font-bold text-muted uppercase tracking-[0.2em] opacity-60">Required Headers</span>
                  {headers.map((header) => (
                    <div key={header.name} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 group hover:border-accent-blue/30 transition-all">
                      <div className="flex flex-col">
                        <code className="text-sm font-bold text-primary-100">{header.name}</code>
                        <span className="text-[11px] text-muted-foreground mt-0.5">{header.desc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted font-mono bg-white/5 px-2 py-1 rounded-md">{header.value}</code>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleCopy(header.value, header.name)}
                        >
                            {copiedCode === header.name ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <div className="bg-black/60 rounded-3xl border border-white/10 overflow-hidden shadow-inner h-full">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Node.js Signature</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 rounded-lg"
                        onClick={() => handleCopy('const crypto = require(\'crypto\');...', 'hmac-code')}
                    >
                        {copiedCode === 'hmac-code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <pre className="p-6 text-[13px] font-mono leading-relaxed text-primary-100/90 overflow-x-auto">
{`const crypto = require('crypto');

function generateSignature(payload, secret, timestamp) {
  const message = \`\${timestamp}.\${JSON.stringify(payload)}\`;
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// Integration Example
const ts = Math.floor(Date.now() / 1000);
const data = { amount: "100.00", currency: "USDC" };
const sig = generateSignature(data, 'SECRET', ts);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Create Payment Request Section */}
      <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="heading-2 text-foreground flex items-center gap-3">
            <Zap className="w-7 h-7 text-accent-green" />
            Core Endpoints
        </h2>
        <Card variant="glass" size="lg" className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border-t-accent-green/20">
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground items-center flex gap-3">
                    Create Payment Request
                </h3>
                <p className="text-muted mt-1">Initiate a cross-chain payment flow for your customers.</p>
              </div>
              <Badge variant="success" className="px-6 py-2 rounded-xl text-xs shadow-glow-green/20">POST</Badge>
            </div>

            <div className="flex items-center gap-3 p-5 bg-black/40 rounded-2xl border border-white/10 font-mono text-sm group">
              <span className="text-accent-green font-bold">POST</span>
              <span className="text-primary-100 flex-1 truncate font-medium">/api/v1/payment-requests</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleCopy('/api/v1/payment-requests', 'endpoint-main')}
              >
                {copiedCode === 'endpoint-main' ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-muted uppercase tracking-widest px-1">Request Schema</h4>
              <Card variant="glass" className="p-0 overflow-hidden rounded-3xl border-white/5 bg-black/20">
                <Table>
                  <TableHeader className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                    <TableRow>
                      <TableHead className="p-5">Field</TableHead>
                      <TableHead className="p-5">Type</TableHead>
                      <TableHead className="p-5">Required</TableHead>
                      <TableHead className="p-5">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-white/5">
                    {requestSchema.map((field) => (
                      <TableRow key={field.field} className="hover:bg-white/2 transition-colors border-white/5">
                        <TableCell className="p-5 font-mono text-[13px] text-primary-200 font-bold">{field.field}</TableCell>
                        <TableCell className="p-5"><code className="text-[11px] bg-white/10 px-2 py-1 rounded text-accent-blue font-bold">{field.type}</code></TableCell>
                        <TableCell className="p-5">
                          {field.required ? 
                            <Badge variant="success" className="bg-accent-green/10 text-accent-green border-accent-green/20 px-3 py-1 font-black">Yes</Badge> : 
                            <Badge variant="secondary" className="opacity-30 px-3 py-1 font-black">Optional</Badge>
                          }
                        </TableCell>
                        <TableCell className="p-5 text-sm text-white/50 leading-relaxed font-medium">{field.desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-bold text-muted uppercase tracking-widest">cURL Example</h4>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-lg"
                            onClick={() => handleCopy('curl -X POST ...', 'curl-ex')}
                        >
                            {copiedCode === 'curl-ex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <pre className="p-6 bg-black/60 rounded-3xl border border-white/10 text-xs font-mono text-primary-100 overflow-x-auto leading-loose">
{`curl -X POST https://api.payment-kita.com/api/v1/payment-requests \\
  -H "X-PK-Key: pk_live_..." \\
  -H "X-PK-Signature: ..." \\
  -H "X-PK-Timestamp: 1234567890" \\
  -d '{
    "amount": "100000000",
    "currency": "USDC",
    "dest_chain": "eip155:8453",
    "metadata": {
      "order_id": "ORDER_123"
    }
  }'`}
                    </pre>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-bold text-muted uppercase tracking-widest">Success Response</h4>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-lg"
                            onClick={() => handleCopy('{ "id": "..." }', 'res-ex')}
                        >
                            {copiedCode === 'res-ex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <pre className="p-6 bg-black/60 rounded-3xl border border-white/10 text-xs font-mono text-accent-green/90 overflow-x-auto leading-loose">
{`{
  "id": "550e8400-e29b-41d4...",
  "payment_url": "https://pay.payment-kita...",
  "status": "PENDING",
  "expires_at": "2024-03-20T13:00Z",
  "instruction": {
    "to": "0x259294aecdc0006...",
    "data": "0xafc93ccd...",
    "value": "0x0"
  }
}`}
                    </pre>
                </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Webhooks Section */}
      <section className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="heading-2 text-foreground flex items-center gap-3">
            <Bell className="w-7 h-7 text-accent-orange" />
            Webhooks Integration
        </h2>
        <Card variant="glass" size="lg" className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem] border-t-yellow-500/20">
          <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-yellow-500 font-bold">
                            <ShieldCheck className="w-5 h-5" />
                            Verification Recommended
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                            Payment Kita sends an HMAC signature with every webhook. Always verify this signature to protect against replay attacks and spoofing.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h4 className="text-sm font-bold text-muted uppercase tracking-widest">Event Schema</h4>
                        <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/20">
                            {webhookSchema.map((field) => (
                                <div key={field.field} className="p-4 border-b border-white/5 last:border-0 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col">
                                        <code className="text-sm font-bold text-primary-200">{field.field}</code>
                                        <span className="text-[11px] text-muted-foreground mt-0.5">{field.desc}</span>
                                    </div>
                                    <code className="text-[11px] bg-white/5 px-2 py-1 rounded text-accent-blue opacity-60 group-hover:opacity-100">{field.type}</code>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h4 className="text-sm font-bold text-muted uppercase tracking-widest">Webhook Handler</h4>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                            <Copy className="w-4 h-4 text-muted" />
                        </Button>
                    </div>
                    <div className="bg-black/60 rounded-3xl border border-white/10 p-6 flex-1 min-h-[300px]">
                        <pre className="text-[13px] font-mono leading-relaxed text-primary-200/80">
{`app.post('/webhook', (req, res) => {
  const sig = req.headers['x-pk-signature'];
  const ts = req.headers['x-pk-timestamp'];
  
  if (verify(req.body, sig, ts, SECRET)) {
    const { type, data } = req.body;
    
    if (type === 'payment.completed') {
      await processOrder(data.order_id);
    }
    
    return res.status(200).send('OK');
  }
  
  res.status(401).send('Invalid');
});`}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-3xl bg-accent-blue/5 border border-accent-blue/10 flex items-start gap-4">
                <div className="bg-accent-blue/10 p-3 rounded-2xl">
                    <Repeat className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-foreground">Robust Retry Logic</h4>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                        If your server is down, we'll retry notifications up to 10 times with exponential backoff (starting at 1m up to 24h).
                    </p>
                </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Tiers Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            Usage Limits & Tiers
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { tier: 'Starter', limit: '100', popular: false, desc: 'For small projects' },
            { tier: 'Professional', limit: '1,000', popular: true, desc: 'For growing platforms' },
            { tier: 'Enterprise', limit: '10,000+', popular: false, desc: 'Custom infrastructure' }
          ].map((pkg) => (
            <Card key={pkg.tier} className={cn(
              "p-8 rounded-[2.5rem] border-2 transition-all duration-500 group relative",
              pkg.popular ? "border-primary bg-primary/5 shadow-glow-purple" : "border-white/10 bg-white/5 hover:border-white/20"
            )}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    Most Popular
                </div>
              )}
              <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{pkg.tier}</h4>
              <p className="text-xs text-muted mb-6">{pkg.desc}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold text-foreground">{pkg.limit}</span>
                <span className="text-xs font-bold text-muted uppercase tracking-widest">RPM</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Requests per minute</p>
              
              <Button 
                variant={pkg.popular ? "primary" : "outline"}
                className="w-full mt-8 rounded-2xl h-12 font-bold"
              >
                {pkg.tier === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
