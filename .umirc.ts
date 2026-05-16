import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: { type: 'none' },
  routes: [],
  outputPath: 'dist',
  proxy: {},
});
