import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metamodel.demo',
  appName: 'Metamodel Demo',
  // Angular `application` builder pakuje browser izlaz u dist/demo/browser.
  webDir: 'dist/demo/browser',

  // Live-reload na fizičkom uređaju / emulatoru:
  // 1) pokreni `npm run serve:mobile` (sluša na 0.0.0.0:4200),
  // 2) otkomentariši i upiši IP adresu svoje dev mašine,
  // 3) `npx cap run android` (ili ios) učita živi dev server.
  // server: {
  //   url: 'http://192.168.1.100:4200',
  //   cleartext: true,
  // },
};

export default config;
