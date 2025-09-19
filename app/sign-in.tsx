import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import Auth from "@/components/features/users/Auth";
import { Button } from "@/components/ui/button";
import { clearAuthStore } from "@/utils/auth-store";

export default function LoginScreen() {
    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1 }}>
                <Box className="flex-1 items-center justify-center px-8">
                    <Button
                        variant="outline"
                        className="mb-10"
                        onPress={() => {
                            clearAuthStore();
                        }}
                    >
                        <Text>초기화</Text>
                    </Button>
                    <Heading size="xl" className="mb-4 text-typography-900">
                        환영합니다!
                    </Heading>
                    <Auth />
                </Box>
            </SafeAreaView>
        </Box>
    );
}
