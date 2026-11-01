package com.murugacare.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

data class SubTask(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val isCompleted: Boolean = false
)

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val category: String, // work, personal, health, learning, spiritual, study
    val priority: Int, // 1 = Low, 2 = Medium, 3 = High (Vels)
    val dueDate: String, // YYYY-MM-DD
    val dueTime: String? = null, // e.g. "09:30 AM"
    val estimatedMinutes: Int = 30, // 15, 30, 45, 60, 90, 120
    val isCompleted: Boolean = false,
    val notes: String? = null,
    val subtasks: List<SubTask> = emptyList(),
    val goalId: String? = null,
    val isScheduledToPlanner: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
