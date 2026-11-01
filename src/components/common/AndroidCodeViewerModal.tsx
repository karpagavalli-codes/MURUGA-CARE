import React, { useState } from 'react';
import {
  FileCode,
  Folder,
  Copy,
  Check,
  Download,
  X,
  Layers,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Database,
  Bell,
  Code2
} from 'lucide-react';

interface AndroidCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFile {
  name: string;
  path: string;
  category: 'core' | 'ui' | 'data' | 'gradle' | 'notifications';
  language: 'kotlin' | 'xml' | 'groovy';
  description: string;
  code: string;
}

const ANDROID_FILES: CodeFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/murugacare/app/MainActivity.kt',
    category: 'core',
    language: 'kotlin',
    description: 'Jetpack Compose entrypoint with Material 3 Scaffold, NavigationBar, and notification launcher.',
    code: `package com.murugacare.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.Crossfade
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

        // Initialize 8 Feature ViewModels
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
                ) { isGranted -> }

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
                    topBar = { MurugaTopBar(title = currentScreen.title) },
                    bottomBar = {
                        NavigationBar(containerColor = CardSurface) {
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
                                    label = { Text(screen.title, fontSize = 10.sp) }
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.fillMaxSize().padding(innerPadding)) {
                        Crossfade(targetState = currentScreen) { target ->
                            when (target) {
                                Screen.Dashboard -> DashboardScreen(dashboardVm, ...)
                                Screen.Tasks -> TasksScreen(taskVm)
                                Screen.Planner -> PlannerScreen(plannerVm)
                                Screen.Goals -> GoalsScreen(goalVm)
                                Screen.Habits -> HabitsScreen(habitVm)
                                Screen.Hydration -> HydrationScreen(hydrationVm)
                                Screen.Insights -> InsightsScreen(insightsVm)
                                Screen.Settings -> SettingsScreen(settingsVm)
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'MurugaCareDatabase.kt',
    path: 'app/src/main/java/com/murugacare/app/data/local/MurugaCareDatabase.kt',
    category: 'data',
    language: 'kotlin',
    description: 'Room Database definition with 6 entities, TypeConverters, and initial seed callback.',
    code: `package com.murugacare.app.data.local

