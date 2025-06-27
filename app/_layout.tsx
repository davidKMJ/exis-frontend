import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { useFonts } from "expo-font";
import { Redirect, Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useContext, useEffect, useState } from "react";
import "react-native-reanimated";
import { useAuthStore } from "@/utils/auth-store";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useModeStore } from "@/utils/mode-store";

import { Settings } from "luxon";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontLoaded, fontError] = useFonts({
        SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    Settings.defaultLocale = "ko";
    Settings.defaultZone = "Asia/Seoul";

    const { mode } = useModeStore();

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]);

    useEffect(() => {
        if (fontLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded]);

    if (!fontLoaded) {
        return null;
    }

    return (
        <GluestackUIProvider mode={mode}> 
            <RootLayoutNav />
        </GluestackUIProvider>
    );
}

function RootLayoutNav() {
    const { isLoggedIn, hasCompletedOnboarding } = useAuthStore();

    return (
        <Stack>
            <Stack.Protected guard={isLoggedIn && hasCompletedOnboarding}>
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false, animation: "fade" }}
                />
                <Stack.Screen
                    name="community/[id]"
                    options={{ headerShown: false }}
                />
            </Stack.Protected>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        headerShown: false,
                        animation: "slide_from_bottom",
                    }}
                />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn && !hasCompletedOnboarding}>
                <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                />
            </Stack.Protected>
        </Stack>
    );
}
