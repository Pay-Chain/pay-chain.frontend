'use client';

export function useGuides() {
  const guides = [
    {
      category: 'Getting Started',
      items: [
        {
          title: 'Introduction to Payment Kita',
          description: 'Learn about Payment Kita features and capabilities',
          href: '/docs/guides/introduction',
          readTime: '5 min',
          difficulty: 'Beginner',
          tags: ['overview'],
        },
        {
          title: 'Quick Start',
          description: 'Get up and running in 5 minutes',
          href: '/docs/guides/quick-start',
          readTime: '5 min',
          difficulty: 'Beginner',
          tags: ['setup'],
        },
        {
          title: 'Creating Your First Payment',
          description: 'Step-by-step guide to creating payments',
          href: '/docs/guides/first-payment',
          readTime: '10 min',
          difficulty: 'Beginner',
          tags: ['payments'],
        },
      ],
    },
    {
      category: 'Integration Guides',
      items: [
        {
          title: 'Hosted Checkout Integration',
          description: 'Integrate Payment Kita hosted checkout page',
          href: '/docs/guides/hosted-checkout',
          readTime: '15 min',
          difficulty: 'Intermediate',
          tags: ['checkout', 'frontend'],
          featured: true,
        },
        {
          title: 'Custom Integration',
          description: 'Build a custom payment flow with our API',
          href: '/docs/guides/custom-integration',
          readTime: '30 min',
          difficulty: 'Advanced',
          tags: ['api', 'custom'],
        },
        {
          title: 'Handling Webhooks',
          description: 'Process payment notifications securely',
          href: '/docs/guides/webhooks',
          readTime: '20 min',
          difficulty: 'Intermediate',
          tags: ['webhooks', 'backend'],
        },
      ],
    },
    {
      category: 'Advanced Topics',
      items: [
        {
          title: 'Cross-Chain Payments',
          description: 'Accept payments across different blockchains',
          href: '/docs/guides/cross-chain',
          readTime: '25 min',
          difficulty: 'Advanced',
          tags: ['cross-chain', 'bridging'],
        },
        {
          title: 'Token Swapping',
          description: 'Automatic token conversion with Uniswap',
          href: '/docs/guides/token-swapping',
          readTime: '20 min',
          difficulty: 'Advanced',
          tags: ['swap', 'defi'],
        },
        {
          title: 'Privacy Payments',
          description: 'Implement privacy-preserving payment flows',
          href: '/docs/guides/privacy-payments',
          readTime: '30 min',
          difficulty: 'Expert',
          tags: ['privacy', 'advanced'],
        },
      ],
    },
  ];

  const getDifficultyVariant = (difficulty: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      case 'Expert': return 'destructive';
      default: return 'outline';
    }
  };

  return {
    guides,
    getDifficultyVariant
  };
}
