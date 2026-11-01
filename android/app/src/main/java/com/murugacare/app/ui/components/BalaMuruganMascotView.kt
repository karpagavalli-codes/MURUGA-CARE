package com.murugacare.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.murugacare.app.ui.theme.*

@Composable
fun BalaMuruganMascotView(
    modifier: Modifier = Modifier,
    size: Dp = 160.dp,
    expressionText: String = "Vetrivel Muruganukku Haroharohara!",
    subText: String? = "Start every work with clarity and devotion.",
    showSpeechBubble: Boolean = true
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

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(size)
        ) {
            // Devotional Divine Golden Halo Aura
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .scale(haloPulse)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                AntiqueGold.copy(alpha = 0.45f),
                                SaffronPrimary.copy(alpha = 0.25f),
                                Color.Transparent
                            )
                        )
                    )
            )

            // Inner Ring with Peacock Teal and Gold accents
            Box(
                modifier = Modifier
                    .size(size * 0.88f)
                    .clip(CircleShape)
                    .border(2.dp, Brush.linearGradient(listOf(AntiqueGold, SaffronLight)), CircleShape)
                    .background(WarmCream)
            )

            // 3D Bala Murugan Mascot Image
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data("file:///android_asset/murugan_3d_clean.png")
                    .crossfade(true)
                    .build(),
                contentDescription = "Adorable 3D Child Lord Murugan with Golden Vel",
                modifier = Modifier
                    .size(size * 0.85f)
                    .clip(CircleShape),
                contentScale = ContentScale.Fit
            )
        }

        if (showSpeechBubble) {
            Spacer(modifier = Modifier.height(10.dp))
            Surface(
                modifier = Modifier
                    .fillMaxWidth(0.92f)
                    .shadow(4.dp, RoundedCornerShape(18.dp)),
                shape = RoundedCornerShape(18.dp),
                color = CardSurface,
                border = BorderStroke(1.dp, SaffronContainer)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Filled.AutoAwesome,
                        contentDescription = "Blessing",
                        tint = AntiqueGold,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = expressionText,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                fontSize = 15.sp
                            )
                        )
                        if (!subText.isNullOrBlank()) {
                            Text(
                                text = subText,
                                style = MaterialTheme.typography.bodySmall.copy(
                                    color = TextSecondary,
                                    fontSize = 12.sp
                                )
                            )
                        }
                    }
                }
            }
        }
    }
}
