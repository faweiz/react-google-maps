import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const {GOOGLE_MAPS_API_KEY = ''} = loadEnv(mode, process.cwd(), '');
  const {GOOGLE_MAP_ID = ''} = loadEnv(mode, process.cwd(), '');
  const {OpenWeather_API_KEY = ''} = loadEnv(mode, process.cwd(), '');
  const {Zip_Code_Master_API_KEY = ''} = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY),
      'process.env.GOOGLE_MAP_ID': JSON.stringify(GOOGLE_MAP_ID),
      'process.env.OpenWeather_API_KEY': JSON.stringify(OpenWeather_API_KEY),
      'process.env.Zip_Code_Master_API_KEY': JSON.stringify(Zip_Code_Master_API_KEY)
    },
    resolve: {
      alias: {
        '@vis.gl/react-google-maps/examples.js':
          'https://visgl.github.io/react-google-maps/scripts/examples.js'
      }
    }
  };
});
