/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // You can add more hosts if needed, for example:
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '4000',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
