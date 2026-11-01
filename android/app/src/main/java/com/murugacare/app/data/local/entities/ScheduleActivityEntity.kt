package com.murugacare.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "schedule_activities")
data class ScheduleActivityEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String? = null,
    val date: String, // YYYY-MM-DD
    val startTime: String, // HH:mm, e.g. "08:00"
    val endTime: String, // HH:mm, e.g. "09:30"
    val category: String, // study, college, work, personal, exercise, break, meals, sleep, custom
    val customCategoryName: String? = null,
    val colorHex: String = "#F28C28",
    val hasReminder: Boolean = true,
    val reminderMinutesBefore: Int = 10,
    val recurrence: String = "none", // none, daily, weekdays, weekly, custom_days
    val recurrenceDays: List<Int> = emptyList(), // 0=Sun, 1=Mon...
    val isCompleted: Boolean = false,
    val taskId: String? = null,
    val habitId: String? = null,
    val hasConflict: Boolean = false,
    val conflictDetails: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
