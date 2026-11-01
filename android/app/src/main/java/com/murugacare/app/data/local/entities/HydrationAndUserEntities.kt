package com.murugacare.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "hydration_logs")
data class HydrationLogEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val amountMl: Int,
    val vesselType: String, // cup_150, glass_250, bottle_500, uruli_750, custom
    val timestamp: Long = System.currentTimeMillis(),
    val dateString: String // YYYY-MM-DD
)

@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey
    val id: String = "primary_user",
    val name: String = "Karthik Narayanan",
    val nickname: String = "Kanna",
    val companionTone: String = "thozhan", // anbudan, veeram, thozhan
    val dailyWaterTargetMl: Int = 2500,
    val dailyFocusTargetMinutes: Int = 180,
    val soundEnabled: Boolean = true,
    val hapticsEnabled: Boolean = true,
    val timeFormat: String = "12h", // 12h, 24h
    val weekStartDay: String = "monday", // monday, sunday
    val notificationsEnabled: Boolean = true,
    val hydrationReminderIntervalMinutes: Int = 90
)
