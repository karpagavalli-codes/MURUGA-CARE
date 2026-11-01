package com.murugacare.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.murugacare.app.ui.components.MurugaTopBar
import com.murugacare.app.ui.navigation.Screen
import com.murugacare.app.ui.screens.*
import com.murugacare.app.ui.theme.*
import com.murugacare.app.ui.viewmodel.*

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as MurugaCareApp
        val repo = app.repository

        // Initialize ViewModels
        val dashboardVm = DashboardViewModel(repo)
        val taskVm = TaskViewModel(repo)
        val plannerVm = PlannerViewModel(repo)
        val goalVm = GoalViewModel(repo)
        val habitVm = HabitViewModel(repo)
        val hydrationVm = HydrationViewModel(repo)
        val insightsVm = InsightsViewModel(repo)
        val settingsVm = SettingsViewModel(repo)

        setContent {
            MurugaCareTheme {
                var currentScreen by remember { mutableStateOf<Screen>(Screen.Dashboard) }

                // Request Notification Permission on Android 13+
                val permissionLauncher = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.RequestPermission()
                ) { isGranted ->
                    // Notification permission state handled gracefully
                }

                LaunchedEffect(Unit) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        if (ContextCompat.checkSelfPermission(
                                this@MainActivity,
                                Manifest.permission.POST_NOTIFICATIONS
                            ) != PackageManager.PERMISSION_GRANTED
                        ) {
                            permissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                        }
                    }
                }

                Scaffold(
                    topBar = {
                        MurugaTopBar(
                            title = currentScreen.title,
                            subtitle = when (currentScreen) {
                                Screen.Dashboard -> "Vanakkam! Welcome to your Sanctuary"
                                Screen.Tasks -> "Conquer Tasks with Golden Vels"
                                Screen.Planner -> "Harmonize Routines & Timelines"
                                Screen.Goals -> "Milestones Guided by Lord Murugan"
                                Screen.Habits -> "Rituals that Sculpt Iron Willpower"
                                Screen.Hydration -> "Sacred Theertham Vitality"
                                Screen.Insights -> "Your Harmony & Focus Metrics"
                                Screen.Settings -> "Devotional Preferences"
                            }
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = CardSurface,
                            tonalElevation = 6.dp
                        ) {
                            Screen.bottomNavItems.forEach { screen ->
                                val selected = currentScreen == screen
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = { currentScreen = screen },
                                    icon = {
                                        Icon(
                                            imageVector = if (selected) screen.selectedIcon else screen.unselectedIcon,
                                            contentDescription = screen.title
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = screen.title,
                                            fontSize = 10.sp,
                                            maxLines = 1
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = SaffronPrimary,
                                        selectedTextColor = SaffronDark,
                                        indicatorColor = SaffronContainer,
                                        unselectedIconColor = TextSecondary,
                                        unselectedTextColor = TextSecondary
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        Crossfade(targetState = currentScreen, label = "screen_transition") { target ->
                            when (target) {
                                Screen.Dashboard -> DashboardScreen(
                                    viewModel = dashboardVm,
                                    onNavigateToTasks = { currentScreen = Screen.Tasks },
                                    onNavigateToPlanner = { currentScreen = Screen.Planner },
                                    onNavigateToHydration = { currentScreen = Screen.Hydration }
                                )
                                Screen.Tasks -> TasksScreen(viewModel = taskVm)
                                Screen.Planner -> PlannerScreen(viewModel = plannerVm)
                                Screen.Goals -> GoalsScreen(viewModel = goalVm)
                                Screen.Habits -> HabitsScreen(viewModel = habitVm)
                                Screen.Hydration -> HydrationScreen(viewModel = hydrationVm)
                                Screen.Insights -> InsightsScreen(viewModel = insightsVm)
                                Screen.Settings -> SettingsScreen(viewModel = settingsVm)
                            }
                        }
                    }
                }
            }
        }
    }
}
