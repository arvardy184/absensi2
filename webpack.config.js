const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Tambahan konfigurasi untuk optimasi web
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@supabase/supabase-js']
      }
    },
    argv
  );

  // Optimasi untuk production build
  if (env.mode === 'production') {
    // Enable source maps untuk debugging
    config.devtool = 'source-map';
    
    // Optimasi bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
          },
        },
      },
    };
  }

  // Resolve alias untuk memastikan imports berfungsi dengan baik
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': './src',
  };

  // Tambahan loader untuk file yang mungkin diperlukan
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['babel-preset-expo'],
      },
    },
  });

  return config;
};
