package org.th8ta.vallo;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import com.bkon.capacitor.DarkMode.DarkMode;
import com.getcapacitor.community.database.sqlite.CapacitorSQLite;
import com.nikosdouvlis.navigationbar.NavigationBar;
import com.ahm.capacitor.biometric.BiometricAuth;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(DarkMode.class);
      add(CapacitorSQLite.class);
      add(NavigationBar.class);
      add(BiometricAuth.class);
    }});
  }
}
