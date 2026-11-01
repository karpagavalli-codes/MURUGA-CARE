package com.murugacare.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteDatabase
import com.murugacare.app.data.local.dao.*
import com.murugacare.app.data.local.entities.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        TaskEntity::class,
        ScheduleActivityEntity::class,
        GoalEntity::class,
        HabitEntity::class,
        HydrationLogEntity::class,
        UserProfileEntity::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class MurugaCareDatabase : RoomDatabase() {

    abstract fun taskDao(): TaskDao
    abstract fun scheduleDao(): ScheduleDao
    abstract fun goalDao(): GoalDao
    abstract fun habitDao(): HabitDao
    abstract fun hydrationDao(): HydrationDao
    abstract fun userDao(): UserDao

    companion object {
        @Volatile
        private var INSTANCE: MurugaCareDatabase? = null

        fun getDatabase(context: Context): MurugaCareDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MurugaCareDatabase::class.java,
                    "muruga_care_database"
                )
                    .fallbackToDestructiveMigration()
                    .addCallback(DatabaseCallback())
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback : Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    CoroutineScope(Dispatchers.IO).launch {
                        populateInitialData(database)
                    }
                }
            }

            private suspend fun populateInitialData(database: MurugaCareDatabase) {
                val taskDao = database.taskDao()
                val scheduleDao = database.scheduleDao()
                val goalDao = database.goalDao()
                val habitDao = database.habitDao()
                val userDao = database.userDao()

                // Initial User Profile
                userDao.insertOrUpdateProfile(
                    UserProfileEntity(
                        id = "primary_user",
                        name = "Karthik Narayanan",
                        nickname = "Kanna",
                        companionTone = "thozhan",
                        dailyWaterTargetMl = 2500,
                        dailyFocusTargetMinutes = 180,
                        soundEnabled = true,
                        hapticsEnabled = true,
                        timeFormat = "12h",
                        weekStartDay = "monday"
                    )
                )

                // Initial Tasks with Vels and subtasks
                taskDao.insertTask(
                    TaskEntity(
                        id = "t1",
                        title = "Devotional Review & System Architecture",
                        category = "work",
                        priority = 3,
                        dueDate = "2026-11-01",
                        dueTime = "09:30 AM",
                        estimatedMinutes = 45,
                        isCompleted = true,
                        notes = "Ensure high-clarity Material 3 components and Room persistence.",
                        subtasks = listOf(
                            SubTask(title = "Review Compose theme tokens", isCompleted = true),
                            SubTask(title = "Configure Room migrations", isCompleted = true),
                            SubTask(title = "Test exact alarm broadcasts", isCompleted = false)
                        )
                    )
                )
                taskDao.insertTask(
                    TaskEntity(
                        id = "t2",
                        title = "15-Min Surya Namaskar & Pranayama",
                        category = "health",
                        priority = 2,
                        dueDate = "2026-11-01",
                        dueTime = "08:00 AM",
                        estimatedMinutes = 15,
                        isCompleted = true,
                        notes = "Invigorating morning focus before starting work."
                    )
                )
                taskDao.insertTask(
                    TaskEntity(
                        id = "t3",
                        title = "Milestone Review with Team",
                        category = "work",
                        priority = 3,
                        dueDate = "2026-11-01",
                        dueTime = "02:00 PM",
                        estimatedMinutes = 60,
                        isCompleted = false,
                        notes = "Demo the Android native Compose app with 3D Bala Murugan mascot."
                    )
                )

                // Initial Schedule Activities
                scheduleDao.insertActivity(
                    ScheduleActivityEntity(
                        id = "s1",
                        title = "Morning Sadhana & Theertham",
                        date = "2026-11-01",
                        startTime = "07:30",
                        endTime = "08:15",
                        category = "spiritual",
                        colorHex = "#F28C28",
                        hasReminder = true,
                        reminderMinutesBefore = 10,
                        isCompleted = true
                    )
                )
                scheduleDao.insertActivity(
                    ScheduleActivityEntity(
                        id = "s2",
                        title = "Deep Work: Jetpack Compose Suite",
                        date = "2026-11-01",
                        startTime = "09:00",
                        endTime = "11:30",
                        category = "work",
                        colorHex = "#0D3B66",
                        hasReminder = true,
                        reminderMinutesBefore = 15,
                        isCompleted = false
                    )
                )

                // Initial Goal
                goalDao.insertGoal(
                    GoalEntity(
                        id = "g1",
                        title = "Master Native Android Architecture",
                        description = "Complete Room, Navigation Compose, and WorkManager implementation",
                        category = "Mastery",
                        targetDate = "2026-12-31",
                        progress = 75,
                        colorHex = "#087F78",
                        milestones = listOf(
                            Milestone(title = "Implement Room schema & DAOs", isCompleted = true, targetDate = "2026-11-10"),
                            Milestone(title = "Build Material 3 screens", isCompleted = true, targetDate = "2026-11-20"),
                            Milestone(title = "Schedule alarms & notifications", isCompleted = false, targetDate = "2026-12-05")
                        )
                    )
                )

                // Initial Habits
                habitDao.insertHabit(
                    HabitEntity(
                        id = "h1",
                        title = "Morning Pure Water (500ml)",
                        category = "Body",
                        currentStreak = 14,
                        bestStreak = 21,
                        colorHex = "#087F78"
                    )
                )
                habitDao.insertHabit(
                    HabitEntity(
                        id = "h2",
                        title = "Evening 10m Meditation / Kanda Sashti",
                        category = "Spirit",
                        currentStreak = 8,
                        bestStreak = 12,
                        colorHex = "#F28C28"
                    )
                )
            }
        }
    }
}
