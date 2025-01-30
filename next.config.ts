import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/share-capsule-:id(\\w+)',
      destination: '/share/capsule/:id'
    }
  ],
  redirects: async () => [
    {
      source: '/settings',
      destination: '/settings/profile',
      permanent: true
    }
  ]
}

export default nextConfig
