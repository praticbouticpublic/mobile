
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.praticboutic.merchant',
  appName: 'Praticboutic',
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
        // deepLinks n'est pas une propriété supportée ici ; configurer les liens profonds côté Android/iOS natif.
        // Voir AndroidManifest (intent-filters) et iOS Info.plist (URL Types / Associated Domains).
    }
  },
};

export default config;
