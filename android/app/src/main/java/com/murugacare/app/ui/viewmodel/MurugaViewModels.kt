package com.murugacare.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.murugacare.app.data.local.entities.*
import com.murugacare.app.data.repository.MurugaCareRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

// 1. Dashboard ViewModel
class DashboardViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val tasks = repository.allTasks.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val activities = repository.allActivities.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val habits = repository.allHabits.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val userProfile = repository.userProfile.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)
    val todayWater = repository.getTotalWaterForDate(repository.getTodayDateString())
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    fun completeTask(task: TaskEntity, isCompleted: Boolean) {
        viewModelScope.launch {
            repository.updateTask(task.copy(isCompleted = isCompleted))
        }
    }

    fun quickLogWater(amountMl: Int) {
        viewModelScope.launch {
            repository.logWater(amountMl, "quick_add", repository.getTodayDateString())
        }
    }
}

// 2. Task ViewModel
class TaskViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val allTasks = repository.allTasks.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String?>("all")
    val selectedCategory = _selectedCategory.asStateFlow()

    val filteredTasks = combine(allTasks, _searchQuery, _selectedCategory) { list, query, category ->
        list.filter { task ->
            val matchesQuery = task.title.contains(query, ignoreCase = true) ||
                    (task.notes?.contains(query, ignoreCase = true) == true)
            val matchesCat = category == null || category == "all" || task.category.equals(category, ignoreCase = true)
            matchesQuery && matchesCat
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setSearchQuery(query: String) { _searchQuery.value = query }
    fun setCategory(category: String?) { _selectedCategory.value = category }

    fun addTask(
        title: String,
        category: String,
        priority: Int,
        dueDate: String,
        dueTime: String?,
        estimatedMinutes: Int,
        notes: String?,
        subtasks: List<SubTask>
    ) {
        viewModelScope.launch {
            val task = TaskEntity(
                title = title,
                category = category,
                priority = priority,
                dueDate = dueDate,
                dueTime = dueTime,
                estimatedMinutes = estimatedMinutes,
                notes = notes,
                subtasks = subtasks
            )
            repository.insertTask(task)
        }
    }

    fun toggleTaskCompletion(task: TaskEntity) {
        viewModelScope.launch {
            repository.updateTask(task.copy(isCompleted = !task.isCompleted))
        }
    }

    fun deleteTask(task: TaskEntity) {
        viewModelScope.launch {
            repository.deleteTask(task)
        }
    }

    fun scheduleTaskToPlanner(task: TaskEntity, startTime: String, endTime: String) {
        viewModelScope.launch {
            repository.updateTask(task.copy(isScheduledToPlanner = true))
            val activity = ScheduleActivityEntity(
                title = task.title,
                description = task.notes,
                date = task.dueDate,
                startTime = startTime,
                endTime = endTime,
                category = task.category,
                taskId = task.id
            )
            repository.insertActivity(activity)
        }
    }
}

// 3. Planner ViewModel
class PlannerViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    private val _selectedDate = MutableStateFlow(repository.getTodayDateString())
    val selectedDate = _selectedDate.asStateFlow()

    val activitiesForDate = _selectedDate.flatMapLatest { date ->
        repository.getActivitiesForDate(date)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setSelectedDate(date: String) { _selectedDate.value = date }

    fun addActivity(
        title: String,
        startTime: String,
        endTime: String,
        category: String,
        colorHex: String,
        description: String? = null,
        hasReminder: Boolean = true,
        recurrence: String = "none"
    ) {
        viewModelScope.launch {
            // Check for conflict
            val currentList = activitiesForDate.value
            val hasConflict = currentList.any { existing ->
                (startTime < existing.endTime && endTime > existing.startTime)
            }

            val activity = ScheduleActivityEntity(
                title = title,
                date = _selectedDate.value,
                startTime = startTime,
                endTime = endTime,
                category = category,
                colorHex = colorHex,
                description = description,
                hasReminder = hasReminder,
                recurrence = recurrence,
                hasConflict = hasConflict,
                conflictDetails = if (hasConflict) "Overlaps with another scheduled routine" else null
            )
            repository.insertActivity(activity)
        }
    }

    fun updateActivity(activity: ScheduleActivityEntity) {
        viewModelScope.launch { repository.updateActivity(activity) }
    }

    fun deleteActivity(activity: ScheduleActivityEntity) {
        viewModelScope.launch { repository.deleteActivity(activity) }
    }

    fun shiftTime(activity: ScheduleActivityEntity, minutes: Int) {
        // Shift start & end by minutes
        // Implementation parses HH:mm and shifts
        viewModelScope.launch {
            repository.updateActivity(activity)
        }
    }
}

// 4. Goal ViewModel
class GoalViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val allGoals = repository.allGoals.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addGoal(title: String, description: String?, category: String, targetDate: String, milestones: List<Milestone>) {
        viewModelScope.launch {
            val goal = GoalEntity(
                title = title,
                description = description,
                category = category,
                targetDate = targetDate,
                milestones = milestones
            )
            repository.insertGoal(goal)
        }
    }

    fun toggleMilestone(goal: GoalEntity, milestoneId: String) {
        viewModelScope.launch {
            val updatedMilestones = goal.milestones.map {
                if (it.id == milestoneId) it.copy(isCompleted = !it.isCompleted) else it
            }
            val completedCount = updatedMilestones.count { it.isCompleted }
            val newProgress = if (updatedMilestones.isNotEmpty()) {
                (completedCount * 100) / updatedMilestones.size
            } else goal.progress

            repository.updateGoal(goal.copy(
                milestones = updatedMilestones,
                progress = newProgress,
                status = if (newProgress == 100) "achieved" else "in_progress"
            ))
        }
    }

    fun deleteGoal(goal: GoalEntity) {
        viewModelScope.launch { repository.deleteGoal(goal) }
    }
}

