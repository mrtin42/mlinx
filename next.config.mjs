/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // disable cache for remote images
        minimumCacheTTL: 1,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.google.com',
                port: '',
                pathname: '/s2/favicons/**',
            },
            {
                protocol: 'https',
                hostname: 'users.cdn.mlinxapp.com',
                port: '',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
