const {
  withFederatedSidecar,
  federationLoader,
} = require("@module-federation/nextjs-mf");
const deps = require("./package.json").dependencies;
module.exports = withFederatedSidecar({
  remoteType: "var",
  name: "home",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./Header": "./components/Header",
  },
  shared: {
    react: {
      // Notice shared are NOT eager here.
      requiredVersion: false,
      singleton: true,
    },
  },
})({

    webpack5: true,

  webpack(config,options) {
    const { webpack,isServer } = options;
    config.experiments = { topLevelAwait: true };
    config.module.rules.push({
      test: /_app.js/,
      loader: "@module-federation/nextjs-mf/lib/federation-loader.js",
    });
    config.plugins.push(
      new webpack.container.ModuleFederationPlugin({
        remoteType: "var",
        remotes: {},
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

    if (!isServer) {
      config.output.publicPath = "http://localhost:3000/_next/";
    }
    return config;
  },
});
