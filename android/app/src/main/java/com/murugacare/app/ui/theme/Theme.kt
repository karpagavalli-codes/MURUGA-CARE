package com.murugacare.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = SaffronPrimary,
    onPrimary = OnSaffron,
    primaryContainer = SaffronContainer,
    onPrimaryContainer = TextPrimary,
    secondary = AntiqueGold,
    onSecondary = OnSaffron,
    secondaryContainer = GoldLight,
    onSecondaryContainer = GoldDark,
    tertiary = PeacockTeal,
    onTertiary = OnSaffron,
    tertiaryContainer = PeacockTealLight,
    onTertiaryContainer = PeacockTealDark,
    background = WarmCream,
    surface = CardSurface,
    surfaceVariant = SurfaceCream,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary,
    outline = BorderSubtle,
    error = MagentaVermilion
)

private val DarkColorScheme = darkColorScheme(
    primary = SaffronPrimary,
    onPrimary = OnSaffron,
    primaryContainer = SaffronDark,
    secondary = AntiqueGold,
    tertiary = PeacockTeal,
    background = RoyalBlue,
    surface = Color(0xFF132B45),
    surfaceVariant = Color(0xFF1B3B5C),
    onBackground = WarmCream,
    onSurface = WarmCream,
    outline = Color(0xFF325475)
)

@Composable
fun MurugaCareTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = SaffronPrimary.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
