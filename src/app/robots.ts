import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/organizer/', '/sponsor/'],
    },
    sitemap: 'https://matchmysponsor.com/sitemap.xml',
  }
}