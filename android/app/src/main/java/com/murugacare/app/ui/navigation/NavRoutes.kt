package com.murugacare.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Dashboard : Screen("dashboard", "Sanctuary", Icons.Filled.Home, Icons.Outlined.Home)
    object Tasks : Screen("tasks", "Tasks", Icons.Filled.CheckCircle, Icons.Outlined.CheckCircle)
    object Planner : Screen("planner", "Planner", Icons.Filled.CalendarMonth, Icons.Outlined.CalendarMonth)
    object Goals : Screen("goals", "Goals", Icons.Filled.Flag, Icons.Outlined.Flag)
    object Habits : Screen("habits", "Habits", Icons.Filled.AutoAwesome, Icons.Outlined.AutoAwesome)
    object Hydration : Screen("hydration", "Theertham", Icons.Filled.WaterDrop, Icons.Outlined.WaterDrop)
    object Insights : Screen("insights", "Insights", Icons.Filled.BarChart, Icons.Outlined.BarChart)
    object Settings : Screen("settings", "Settings", Icons.Filled.Settings, Icons.Outlined.Settings)

    companion object {
        val bottomNavItems = listOf(
            Dashboard,
            Tasks,
            Planner,
            Goals,
            Habits,
            Hydration,
            Insights,
            Settings
        )
    }
}
