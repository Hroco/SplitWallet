import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'spit-wallet',
  webDir: 'build',
  server: {
    url: 'http://192.168.0.10:3000',
    cleartext: true,
  },
};

export default config;
