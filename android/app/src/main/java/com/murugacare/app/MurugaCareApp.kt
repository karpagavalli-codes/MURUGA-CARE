package com.murugacare.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.murugacare.app.data.local.MurugaCareDatabase
import com.murugacare.app.data.repository.MurugaCareRepository

class MurugaCareApp : Application() {

    lateinit var database: MurugaCareDatabase
        private set

    lateinit var repository: MurugaCareRepository
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        database = MurugaCareDatabase.getDatabase(this)
        repository = MurugaCareRepository(database)

        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            val scheduleChannel = NotificationChannel(
                CHANNEL_SCHEDULE,
                "Muruga Care Schedule & Tasks",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Timely reminders for your scheduled routines, study blocks, and priority tasks."
                enableVibration(true)
            }

            val hydrationChannel = NotificationChannel(
                CHANNEL_HYDRATION,
                "Muruga Care Theertham Hydration",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Gentle reminders from Bala Murugan to drink pure water throughout the day."
                enableVibration(true)
            }

            val wisdomChannel = NotificationChannel(
                CHANNEL_WISDOM,
                "Muruga Care Daily Blessings",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Morning inspiration and encouraging quotes from Lord Murugan."
            }

            notificationManager.createNotificationChannel(scheduleChannel)
            notificationManager.createNotificationChannel(hydrationChannel)
            notificationManager.createNotificationChannel(wisdomChannel)
        }
    }

    companion object {
        const val CHANNEL_SCHEDULE = "muruga_schedule_channel"
        const val CHANNEL_HYDRATION = "muruga_hydration_channel"
        const val CHANNEL_WISDOM = "muruga_wisdom_channel"

        lateinit var instance: MurugaCareApp
            private set
    }
}
