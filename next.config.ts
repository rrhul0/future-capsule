import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/share-capsule-:id(\\w+)',
        destination: '/share/capsule/:id',
        permanent: true
      }
    ]
  }
}

export default nextConfig
