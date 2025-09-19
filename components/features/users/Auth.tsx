import React, { useState } from "react";
import { Alert, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react-native";
import { useAuthStore } from "@/utils/auth-store";
import Svg, { Circle, Path } from "react-native-svg";
import { Divider } from "@/components/ui/divider";

// Kakao Icon
function KakaoIcon({ size = 40 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="12" fill="none" />
            <Path
                d="M6 12c0-2.5 2.7-4.5 6-4.5s6 2 6 4.5-2.7 4.5-6 4.5c-.36 0-.71-.02-1.05-.06l-2.1.93a.5.5 0 0 1-.68-.6l.38-1.36C7.13 14.5 6 13.33 6 12z"
                fill="#191919"
            />
        </Svg>
    );
}

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {
        signInWithEmail,
        signUpWithEmail,
        authLoading,
        tempSignIn,
        signInError,
        signUpError,
    } = useAuthStore();

    const handleSignIn = async () => {
        await signInWithEmail(email, password);
        if (signInError) Alert.alert(signInError);
    };

    const handleSignUp = async () => {
        await signUpWithEmail(email, password);
        if (signUpError) Alert.alert(signUpError);
    };

    return (
        <Box className="w-full max-w-md px-4">
            {/* Email/Password Auth Form */}
            <Box className="mb-4">
                <Text className="mb-2">이메일</Text>
                <Input className="h-14">
                    <InputSlot className="pl-3">
                        <InputIcon as={Mail} />
                    </InputSlot>
                    <InputField
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@address.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </Input>
            </Box>
            <Box className="mb-8">
                <Text className="mb-2">비밀번호</Text>
                <Input className="h-14">
                    <InputSlot className="pl-3">
                        <InputIcon as={Lock} />
                    </InputSlot>
                    <InputField
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        autoCapitalize="none"
                        secureTextEntry
                    />
                </Input>
            </Box>
            <Button
                variant="outline"
                className="h-14 mb-4"
                disabled={authLoading}
                onPress={handleSignIn}
            >
                <Text className="text-typography-950">로그인</Text>
            </Button>
            <Button
                variant="solid"
                className="h-14"
                disabled={authLoading}
                onPress={handleSignUp}
            >
                <Text className="text-typography-0">회원가입</Text>
            </Button>
            <Divider className="my-6" orientation="horizontal" />
            <Text className="text-typography-950 text-center">또는</Text>
            {/* Kakao Sign-In Button */}
            <Pressable
                onPress={tempSignIn}
                className="bg-[#FEE500] flex-row items-center shadow-sm mt-6 h-14 justify-center rounded-md"
            >
                <KakaoIcon size={40} />
                <Text
                    className="ml-2 mr-2 text-base font-semibold"
                    style={{ color: "#191919" }}
                >
                    카카오로 시작하기
                </Text>
            </Pressable>
        </Box>
    );
}
