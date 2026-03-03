import { resolve } from 'path';

import { defineConfig, loadEnv, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export const r = (...args: any[]) => resolve(__dirname, '.', ...args);

function configHtmlPlugin(envConfig: Record<string, string>): Plugin {
  return {
    name: 'html-transform',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, { path }) {
        if (path.endsWith('index.html') || path.endsWith('gov.html')) {
          return html.replace('<%= title %>', envConfig.M_APP_NAME);
        }
        return html;
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(env => {
  const root = process.cwd();
  const envPrefix = 'M_';
  const envConfig = loadEnv(env.mode, root, envPrefix);

  return {
    base: envConfig.M_PUBLIC_PATH,
    envPrefix,
    root,
    build: {
      target: 'es2015',
      rollupOptions: {
        input: {
          main: r('index.html'),
          gov: r('gov.html')
        }
      }
    },
    server: {
      port: 5000,
      proxy: {
        [envConfig.M_BASE_API]: {
          target: envConfig.M_API_BASEURL,
          ws: false,
          changeOrigin: true,
          // rewrite: path => path.replace(new RegExp('^' + envConfig.M_BASE_API), '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        }
      },
    },
    plugins: [
      configHtmlPlugin(envConfig),
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue'],
        dts: r('src/auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      }),
      legacy()
    ],
    resolve: {
      alias: {
        '@/': `${resolve(__dirname, 'src')}/`,
      }
    }
  };
});
