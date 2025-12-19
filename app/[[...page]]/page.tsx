'use client';

import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || '');

interface PageProps {
  params: {
    page?: string[];
  };
}

export default function Page({ params }: PageProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isPreviewing = useIsPreviewing();
  const pathname = usePathname();

  const urlPath = params.page ? `/${params.page.join('/')}` : '/';

  useEffect(() => {
    async function fetchContent() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
        const spaceMode = process.env.NEXT_PUBLIC_BUILDER_SPACE_MODE || 'DEDICATED';
        const clientSlug = process.env.NEXT_PUBLIC_CLIENT_SLUG;

        let url: string;

        if (spaceMode === 'SHARED' && clientSlug) {
          const query = JSON.stringify({
            'data.client_slug': clientSlug,
            'data.url_path': urlPath,
            'data.env': 'entry'
          });
          url = `https://cdn.builder.io/api/v3/content/client_page?apiKey=${apiKey}&query=${encodeURIComponent(query)}&cachebust=true&_=${Date.now()}`;
        } else {
          url = `https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}&url=${encodeURIComponent(urlPath)}&cachebust=true&_=${Date.now()}`;
        }

        const response = await fetch(url, {
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            if (spaceMode === 'SHARED' && clientSlug) {
              const contentSlug = data.results[0]?.data?.client_slug;
              if (contentSlug !== clientSlug) {
                console.error('SECURITY: Client slug mismatch');
                setLoading(false);
                return;
              }
            }

            setContent(data.results[0]);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Builder.io content:', error);
        setLoading(false);
      }
    }

    fetchContent();
  }, [urlPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!content && !isPreviewing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">Hello World</h1>
          <p className="text-2xl text-gray-700 mb-8">Welcome to test-client-8</p>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Builder.io Integration Test</h2>
            <p className="text-gray-600 mb-4">
              This page is ready for content from Builder.io. Visit{' '}
              <a href="https://builder.io" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                builder.io
              </a>{' '}
              to start creating your page content.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Testing:</strong> Builder.io and Vercel synchronization
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Client:</strong> test-client-8
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Industry:</strong> general
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://builder.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Open Builder.io
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View on Vercel
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BuilderComponent
      model={process.env.NEXT_PUBLIC_BUILDER_SPACE_MODE === 'SHARED' ? 'client_page' : 'page'}
      content={content}
    />
  );
}