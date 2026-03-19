export default function DocsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Payment Kita Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to integrate cross-chain payments into your application
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <a href="/docs/partner-api" className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer border-primary">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔑</span>
            <h3 className="text-lg font-semibold">Partner API</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Complete API documentation for partners
          </p>
          <ul className="text-sm space-y-2">
            <li>• Authentication & HMAC</li>
            <li>• Request/response schemas</li>
            <li>• Webhook integration</li>
          </ul>
        </a>

        <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">🚀 Quick Start</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get up and running with Payment Kita in minutes
          </p>
          <ul className="text-sm space-y-2">
            <li>• Create merchant account</li>
            <li>• Generate API keys</li>
            <li>• Make your first payment</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">📚 API Reference</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete API documentation with examples
          </p>
          <ul className="text-sm space-y-2">
            <li>• REST API endpoints</li>
            <li>• Request/response formats</li>
            <li>• Error handling</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">🛠️ SDKs</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Official SDKs for popular languages
          </p>
          <ul className="text-sm space-y-2">
            <li>• JavaScript/TypeScript</li>
            <li>• Python</li>
            <li>• PHP</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">📖 Guides</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step integration guides
          </p>
          <ul className="text-sm space-y-2">
            <li>• Hosted checkout</li>
            <li>• Custom integration</li>
            <li>• Webhook handling</li>
          </ul>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">🌐 Cross-Chain</h3>
            <p className="text-sm text-muted-foreground">
              Accept payments on any supported blockchain with automatic bridging
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">🔒 Secure</h3>
            <p className="text-sm text-muted-foreground">
              JWE-encrypted payment codes and HMAC-signed webhooks
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">⚡ Fast</h3>
            <p className="text-sm text-muted-foreground">
              Real-time payment status updates via WebSocket
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">💰 Multi-Token</h3>
            <p className="text-sm text-muted-foreground">
              Support for USDC, USDT, DAI, WBTC, and more
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">🔄 Auto-Swap</h3>
            <p className="text-sm text-muted-foreground">
              Automatic token swapping via Uniswap V4/V3
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2">📊 Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Real-time dashboard with payment analytics
            </p>
          </div>
        </div>
      </div>

      {/* Supported Chains */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Supported Chains</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold">Arbitrum</div>
            <div className="text-sm text-muted-foreground">Chain ID: 42161</div>
          </div>
          <div className="p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold">Base</div>
            <div className="text-sm text-muted-foreground">Chain ID: 8453</div>
          </div>
          <div className="p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold">Polygon</div>
            <div className="text-sm text-muted-foreground">Chain ID: 137</div>
          </div>
          <div className="p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold">More Soon</div>
            <div className="text-sm text-muted-foreground">Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Example</h2>
        <div className="rounded-lg border bg-muted p-6">
          <h3 className="font-semibold mb-4">Create a Payment (JavaScript)</h3>
          <pre className="text-sm overflow-x-auto">
{`import PaymentKita from '@payment-kita/sdk';

const client = new PaymentKita('YOUR_API_KEY');

const payment = await client.payment.create({
  amount: '100.00',
  currency: 'USDC',
  destChain: 'eip155:8453', // Base
  metadata: {
    orderId: 'ORDER_123',
  },
});

console.log('Payment URL:', payment.payment_url);
console.log('QR Code:', payment.payment_code);`}
          </pre>
        </div>
      </div>

      {/* Getting Started Buttons */}
      <div className="flex gap-4">
        <a href="/docs/api" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          View API Reference
        </a>
        <a href="/docs/guides" className="inline-flex items-center justify-center rounded-md border bg-background px-6 py-3 text-sm font-medium hover:bg-accent">
          Read Guides
        </a>
      </div>
    </div>
  )
}
