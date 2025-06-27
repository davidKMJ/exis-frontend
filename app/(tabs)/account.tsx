import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { useModeStore } from "@/utils/mode-store";
import { Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar";
import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { useAuthStore } from "@/utils/auth-store";
import {
    Instagram,
    LogOut,
    LucideIcon,
    MonitorCog,
    Moon,
    Pencil,
    Sun,
} from "lucide-react-native";
import { colors } from "@/components/ui/gluestack-ui-provider/config";

const accountInfo = {
    name: "홍길동",
    username: "honggildong",
    height: "175cm",
    weight: "70kg",
    gender: "남성",
    bio: "운동을 사랑하는 개발자입니다.",
    instagram: "exis_fit",
    avatarUrl: "",
    joinDate: "2023-01-15",
};

type PublicFieldKey = keyof typeof publicFieldsDefault;
const publicFieldsDefault = {
    name: true,
    username: true,
    height: false,
    weight: false,
    gender: false,
    bio: true,
    instagram: true,
};

const profileFields: { label: string; value: string; key: PublicFieldKey }[] = [
    { label: "Name", value: accountInfo.name, key: "name" },
    { label: "Username", value: accountInfo.username, key: "username" },
    { label: "Height", value: accountInfo.height, key: "height" },
    { label: "Weight", value: accountInfo.weight, key: "weight" },
    { label: "Gender", value: accountInfo.gender, key: "gender" },
    { label: "Bio", value: accountInfo.bio, key: "bio" },
    { label: "Instagram", value: accountInfo.instagram, key: "instagram" },
];

const modeOptions: ModeType[] = ["system", "light", "dark"];
const modeLabels: Record<ModeType, string> = {
    system: "시스템",
    light: "라이트",
    dark: "다크",
};

const modeIcons: Record<ModeType, LucideIcon> = {
    system: MonitorCog,
    light: Sun,
    dark: Moon,
};

export default function AccountScreen() {
    const { colorScheme } = useColorScheme();
    const { mode: currentMode, setMode } = useModeStore();
    const { logOut } = useAuthStore();
    const [publicFields, setPublicFields] = useState(publicFieldsDefault);

    const handleLogout = async () => {
        Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
            {
                text: "확인",
                onPress: async () => {
                    await logOut();
                },
                style: "destructive",
            },
            {
                text: "취소",
                style: "cancel",
            },
        ]);
    };

    const activeColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-background-100"]
    })`;
    const inactiveColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-background-300"]
    })`;
    const textColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-typography-900"]
    })`;

    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <Box className="flex-1 bg-background-0 p-5">
                    <Heading size="xl" className="text-typography-900 mb-4">
                        설정
                    </Heading>
                    <Box
                        className={`flex-row items-center mb-4 bg-background-0 rounded-2xl border-2 p-5 shadow-[0_2_4px_rgba(0,0,0,0.2)] ${
                            colorScheme === "dark"
                                ? "border-secondary-100"
                                : "border-secondary-400"
                        }`}
                    >
                        <Avatar size="xl">
                            {accountInfo.avatarUrl ? (
                                <AvatarImage
                                    source={{ uri: accountInfo.avatarUrl }}
                                />
                            ) : (
                                <AvatarFallbackText size="xl">
                                    {accountInfo.name[0]}
                                </AvatarFallbackText>
                            )}
                        </Avatar>
                        <Box className="ml-6 flex-1">
                            <Heading
                                size="lg"
                                className="text-typography-900 mb-1"
                            >
                                {accountInfo.name}
                            </Heading>
                            <Text className="text-base text-typography-700 mb-1">
                                Username: {accountInfo.username}
                            </Text>
                            <Text className="text-xs text-typography-500">
                                가입일:{" "}
                                <Text className="font-semibold text-typography-900">
                                    {accountInfo.joinDate}
                                </Text>
                            </Text>
                        </Box>
                        <Box className="ml-1 mr-2">
                            <Button onPress={handleLogout} variant="link">
                                <LogOut color={inactiveColor} size={24} />
                            </Button>
                        </Box>
                    </Box>

                    {/* Profile Details Card */}
                    <Box
                        className={`bg-background-0 rounded-2xl border-2 p-5 mb-4 shadow-[0_2_4px_rgba(0,0,0,0.2)] items-center ${
                            colorScheme === "dark"
                                ? "border-secondary-100"
                                : "border-secondary-400"
                        }`}
                    >
                        <Button variant="solid" className="flex-row items-center gap-2 mb-3 w-3/5 bg-background-50 border-2 border-secondary-200">
                            <Pencil size={16} color={textColor} />
                            <Text className="text-sm font-semibold text-typography-900" style={{ color: textColor }}>
                                프로필 수정
                                {"    "}
                            </Text>
                        </Button>
                        {profileFields.map((field) => (
                            <Box
                                key={field.key}
                                className="flex-row items-center justify-between mb-3 w-full"
                            >
                                <Box className="flex-row items-center">
                                    {field.key === "instagram" ? (
                                        <Instagram
                                            size={18}
                                            color={textColor}
                                        />
                                    ) : (
                                        <Text className="text-base font-semibold text-typography-900">
                                            {field.label}
                                        </Text>
                                    )}
                                    <Text className="text-base text-typography-700 ml-2">
                                        {field.value}
                                    </Text>
                                </Box>
                                <Pressable
                                    onPress={() =>
                                        setPublicFields((prev) => ({
                                            ...prev,
                                            [field.key]: !prev[field.key],
                                        }))
                                    }
                                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold w-16 items-center justify-center ${
                                        publicFields[field.key]
                                            ? "bg-success-300"
                                            : "bg-background-50"
                                    }`}
                                >
                                    <Text className="text-typography-700">
                                        {publicFields[field.key]
                                            ? "공개"
                                            : "비공개"}
                                    </Text>
                                </Pressable>
                            </Box>
                        ))}
                    </Box>

                    {/* Settings Card */}
                    <Box
                        className={`bg-background-0 rounded-2xl border-2 p-5 mb-6 shadow-[0_2_4px_rgba(0,0,0,0.2)] ${
                            colorScheme === "dark"
                                ? "border-secondary-100"
                                : "border-secondary-400"
                        }`}
                    >
                        <Heading size="md" className="mb-3 text-typography-900">
                            설정
                        </Heading>
                        {/* Dark Mode Segmented Control */}
                        <Box className="flex-row justify-center mb-6">
                            <Box className="flex-row bg-background-50 rounded-full p-1 border border-secondary-300">
                                {modeOptions.map((mode) => {
                                    const ModeIcon = modeIcons[mode];
                                    return (
                                        <Pressable
                                            key={mode}
                                            onPress={() => setMode(mode)}
                                            className={`rounded-full h-12 w-16 items-center justify-center ${
                                                currentMode === mode
                                                    ? "bg-primary-500"
                                                    : "bg-background-50"
                                            }`}
                                        >
                                            <ModeIcon
                                                size={24}
                                                color={
                                                    currentMode === mode
                                                        ? activeColor
                                                        : inactiveColor
                                                }
                                            />
                                        </Pressable>
                                    );
                                })}
                            </Box>
                        </Box>
                        <Text className="text-base text-typography-700 mb-2"></Text>
                    </Box>
                </Box>
            </SafeAreaView>
        </Box>
    );
}
