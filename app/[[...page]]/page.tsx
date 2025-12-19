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
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Test Client 8!</h1>
        <p className="text-gray-600 mb-8 text-center max-w-2xl">
          This page is waiting for content. Visit{' '}
          <a href="https://builder.io" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
            builder.io
          </a>{' '}
          to start creating your marketing pages and unlock the full potential of your digital presence.
        </p>
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