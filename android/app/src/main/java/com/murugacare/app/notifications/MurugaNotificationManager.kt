package com.murugacare.app.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.murugacare.app.MainActivity
import com.murugacare.app.MurugaCareApp
import com.murugacare.app.R
import java.util.Calendar

object MurugaNotificationManager {

    fun showReminderNotification(
        context: Context,
        notificationId: Int,
        title: String,
        message: String,
        channelId: String = MurugaCareApp.CHANNEL_SCHEDULE
    ) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        try {
            val manager = NotificationManagerCompat.from(context)
            if (manager.areNotificationsEnabled()) {
                manager.notify(notificationId, builder.build())
            }
        } catch (e: SecurityException) {
            // Notification permission might be revoked
        }
    }

    fun scheduleActivityAlarm(
        context: Context,
        activityId: String,
        title: String,
        scheduledTimestamp: Long
    ) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = "com.murugacare.app.ACTION_SCHEDULE_REMINDER"
            putExtra("EXTRA_TITLE", "Muruga Care • $title")
            putExtra("EXTRA_MESSAGE", "Bala Murugan reminds you: Time for '$title'. Start with focus & clarity!")
            putExtra("EXTRA_ID", activityId.hashCode())
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            activityId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                scheduledTimestamp,
                pendingIntent
            )
        } else {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                scheduledTimestamp,
                pendingIntent
            )
        }
    }

    fun scheduleHydrationInterval(context: Context, intervalMinutes: Int) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = "com.murugacare.app.ACTION_HYDRATION_REMINDER"
            putExtra("EXTRA_TITLE", "Theertham Time • Bala Murugan")
            putExtra("EXTRA_MESSAGE", "Have a sip of refreshing water! Keep your body pure and mind sharp.")
            putExtra("EXTRA_ID", 9999)
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            9999,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val triggerTime = Calendar.getInstance().apply {
            add(Calendar.MINUTE, intervalMinutes)
        }.timeInMillis

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        }
    }
}
