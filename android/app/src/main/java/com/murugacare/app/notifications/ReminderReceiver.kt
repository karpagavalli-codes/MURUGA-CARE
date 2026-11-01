package com.murugacare.app.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.murugacare.app.MurugaCareApp

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val title = intent.getStringExtra("EXTRA_TITLE") ?: "Muruga Care Reminder"
        val message = intent.getStringExtra("EXTRA_MESSAGE") ?: "Bala Murugan is cheering you on!"
        val id = intent.getIntExtra("EXTRA_ID", 1001)

        when (action) {
            "com.murugacare.app.ACTION_SCHEDULE_REMINDER" -> {
                MurugaNotificationManager.showReminderNotification(
                    context = context,
                    notificationId = id,
                    title = title,
                    message = message,
                    channelId = MurugaCareApp.CHANNEL_SCHEDULE
                )
            }
            "com.murugacare.app.ACTION_HYDRATION_REMINDER" -> {
                MurugaNotificationManager.showReminderNotification(
                    context = context,
                    notificationId = id,
                    title = title,
                    message = message,
                    channelId = MurugaCareApp.CHANNEL_HYDRATION
                )
                // Reschedule next hydration reminder (e.g., 90 minutes)
                MurugaNotificationManager.scheduleHydrationInterval(context, 90)
            }
            Intent.ACTION_BOOT_COMPLETED -> {
                // Device rebooted, reschedule recurring reminders
                MurugaNotificationManager.scheduleHydrationInterval(context, 90)
            }
        }
    }
}
