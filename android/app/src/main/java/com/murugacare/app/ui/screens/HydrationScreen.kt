package com.murugacare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.murugacare.app.data.local.entities.HydrationLogEntity
import com.murugacare.app.ui.components.BalaMuruganMascotView
import com.murugacare.app.ui.components.SacredUruliVessel
import com.murugacare.app.ui.theme.*
import com.murugacare.app.ui.viewmodel.HydrationViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HydrationScreen(
    viewModel: HydrationViewModel
) {
    val totalWater by viewModel.todayWater.collectAsState()
    val todayLogs by viewModel.todayLogs.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()

    val targetMl = userProfile?.dailyWaterTargetMl ?: 2500
    val currentMl = totalWater ?: 0
    val progress = (currentMl.toFloat() / targetMl).coerceIn(0f, 1f)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmCream)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Mascot Blessing for Hydration
        item {
            BalaMuruganMascotView(
                size = 140.dp,
                expressionText = "Drink Pure Theertham, Stay Alert!",
                subText = "Water purifies the nadis and keeps your intellect sharp for noble actions."
            )
        }

        // Animated Uruli Vessel
        item {
            SacredUruliVessel(
                progressPercent = progress,
                currentMl = currentMl,
                targetMl = targetMl
            )
        }

        // Quick Vessel Intake Buttons
        item {
            Text(
                text = "Log Vessel Intake",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                VesselQuickButton(
                    label = "150ml Cup",
                    icon = "🍵",
                    amount = 150,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.logVessel(150, "cup_150") }
                )
                VesselQuickButton(
                    label = "250ml Glass",
                    icon = "🥛",
                    amount = 250,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.logVessel(250, "glass_250") }
                )
                VesselQuickButton(
                    label = "500ml Bottle",
                    icon = "🍶",
                    amount = 500,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.logVessel(500, "bottle_500") }
                )
                VesselQuickButton(
                    label = "750ml Uruli",
                    icon = "🏺",
                    amount = 750,
                    modifier = Modifier.weight(1f),
                    onClick = { viewModel.logVessel(750, "uruli_750") }
                )
            }
        }

        // Today's Drink History
        item {
            Text(
                text = "Today's Sacred Logs (${todayLogs.size})",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
        }

        if (todayLogs.isEmpty()) {
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = CardSurface,
                    border = BorderStroke(1.dp, BorderSubtle)
                ) {
                    Box(modifier = Modifier.padding(24.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = "No water logged yet today. Tap a vessel above to log!",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
                        )
                    }
                }
            }
        } else {
            items(todayLogs, key = { it.id }) { log ->
                HydrationLogItem(
                    log = log,
                    onDelete = { viewModel.deleteLog(log) }
                )
            }
        }
    }
}

@Composable
fun VesselQuickButton(
    label: String,
    icon: String,
    amount: Int,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp)),
        color = CardSurface,
        border = BorderStroke(1.dp, PeacockTealLight),
        shadowElevation = 1.dp,
        onClick = onClick
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 6.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = icon, fontSize = 22.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "+$amount ml",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = PeacockTeal
                )
            )
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontSize = 9.sp,
                    color = TextSecondary
                )
            )
        }
    }
}

@Composable
fun HydrationLogItem(
    log: HydrationLogEntity,
    onDelete: () -> Unit
) {
    val timeFormatted = remember(log.timestamp) {
        SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date(log.timestamp))
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        border = BorderStroke(1.dp, BorderSubtle)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("💧", fontSize = 18.sp)
            Spacer(modifier = Modifier.width(10.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "+${log.amountMl} ml Theertham",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                )
                Text(
                    text = timeFormatted,
                    style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                )
            }
            IconButton(onClick = onDelete) {
                Icon(Icons.Filled.DeleteOutline, contentDescription = "Delete entry", tint = Color.Gray, modifier = Modifier.size(18.dp))
            }
        }
    }
}
