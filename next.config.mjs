/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:["res.cloudinary.com","avatars.githubusercontent.com"]
  },
  transpilePackages: ["lucide-react"],
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;
