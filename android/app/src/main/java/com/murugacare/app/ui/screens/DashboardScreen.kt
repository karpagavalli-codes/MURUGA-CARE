package com.murugacare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.murugacare.app.ui.components.*
import com.murugacare.app.ui.theme.*
import com.murugacare.app.ui.viewmodel.DashboardViewModel

@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel,
    onNavigateToTasks: () -> Unit,
    onNavigateToPlanner: () -> Unit,
    onNavigateToHydration: () -> Unit
) {
    val tasks by viewModel.tasks.collectAsState()
    val activities by viewModel.activities.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()
    val waterDrank by viewModel.todayWater.collectAsState()

    val pendingTasks = tasks.filter { !it.isCompleted }
    val completedCount = tasks.count { it.isCompleted }
    val totalCount = tasks.size.coerceAtLeast(1)
    val taskProgress = (completedCount.toFloat() / totalCount).coerceIn(0f, 1f)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmCream)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Bala Murugan 3D Mascot Sanctuary Header
        item {
            BalaMuruganMascotView(
                size = 170.dp,
                expressionText = "Vanakkam, ${userProfile?.nickname ?: "Kanna"}! Vetrivel!",
                subText = "May Lord Murugan grant you razor-sharp focus and boundless energy today."
            )
        }

        // 2. Metrics Quick Overview Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Today's Sanctuary Metrics",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Water metric
                        MetricBox(
                            title = "Theertham",
                            value = "${waterDrank ?: 0} ml",
                            subtitle = "/ ${userProfile?.dailyWaterTargetMl ?: 2500} ml",
                            color = PeacockTeal,
                            icon = "🌊",
                            modifier = Modifier.weight(1f).clickable { onNavigateToHydration() }
                        )

                        // Tasks metric
                        MetricBox(
                            title = "Tasks Done",
                            value = "$completedCount / ${tasks.size}",
                            subtitle = "${(taskProgress * 100).toInt()}% Done",
                            color = SaffronPrimary,
                            icon = "🔱",
                            modifier = Modifier.weight(1f).clickable { onNavigateToTasks() }
                        )

                        // Scheduled metric
                        MetricBox(
                            title = "Routines",
                            value = "${activities.size} blocks",
                            subtitle = "Timeline active",
                            color = RoyalBlue,
                            icon = "⏳",
                            modifier = Modifier.weight(1f).clickable { onNavigateToPlanner() }
                        )
                    }
                }
            }
        }

        // 3. Quick Actions
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = { viewModel.quickLogWater(250) },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = PeacockTeal),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("+250ml Water", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }

                Button(
                    onClick = onNavigateToPlanner,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text("Open Planner", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }
            }
        }

        // 4. Pending Priority Tasks
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Priority Tasks to Conquer",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
                TextButton(onClick = onNavigateToTasks) {
                    Text("View All (${pendingTasks.size})", color = SaffronDark, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        items(pendingTasks.take(3), key = { it.id }) { task ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, BorderSubtle)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = task.isCompleted,
                        onCheckedChange = { viewModel.completeTask(task, it) },
                        colors = CheckboxDefaults.colors(checkedColor = SaffronPrimary)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = task.title,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontWeight = FontWeight.SemiBold,
                                color = TextPrimary
                            )
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            CategoryBadge(category = task.category)
                            Text(
                                text = "⏱️ ${task.estimatedMinutes}m",
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    }
                    PriorityVelIndicator(priority = task.priority)
                }
            }
        }
    }
}

@Composable
fun MetricBox(
    title: String,
    value: String,
    subtitle: String,
    color: androidx.compose.ui.graphics.Color,
    icon: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = color.copy(alpha = 0.08f),
        border = BorderStroke(1.dp, color.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(text = icon, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.ExtraBold,
                    color = color
                )
            )
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold, color = TextPrimary)
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 9.sp)
            )
        }
    }
}
