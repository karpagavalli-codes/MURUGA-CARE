package com.murugacare.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.murugacare.app.data.local.entities.UserProfileEntity
import com.murugacare.app.ui.theme.*
import com.murugacare.app.ui.viewmodel.SettingsViewModel

@Composable
fun SettingsScreen(
    viewModel: SettingsViewModel
) {
    val profile by viewModel.userProfile.collectAsState()

    var name by remember(profile) { mutableStateOf(profile?.name ?: "Karthik Narayanan") }
    var nickname by remember(profile) { mutableStateOf(profile?.nickname ?: "Kanna") }
    var companionTone by remember(profile) { mutableStateOf(profile?.companionTone ?: "thozhan") }
    var soundEnabled by remember(profile) { mutableStateOf(profile?.soundEnabled ?: true) }
    var timeFormat by remember(profile) { mutableStateOf(profile?.timeFormat ?: "12h") }
    var waterTarget by remember(profile) { mutableIntStateOf(profile?.dailyWaterTargetMl ?: 2500) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmCream)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Preferences & Sanctuary Settings",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "Personalize your Muruga Care experience and notification cadence.",
                style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
            )
        }

        // 1. User Profile Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("User Profile", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Full Name") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = nickname,
                        onValueChange = { nickname = it },
                        label = { Text("Bala Murugan Calls You (e.g. Kanna, Thambi)") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }
        }

        // 2. Devotional Companion Tone
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Bala Murugan Voice & Tone", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(
                            "thozhan" to "Thozhan (Friendly)",
                            "anbudan" to "Anbudan (Gentle)",
                            "veeram" to "Veeram (Bold)"
                        ).forEach { (key, label) ->
                            FilterChip(
                                selected = companionTone == key,
                                onClick = { companionTone = key },
                                label = { Text(label, fontSize = 11.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = SaffronPrimary,
                                    selectedLabelColor = OnSaffron
                                )
                            )
                        }
                    }
                }
            }
        }

        // 3. Targets & Format Toggles
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurface),
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Preferences & Habits", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Devotional Temple Chimes", fontWeight = FontWeight.SemiBold)
                            Text("Play auspicious bell sound on completion", fontSize = 11.sp, color = TextSecondary)
                        }
                        Switch(
                            checked = soundEnabled,
                            onCheckedChange = { soundEnabled = it },
                            colors = SwitchDefaults.colors(checkedThumbColor = SaffronPrimary)
                        )
                    }

                    Divider(modifier = Modifier.padding(vertical = 12.dp), color = BorderSubtle)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Clock Format", fontWeight = FontWeight.SemiBold)
                            Text(if (timeFormat == "12h") "12-hour (09:30 AM)" else "24-hour (21:30)", fontSize = 11.sp, color = TextSecondary)
                        }
                        Button(
                            onClick = { timeFormat = if (timeFormat == "12h") "24h" else "12h" },
                            colors = ButtonDefaults.buttonColors(containerColor = SurfaceCream),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(timeFormat.uppercase(), color = TextPrimary, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Save Button
        item {
            Button(
                onClick = {
                    val updated = (profile ?: UserProfileEntity()).copy(
                        name = name,
                        nickname = nickname,
                        companionTone = companionTone,
                        soundEnabled = soundEnabled,
                        timeFormat = timeFormat,
                        dailyWaterTargetMl = waterTarget
                    )
                    viewModel.updateProfile(updated)
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("Save Sanctuary Settings", fontWeight = FontWeight.Bold)
            }
        }
    }
}
