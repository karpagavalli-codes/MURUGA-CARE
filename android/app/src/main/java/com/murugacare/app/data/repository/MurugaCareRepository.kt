package com.murugacare.app.data.repository

import com.murugacare.app.data.local.MurugaCareDatabase
import com.murugacare.app.data.local.entities.*
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class MurugaCareRepository(private val db: MurugaCareDatabase) {

    private val taskDao = db.taskDao()
    private val scheduleDao = db.scheduleDao()
    private val goalDao = db.goalDao()
    private val habitDao = db.habitDao()
    private val hydrationDao = db.hydrationDao()
    private val userDao = db.userDao()

    // Tasks
    val allTasks: Flow<List<TaskEntity>> = taskDao.getAllTasks()
    fun getTasksForDate(date: String): Flow<List<TaskEntity>> = taskDao.getTasksForDate(date)
    suspend fun insertTask(task: TaskEntity) = taskDao.insertTask(task)
    suspend fun updateTask(task: TaskEntity) = taskDao.updateTask(task)
    suspend fun deleteTask(task: TaskEntity) = taskDao.deleteTask(task)
    suspend fun deleteTaskById(id: String) = taskDao.deleteTaskById(id)

    // Schedule Activities
    val allActivities: Flow<List<ScheduleActivityEntity>> = scheduleDao.getAllActivities()
    fun getActivitiesForDate(date: String): Flow<List<ScheduleActivityEntity>> = scheduleDao.getActivitiesForDate(date)
    suspend fun insertActivity(activity: ScheduleActivityEntity) = scheduleDao.insertActivity(activity)
    suspend fun updateActivity(activity: ScheduleActivityEntity) = scheduleDao.updateActivity(activity)
    suspend fun deleteActivity(activity: ScheduleActivityEntity) = scheduleDao.deleteActivity(activity)
    suspend fun deleteActivityById(id: String) = scheduleDao.deleteActivityById(id)

    // Goals
    val allGoals: Flow<List<GoalEntity>> = goalDao.getAllGoals()
    suspend fun insertGoal(goal: GoalEntity) = goalDao.insertGoal(goal)
    suspend fun updateGoal(goal: GoalEntity) = goalDao.updateGoal(goal)
    suspend fun deleteGoal(goal: GoalEntity) = goalDao.deleteGoal(goal)

    // Habits
    val allHabits: Flow<List<HabitEntity>> = habitDao.getAllActiveHabits()
    suspend fun insertHabit(habit: HabitEntity) = habitDao.insertHabit(habit)
    suspend fun updateHabit(habit: HabitEntity) = habitDao.updateHabit(habit)
    suspend fun deleteHabit(habit: HabitEntity) = habitDao.deleteHabit(habit)

    // Hydration
    fun getHydrationLogsForDate(date: String): Flow<List<HydrationLogEntity>> = hydrationDao.getLogsForDate(date)
    fun getTotalWaterForDate(date: String): Flow<Int?> = hydrationDao.getTotalWaterForDate(date)
    val recentHydrationLogs: Flow<List<HydrationLogEntity>> = hydrationDao.getRecentLogs()
    suspend fun logWater(amountMl: Int, vesselType: String, dateString: String) {
        hydrationDao.insertLog(
            HydrationLogEntity(
                amountMl = amountMl,
                vesselType = vesselType,
                timestamp = System.currentTimeMillis(),
                dateString = dateString
            )
        )
    }
    suspend fun deleteHydrationLog(log: HydrationLogEntity) = hydrationDao.deleteLog(log)

    // User Profile
    val userProfile: Flow<UserProfileEntity?> = userDao.getUserProfile()
    suspend fun updateProfile(profile: UserProfileEntity) = userDao.insertOrUpdateProfile(profile)

    // Helper for today's date formatted as YYYY-MM-DD
    fun getTodayDateString(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }
}
