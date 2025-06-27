import React, { useContext } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { useAuthStore } from "@/utils/auth-store";

// Improved Kakao Icon
function KakaoIcon({ size = 40 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Yellow background */}
            <Circle cx="12" cy="12" r="12" fill="#FEE500" />
            {/* Speech bubble */}
            <Path
                d="M6 12c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5-2.7 4.5-6 4.5c-.36 0-.71-.02-1.05-.06l-2.1.93a.5.5 0 0 1-.68-.6l.38-1.36C7.13 14.5 6 13.33 6 12z"
                fill="#191919"
            />
        </Svg>
    );
}

export default function LoginScreen() {
    const { logIn } = useAuthStore();

    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1 }}>
                <Box className="flex-1 items-center justify-center px-8">
                    <Heading size="xl" className="mb-4 text-typography-900">
                        환영합니다!
                    </Heading>
                    <Text className="mb-10 text-typography-600 text-base text-center">
                        카카오 계정으로 간편하게 시작하세요!
                    </Text>
                    <Pressable
                        onPress={logIn}
                        className="bg-[#FEE500] rounded-xl py-2 px-4 flex-row items-center shadow-md"
                    >
                        <Box className="flex-row items-center">
                            <KakaoIcon size={40} />
                            <Text
                                className="ml-2 mr-2 text-base font-semibold"
                                style={{ color: "#191919" }}
                            >
                                카카오로 시작하기
                            </Text>
                        </Box>
                    </Pressable>
                </Box>
            </SafeAreaView>
        </Box>
    );
}
