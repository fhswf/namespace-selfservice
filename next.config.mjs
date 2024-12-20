/** @type {import('next').NextConfig} */

const basePath = process.env.BASE_PATH ?? "";

const nextConfig = {
	output: "standalone",
	basePath,
	env: {
		basePath,
	},
	trailingSlash: true,
};

export default nextConfig;
