import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '',
}

export const metadata: Metadata = {
  title: 'Title',
  description: 'Description',
  // keywords: [],
  // authors: [{ name: '' }],
  // generator: 'Next.js',
  // applicationName: '',
  // referrer: 'origin-when-cross-origin',
  // creator: '',
  // publisher: '',
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },
  // metadataBase: new URL(''),
  // alternates: {
  //   canonical: '',
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     'index': true,
  //     'follow': true,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
  // openGraph: {
  //   type: 'website',
  //   locale: 'en_AU',
  //   url: '',
  //   title: '',
  //   description: '',
  //   siteName: '',
  //   images: [
  //     {
  //       url: '',
  //       width: 1200,
  //       height: 630,
  //       alt: '',
  //     },
  //   ],
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: '',
  //   description: '',
  //   images: [''],
  // },
  // other: {
  //   'og:logo': '',
  // },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': '',
  'image': '',
  'logo': '',
  'description': '',
  'url': '',
  'telephone': '',
  'email': '',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': '',
    'addressRegion': '',
    'postalCode': '',
    'addressCountry': '',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': -12.3456,
    'longitude': 12.3456,
  },
  'openingHours': [''],
  'serviceArea': {
    '@type': 'GeoCircle',
    'geoMidpoint': {
      '@type': 'GeoCoordinates',
      'latitude': -12.3456,
      'longitude': 12.3456,
    },
    'geoRadius': '50000',
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': '',
    'itemListElement': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': '',
          'description': '',
          'provider': {
            '@type': 'LocalBusiness',
            'name': '',
          },
        },
      },
    ],
  },
  'priceRange': '$$',
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '5.0',
    'reviewCount': '1',
  },
  'sameAs': [],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
