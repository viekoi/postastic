/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:["res.cloudinary.com"]
  },
  transpilePackages: ["lucide-react"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