import android.content.Context
import androidx.room.*
import com.murugacare.app.data.local.dao.*
import com.murugacare.app.data.local.entities.*

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
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  },
  {
    name: 'MurugaDaos.kt',
    path: 'app/src/main/java/com/murugacare/app/data/local/dao/MurugaDaos.kt',
    category: 'data',
    language: 'kotlin',
    description: 'Room DAOs with Kotlin Coroutine Flows for Tasks, Schedule, Goals, Habits, and Hydration.',
    code: `package com.murugacare.app.data.local.dao

import androidx.room.*
import com.murugacare.app.data.local.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY priority DESC, dueDate ASC, createdAt DESC")
    fun getAllTasks(): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: TaskEntity)

    @Update
    suspend fun updateTask(task: TaskEntity)

    @Delete
    suspend fun deleteTask(task: TaskEntity)
}

@Dao
interface ScheduleDao {
    @Query("SELECT * FROM schedule_activities WHERE date = :date ORDER BY startTime ASC")
    fun getActivitiesForDate(date: String): Flow<List<ScheduleActivityEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(activity: ScheduleActivityEntity)

    @Delete
    suspend fun deleteActivity(activity: ScheduleActivityEntity)
}

@Dao
interface HydrationDao {
    @Query("SELECT SUM(amountMl) FROM hydration_logs WHERE dateString = :date")
    fun getTotalWaterForDate(date: String): Flow<Int?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: HydrationLogEntity)
}`
  },
  {
    name: 'BalaMuruganMascotView.kt',
    path: 'app/src/main/java/com/murugacare/app/ui/components/BalaMuruganMascotView.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Jetpack Compose Composable for the approved 3D Lord Murugan mascot with halo animation.',
    code: `package com.murugacare.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.murugacare.app.ui.theme.*

@Composable
fun BalaMuruganMascotView(
    modifier: Modifier = Modifier,
    expressionText: String = "Vetrivel Muruganukku Haroharohara!",
    subText: String? = "Start every work with clarity and devotion."
) {
    val infiniteTransition = rememberInfiniteTransition(label = "halo_shimmer")
    val haloPulse by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(160.dp)) {
            // Golden Divine Halo
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .scale(haloPulse)
                    .clip(CircleShape)
                    .background(Brush.radialGradient(listOf(AntiqueGold.copy(0.45f), SaffronPrimary.copy(0.2f))))
            )
            // 3D Bala Murugan Asset
            AsyncImage(
                model = "file:///android_asset/murugan_3d_clean.png",
                contentDescription = "3D Lord Murugan Mascot",
                modifier = Modifier.size(136.dp).clip(CircleShape)
            )
        }
        // Devotional speech bubble
        Surface(shape = RoundedCornerShape(18.dp), color = CardSurface) {
            Text(expressionText, style = MaterialTheme.typography.titleMedium)
        }
    }
}`
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/murugacare/app/ui/theme/Theme.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Material 3 ColorScheme and Theme enforcing Saffron, Gold, Royal Blue, and Peacock Teal.',
    code: `package com.murugacare.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = SaffronPrimary, // #F28C28
    secondary = AntiqueGold,   // #D6A43B
    tertiary = PeacockTeal,    // #087F78
    background = WarmCream,    // #FFF9F0
    surface = CardSurface,     // #FFFFFF
    error = MagentaVermilion   // #E63946
)

@Composable
fun MurugaCareTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    category: 'core',
    language: 'xml',
    description: 'Manifest declaring POST_NOTIFICATIONS, SCHEDULE_EXACT_ALARM, and ReminderReceiver.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".MurugaCareApp"
        android:label="@string/app_name"
        android:theme="@style/Theme.MurugaCare">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MurugaCare">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".notifications.ReminderReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="com.murugacare.app.ACTION_SCHEDULE_REMINDER" />
                <action android:name="com.murugacare.app.ACTION_HYDRATION_REMINDER" />
            </intent-filter>
        </receiver>

    </application>
</manifest>`
  },
  {
    name: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'groovy',
    description: 'Gradle configuration with Jetpack Compose 2024, Material 3, Room 2.6, and Coil.',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.murugacare.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.murugacare.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.compose.material3:material3:1.2.1")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
    implementation("io.coil-kt:coil-compose:2.7.0")
}`
  }
];

export const AndroidCodeViewerModal: React.FC<AndroidCodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FFF9F0] border-2 border-[#D6A43B] rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D3B66] to-[#087F78] px-6 py-4 flex items-center justify-between text-white border-b border-[#D6A43B]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F28C28] flex items-center justify-center text-white shadow-md">
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">Muruga Care • Native Android Architecture</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D6A43B] text-[10px] font-bold text-white uppercase tracking-wider">
                  Kotlin + Compose + Room
                </span>
              </div>
              <p className="text-xs text-white/80">
                100% Native Android project located in <code className="text-[#FFE0C2]">/android/</code> directory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-[#4ade80]" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy File'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body: Split View (Sidebar file list + Code viewer) */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-72 bg-[#FFF2DC] border-r border-[#D6A43B]/30 flex flex-col p-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-[#7A583A] uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <Folder size={13} className="text-[#F28C28]" />
              <span>Project Structure</span>
            </div>

            <div className="mt-2 space-y-1">
              {ANDROID_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold shadow-xs'
                        : 'text-[#2C1A0D] hover:bg-[#FFE6CC]'
                    }`}
                  >
                    <FileCode size={15} className={isSelected ? 'text-white' : 'text-[#087F78]'} />
                    <div className="truncate">
                      <div className="truncate">{file.name}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#7A583A]'}`}>
                        {file.category.toUpperCase()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Architecture Highlights */}
            <div className="mt-auto pt-3 border-t border-[#D6A43B]/30 space-y-2">
              <div className="bg-white/70 p-2.5 rounded-xl border border-[#D6A43B]/20 text-[11px] text-[#49321F]">
                <div className="font-bold flex items-center gap-1 text-[#087F78]">
                  <Database size={12} /> Room Persistence
                </div>
                <div className="text-[10px] text-[#7A583A] mt-0.5">
                  Tasks, Schedules, Goals, Habits & Hydration stored persistently.
                </div>
              </div>
              <div className="bg-white/70 p-2.5 rounded-xl border border-[#D6A43B]/20 text-[11px] text-[#49321F]">
                <div className="font-bold flex items-center gap-1 text-[#F28C28]">
                  <Bell size={12} /> Native Alarms
                </div>
                <div className="text-[10px] text-[#7A583A] mt-0.5">
                  Exact alarms via AlarmManager & NotificationCompat.
                </div>
              </div>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 bg-[#1E1E2E] text-[#D9E0EE] flex flex-col overflow-hidden font-mono text-xs">
            {/* File Path & Description Ribbon */}
            <div className="bg-[#181825] px-4 py-2.5 border-b border-[#313244] flex items-center justify-between">
              <div>
                <span className="text-[#FAB387] font-semibold">{selectedFile.path}</span>
                <p className="text-[11px] text-[#A6ADC8] mt-0.5 font-sans">{selectedFile.description}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#313244] text-[10px] text-[#CBA6F7]">
                {selectedFile.language.toUpperCase()}
              </span>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto leading-relaxed">
              <pre className="whitespace-pre font-mono text-[11.5px] text-[#CDD6F4]">
                {selectedFile.code}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
