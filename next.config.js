/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  webpack: (config, { webpack }) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Workaround until next fixed es6 imports (with .js extension)
    // https://github.com/vercel/next.js/discussions/32237
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(new RegExp(/\.js$/), function (
        /** @type {{ request: string }} */
        resource
      ) {
        if (resource.request === "./ipfs.js") {
          resource.request = resource.request.replace(".js", "");
        }
      })
    );
    return config;
  },
  rewrites: () => [
    {
      source: "/indexer/:call*",
      destination: "https://ovc.plopmenz.com/indexer/:call*",
    },
    {
      source: "/openrd-indexer/:call*",
      destination: "https://openrd.plopmenz.com/indexer/:call*",
    },
    {
      source: "/trustless-indexer/:call*",
      destination: "https://trustless.management/indexer/:call*",
    },
  ],
  reactStrictMode: true,
};

module.exports = nextConfig;
