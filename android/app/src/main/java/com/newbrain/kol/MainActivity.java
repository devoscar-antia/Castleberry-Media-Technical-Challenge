package com.newbrain.kol;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Calendar;

/**
 * Updated MainActivity for smart reminder system
 * - Only handles permission requests and notification channel setup
 * - Removes old weekly alarm scheduling (now handled by JS layer)
 */
public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Request notification permission for Android 13+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
          != PackageManager.PERMISSION_GRANTED) {
        ActivityCompat.requestPermissions(this,
            new String[]{Manifest.permission.POST_NOTIFICATIONS}, 100);
      }
    }

    // Request exact alarm permission for Android S+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
      if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
        Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
        startActivity(intent);
      }
    }

    // Create notification channel for Android O+
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(
          "kol_channel",
          "KOL Reminders",
          NotificationManager.IMPORTANCE_DEFAULT
      );
      channel.setDescription("Professional content planning reminders");
      
      NotificationManager manager = getSystemService(NotificationManager.class);
      if (manager != null) {
        manager.createNotificationChannel(channel);
      }
    }
  }
}