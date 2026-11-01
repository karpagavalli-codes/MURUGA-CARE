package com.murugacare.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.murugacare.app.ui.theme.*

@Composable
fun PriorityVelIndicator(
    priority: Int,
    modifier: Modifier = Modifier
) {
    val velCount = priority.coerceIn(1, 3)
    val velLabel = when (velCount) {
        3 -> "Vel Veeram (High)"
        2 -> "Thozhan (Medium)"
        else -> "Anbudan (Low)"
    }
    val velColor = when (velCount) {
        3 -> MagentaVermilion
        2 -> AntiqueGold
        else -> PeacockTeal
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(velColor.copy(alpha = 0.12f))
            .border(1.dp, velColor.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        repeat(velCount) {
            Text(
                text = "🔱",
                fontSize = 11.sp,
                modifier = Modifier.padding(end = 2.dp)
            )
        }
        Text(
            text = velLabel,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                color = velColor,
                fontSize = 10.sp
            )
        )
    }
}

@Composable
fun CategoryBadge(
    category: String,
    modifier: Modifier = Modifier
) {
    val (badgeBg, badgeText) = when (category.lowercase()) {
        "work" -> RoyalBlueContainer to RoyalBlue
        "health" -> PeacockTealLight to PeacockTeal
        "study", "college" -> SaffronLight to SaffronDark
        "spiritual" -> GoldLight to GoldDark
        else -> SurfaceCream to TextSecondary
    }

    Surface(
        shape = RoundedCornerShape(8.dp),
        color = badgeBg,
        modifier = modifier
    ) {
        Text(
            text = category.replaceFirstChar { it.uppercase() },
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.SemiBold,
                color = badgeText,
                fontSize = 10.sp
            ),
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
        )
    }
}

@Composable
fun SacredUruliVessel(
    progressPercent: Float,
    currentMl: Int,
    targetMl: Int,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = CardSurface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = BorderStroke(1.dp, SaffronContainer)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Sacred Theertham Uruli",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            )
            Text(
                text = "Blessed water for mind and physical vitality",
                style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(170.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            listOf(
                                PeacockTealLight,
                                WarmCream
                            )
                        )
                    )
                    .border(4.dp, Brush.linearGradient(listOf(AntiqueGold, SaffronPrimary)), CircleShape)
            ) {
                // Circular water level representation
                CircularProgressIndicator(
                    progress = { progressPercent.coerceIn(0f, 1f) },
                    modifier = Modifier.size(150.dp),
                    color = PeacockTeal,
                    trackColor = PeacockTealLight.copy(alpha = 0.5f),
                    strokeWidth = 12.dp
                )

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "🌊",
                        fontSize = 24.sp
                    )
                    Text(
                        text = "$currentMl",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            color = PeacockTealDark
                        )
                    )
                    Text(
                        text = "/ $targetMl ml",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = TextSecondary,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            val percentInt = (progressPercent * 100).toInt()
            LinearProgressIndicator(
                progress = { progressPercent.coerceIn(0f, 1f) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = SaffronPrimary,
                trackColor = SaffronContainer
            )

            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "$percentInt% Completed",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = SaffronDark
                    )
                )
                Text(
                    text = "${(targetMl - currentMl).coerceAtLeast(0)} ml remaining",
                    style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                )
            }
        }
    }
}
