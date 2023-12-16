/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: [
    //   "files.edgestore.dev"
    // ]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**"
      }

    ]
  }
}

module.exports = nextConfig
