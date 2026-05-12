package com.newbrain.kol;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import androidx.core.content.ContextCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

/**
 * Updated ReminderReceiver for smart notification system
 * - Only handles showing notifications (no rescheduling)
 * - Scheduling is now handled by the JS layer with smart logic
 */
public class ReminderReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context ctx, Intent intent) {
    // Check notification permission
    if (ContextCompat.checkSelfPermission(
          ctx, Manifest.permission.POST_NOTIFICATIONS)
        != PackageManager.PERMISSION_GRANTED) {
      return;
    }

    // Build and show notification
    NotificationCompat.Builder notif = new NotificationCompat.Builder(ctx, "kol_channel")
      .setSmallIcon(R.drawable.ic_schedule)
      .setContentTitle("Professional Content Planning")
      .setContentText("Ready to create engaging content for your audience?")
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)
      .setAutoCancel(true);

    NotificationManagerCompat.from(ctx)
      .notify((int) System.currentTimeMillis(), notif.build());
  }
}