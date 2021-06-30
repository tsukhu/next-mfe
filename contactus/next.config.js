module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    const { webpack, isServer } = options;
    config.experiments = { topLevelAwait: true };
    config.module.rules.push({
      test: /_app.js/,
      loader: "@module-federation/nextjs-mf/lib/federation-loader.js",
    });
    if (isServer) {
      // ignore it on SSR, realistically you probably wont be SSRing Fmodules
      Object.assign(config.resolve.alias, { home: false });
    } else {
      config.plugins.push(
        new webpack.container.ModuleFederationPlugin({
          remoteType: "var",
          name: "contactus",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            // For SSR, resolve to disk path (or you can use code streaming if you have access)
            home: /* isServer
              ? path.resolve(
                  __dirname,"..","home",".next","server","static","runtime","remoteEntry.js"
                ).replace(/\\/g, '/')
              : */ "home", // for client, treat it as a global
          },
          shared: {
            react: {
              // Notice shared ARE eager here.
              eager: true,
              singleton: true,
              requiredVersion: false,
            },
          },
        })
      );
    }

    if (!isServer) {
      config.output.publicPath = "http://localhost:3001/_next/";
    }
    return config;
  },
};
