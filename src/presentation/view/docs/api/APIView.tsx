'use client';

import { Card, Badge, Button } from '@/presentation/components/atoms';
import { Copy, Check, Shield, Globe, Terminal, AlertCircle } from 'lucide-react';
import { useAPI } from './useAPI';

export function APIView() {
  const { endpoints, copiedEndpoint, handleCopy, getMethodVariant } = useAPI();

  return (
    <div className="max-w-7xl space-y-16 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="heading-1 text-foreground">API Reference</h1>
          <p className="body-lg text-muted mt-2">
            Complete API documentation for Payment Kita
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted uppercase tracking-wider">v1.0.0 stable</span>
        </div>
      </div>

      {/* Base URL */}
      <Card variant="glass" size="lg" className="bg-white/5 border-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-glow-purple/5">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-foreground">Base URL</h3>
                <p className="text-sm text-muted">All API requests should be made to this base URL</p>
            </div>
          </div>
          <div className="flex gap-3 items-center group">
            <div className="flex-1 bg-black/40 p-4 rounded-2xl text-[13px] font-mono border border-white/10 text-primary-100 flex items-center justify-between group-hover:border-primary/30 transition-all">
              <span>https://api.payment-kita.com</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('https://api.payment-kita.com', 'base-url')}
                className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg"
              >
                {copiedEndpoint === 'base-url' ? (
                  <Check className="h-4 w-4 text-accent-green" />
                ) : (
                  <Copy className="h-4 w-4 text-muted" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Endpoints */}
      <div className="grid gap-6">
        {endpoints.map((section, sIndex) => (
          <div key={section.category} className="space-y-4 animate-fade-in-up" style={{ animationDelay: `${150 + sIndex * 50}ms` }}>
            <h3 className="heading-3 text-foreground px-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary/60" />
                {section.category}
            </h3>
            <div className="grid gap-3">
              {section.items.map((endpoint, index) => (
                <Card 
                    key={index} 
                    variant="glass"
                    size="sm"
                    hoverable
                    className="p-0 bg-white/5 border-white/10 transition-all rounded-2xl overflow-hidden group"
                >
                  <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <Badge variant={getMethodVariant(endpoint.method)} className="w-16 flex justify-center py-1 rounded-lg">
                            {endpoint.method}
                        </Badge>
                        {endpoint.auth && (
                            <div title="Authentication Required" className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                            </div>
                        )}
                    </div>
                    <code className="flex-1 text-sm font-mono text-primary-50 truncate bg-black/20 px-3 py-1.5 rounded-xl border border-white/5 group-hover:border-white/10 transition-all">
                        {endpoint.path}
                    </code>
                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                        <span className="text-xs text-muted text-right italic">{endpoint.description}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(endpoint.path, `${section.category}-${index}`)}
                            className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg shrink-0"
                        >
                            {copiedEndpoint === `${section.category}-${index}` ? (
                            <Check className="h-4 w-4 text-accent-green" />
                            ) : (
                            <Copy className="h-4 w-4 text-muted" />
                            )}
                        </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Error Codes */}
      <Card variant="glass" size="lg" className="bg-white/5 border-white/10 rounded-3xl overflow-hidden shadow-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
                <h3 className="heading-3 text-foreground">Error Codes</h3>
                <p className="text-sm text-muted">Standard HTTP error codes returned by the API</p>
            </div>
          </div>
          <div className="grid gap-2">
            {[
              { code: '400', label: 'Bad Request', desc: 'Invalid request parameters' },
              { code: '401', label: 'Unauthorized', desc: 'Missing or invalid authentication' },
              { code: '403', label: 'Forbidden', desc: 'Insufficient permissions' },
              { code: '404', label: 'Not Found', desc: 'Resource not found' },
              { code: '500', label: 'Server Error', desc: 'Internal server error' },
            ].map((err) => (
              <div key={err.code} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                <div className="flex items-center gap-4">
                    <code className="text-sm font-bold font-mono text-red-400 w-12">{err.code}</code>
                    <span className="text-sm font-medium text-foreground/90">{err.label}</span>
                </div>
                <span className="text-xs text-muted font-medium bg-black/20 px-3 py-1 rounded-lg">{err.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