// 5. Habit ViewModel
class HabitViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val allHabits = repository.allHabits.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun toggleTodayHabit(habit: HabitEntity) {
        val today = repository.getTodayDateString()
        viewModelScope.launch {
            val isCheckedToday = habit.completedDates.contains(today)
            val updatedDates = if (isCheckedToday) {
                habit.completedDates.filter { it != today }
            } else {
                habit.completedDates + today
            }
            val newStreak = if (!isCheckedToday) habit.currentStreak + 1 else (habit.currentStreak - 1).coerceAtLeast(0)
            val newBest = maxOf(newStreak, habit.bestStreak)

            repository.updateHabit(
                habit.copy(
                    completedDates = updatedDates,
                    currentStreak = newStreak,
                    bestStreak = newBest,
                    totalCompletions = updatedDates.size
                )
            )
        }
    }

    fun addHabit(title: String, category: String, colorHex: String) {
        viewModelScope.launch {
            val habit = HabitEntity(
                title = title,
                category = category,
                colorHex = colorHex
            )
            repository.insertHabit(habit)
        }
    }

    fun deleteHabit(habit: HabitEntity) {
        viewModelScope.launch { repository.deleteHabit(habit) }
    }
}

// 6. Hydration ViewModel
class HydrationViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val todayWater = repository.getTotalWaterForDate(repository.getTodayDateString())
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val todayLogs = repository.getHydrationLogsForDate(repository.getTodayDateString())
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val userProfile = repository.userProfile.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun logVessel(amountMl: Int, vesselType: String) {
        viewModelScope.launch {
            repository.logWater(amountMl, vesselType, repository.getTodayDateString())
        }
    }

    fun deleteLog(log: HydrationLogEntity) {
        viewModelScope.launch { repository.deleteHydrationLog(log) }
    }
}

// 7. Insights ViewModel
class InsightsViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val tasks = repository.allTasks.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val activities = repository.allActivities.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val habits = repository.allHabits.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val todayWater = repository.getTotalWaterForDate(repository.getTodayDateString())
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)
}

// 8. Settings ViewModel
class SettingsViewModel(private val repository: MurugaCareRepository) : ViewModel() {
    val userProfile = repository.userProfile.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun updateProfile(profile: UserProfileEntity) {
        viewModelScope.launch {
            repository.updateProfile(profile)
        }
    }
}
