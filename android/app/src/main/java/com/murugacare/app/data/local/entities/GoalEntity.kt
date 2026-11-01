package com.murugacare.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

data class Milestone(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val type: String = "weekly", // monthly, weekly
    val targetDate: String,
    val isCompleted: Boolean = false
)

@Entity(tableName = "goals")
data class GoalEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String? = null,
    val category: String, // Career, Spiritual, Fitness, Mastery, Family, Education
    val targetDate: String, // YYYY-MM-DD
    val milestones: List<Milestone> = emptyList(),
    val progress: Int = 0, // 0 to 100
    val status: String = "in_progress", // in_progress, achieved, paused
    val colorHex: String = "#087F78",
    val createdAt: Long = System.currentTimeMillis()
)
