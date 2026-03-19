'use client';

import { useState } from 'react';

export function useSDK() {
  const [copiedSdk, setCopiedSdk] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSdk(id);
      setTimeout(() => setCopiedSdk(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sdks = [
    {
      name: 'JavaScript/TypeScript',
      description: 'Official SDK for JavaScript and TypeScript projects',
      npm: '@payment-kita/sdk',
      github: 'https://github.com/payment-kita/sdk-js',
      docs: '/docs/guides/javascript',
      install: 'npm install @payment-kita/sdk',
      language: 'typescript',
      featured: true,
    },
    {
      name: 'Python',
      description: 'Python SDK for backend integration',
      npm: 'payment-kita',
      github: 'https://github.com/payment-kita/sdk-python',
      docs: '/docs/guides/python',
      install: 'pip install payment-kita',
      language: 'python',
      featured: true,
    },
    {
      name: 'PHP',
      description: 'PHP SDK for Laravel and other PHP frameworks',
      npm: 'payment-kita/php',
      github: 'https://github.com/payment-kita/sdk-php',
      docs: '/docs/guides/php',
      install: 'composer require payment-kita/php',
      language: 'php',
      featured: false,
    },
  ];

  return {
    sdks,
    copiedSdk,
    handleCopy
  };
}
