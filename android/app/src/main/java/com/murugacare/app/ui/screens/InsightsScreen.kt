package com.murugacare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.murugacare.app.ui.components.BalaMuruganMascotView
import com.murugacare.app.ui.theme.*
import com.murugacare.app.ui.viewmodel.InsightsViewModel

@Composable
fun InsightsScreen(
    viewModel: InsightsViewModel
) {
    val tasks by viewModel.tasks.collectAsState()
    val habits by viewModel.habits.collectAsState()
    val waterDrank by viewModel.todayWater.collectAsState()

    val completedTasks = tasks.count { it.isCompleted }
    val totalTasks = tasks.size.coerceAtLeast(1)
    val taskRate = (completedTasks * 100) / totalTasks

    // Harmony Score formula
    val harmonyScore = ((taskRate * 0.4f) + (minOf(1f, (waterDrank ?: 0) / 2500f) * 40f) + (habits.size * 5f)).toInt().coerceIn(35, 98)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmCream)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            BalaMuruganMascotView(
                size = 140.dp,
                expressionText = "Harmony Score: $harmonyScore / 100",
                subText = "Your daily balance of physical wellness, focused action, and noble purpose."
            )
        }

        // Harmony Score Main Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Devotional Life Harmony",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(130.dp)
                            .clip(CircleShape)
                            .background(Brush.radialGradient(listOf(AntiqueGold.copy(alpha = 0.2f), WarmCream)))
                            .border(3.dp, AntiqueGold, CircleShape)
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "$harmonyScore%",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    color = SaffronDark
                                )
                            )
                            Text("Devoted", fontSize = 11.sp, color = TextSecondary)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Lord Murugan observes steady discipline. Keep up the momentum!",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        }

        // Productivity Breakdown Cards
        item {
            Text(
                text = "Pillar Performance",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
        }

        item {
            StatRowCard(
                title = "Task Completion Rate",
                value = "$taskRate%",
                details = "$completedTasks out of ${tasks.size} tasks completed",
                color = SaffronPrimary,
                icon = "🔱"
            )
        }

        item {
            StatRowCard(
                title = "Hydration Discipline",
                value = "${waterDrank ?: 0} ml",
                details = "Target: 2500 ml (${(((waterDrank ?: 0) * 100) / 2500).coerceAtMost(100)}% reached)",
                color = PeacockTeal,
                icon = "💧"
            )
        }

        item {
            StatRowCard(
                title = "Active Habit Rituals",
                value = "${habits.size} rituals",
                details = "Highest streak: ${habits.maxOfOrNull { it.bestStreak } ?: 0} days",
                color = RoyalBlue,
                icon = "🔥"
            )
        }
    }
}

@Composable
fun StatRowCard(
    title: String,
    value: String,
    details: String,
    color: androidx.compose.ui.graphics.Color,
    icon: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        border = BorderStroke(1.dp, BorderSubtle)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Text(icon, fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 14.sp)
                )
                Text(
                    text = details,
                    style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 12.sp)
                )
            }
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold, color = color)
            )
        }
    }
}
