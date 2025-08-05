
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.praticboutic.merchant',
  appName: 'Praticboutic Mobile',
  webDir: 'dist/browser',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    App: {
      deepLinks: [
        {
          scheme: 'praticboutic',
          host: '',
          path: '/onboarding-complete'
        }
      ]
    }
  },
};

export default config;
