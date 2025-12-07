package io.praticboutic.merchant;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.SocialLoginPlugin;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;
import com.getcapacitor.PluginHandle;
import com.getcapacitor.Plugin;
import android.content.Intent;
import android.util.Log;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin
{

   @Override
   public void onActivityResult(int requestCode, int resultCode, Intent data) {
       super.onActivityResult(requestCode, resultCode, data);

       if (requestCode >= GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MIN && requestCode < GoogleProvider.REQUEST_AUTHORIZE_GOOGLE_MAX) {
           PluginHandle pluginHandle = getBridge().getPlugin("SocialLogin");
           if (pluginHandle == null) {
             Log.i("Google Activity Result", "SocialLogin login handle is null");
             return;
           }
           Plugin plugin = pluginHandle.getInstance();
           if (!(plugin instanceof SocialLoginPlugin)) {
             Log.i("Google Activity Result", "SocialLogin plugin instance is not SocialLoginPlugin");
             return;
           }
           ((SocialLoginPlugin) plugin).handleGoogleLoginIntent(requestCode, data);
       }
   }

   public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // Utiliser toute la surface y compris derrière l'encoche
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        // Rendre la status bar blanche avec icônes foncées
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            getWindow().setStatusBarColor(android.graphics.Color.WHITE);
        }

        // Gestion deeplink (lancement à froid)
        Intent intent = getIntent();
        if (intent != null && intent.getData() != null) {
            setIntent(intent);
            handleIntent(intent);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }


    private void handleIntent(Intent intent) {
        if (intent == null) return;
        Uri data = intent.getData();
        if (data != null) {
            String path = data.getPath();
            Log.i("DeepLink", "URL reçue : " + data.toString());
            if ("/onboarding-complete".equals(path)) {
                // TODO : rediriger vers l'écran onboarding terminé
                Log.i("DeepLink", "Onboarding terminé détecté");
            }
        }
    }
}
