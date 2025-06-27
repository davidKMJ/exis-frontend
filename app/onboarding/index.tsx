import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/utils/auth-store";
import { Pressable, SafeAreaView } from "react-native";

export default function OnboardingScreen() {
    const { completeOnboarding } = useAuthStore();
    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <Pressable onPress={completeOnboarding}>
                    <Text>Onboarding</Text>
                </Pressable>
            </SafeAreaView>
        </Box>
    );
}