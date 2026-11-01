package com.murugacare.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "habits")
data class HabitEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val category: String, // Mind, Body, Spirit, Mastery
    val frequency: String = "daily", // daily, weekdays, weekly
    val iconName: String = "Flame",
    val colorHex: String = "#F28C28",
    val currentStreak: Int = 0,
    val bestStreak: Int = 0,
    val totalCompletions: Int = 0,
    val completedDates: List<String> = emptyList(), // list of YYYY-MM-DD
    val isActive: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)
