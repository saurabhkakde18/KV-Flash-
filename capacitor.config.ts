import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kreditventure.kvflash',
  appName: 'KV Flash',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    url: 'http://192.168.0.240:3000'
  }
};

export default config;
