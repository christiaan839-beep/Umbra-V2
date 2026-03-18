import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', 
        '/client-portal/',
        '/api/cron/', 
        '/api/agents/'
      ],
    },
    sitemap: 'https://sovereign-matrix.com/sitemap.xml',
  };
}
