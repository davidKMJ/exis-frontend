import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { useModeStore } from "@/utils/mode-store";
import { Pressable, Alert, ScrollView } from "react-native";
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
    ChevronDown,
    ChevronUp,
} from "lucide-react-native";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { supabase } from "@/lib/supabase";

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
    const { signOut, session } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.id) {
                setError("로그인 정보가 없습니다.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from("profiles")
                .select(
                    "profile_id, avatar, name, username, bio, role, gender, age, height, weight, instagram, stats, created_at, updated_at"
                )
                .eq("profile_id", session.user.id)
                .single();
            if (error) {
                setError("프로필 정보를 불러오지 못했습니다.");
                setProfile(null);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [session?.user?.id]);

    const handleLogout = async () => {
        Alert.alert("로그아웃", "로그아웃하시겠습니까?", [
            {
                text: "확인",
                onPress: async () => {
                    await signOut();
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
        colors[colorScheme ?? "light"]["--color-typography-700"]
    })`;

    // Prepare profile fields for display (no key needed)
    const infoFields = profile
        ? [
              { label: "이름", value: profile.name || "-" },
              { label: "아이디", value: profile.username || "-" },
              { label: "성별", value: profile.gender || "-" },
              { label: "나이", value: profile.age ? String(profile.age) : "-" },
              {
                  label: "키",
                  value: profile.height ? `${profile.height}cm` : "-",
              },
              {
                  label: "몸무게",
                  value: profile.weight ? `${profile.weight}kg` : "-",
              },
              { label: "인스타그램", value: profile.instagram || "-" },
              { label: "소개", value: profile.bio || "-" },
              { label: "역할", value: profile.role || "-" },
          ]
        : [];

    // Followers/Following
    const followers = profile?.stats?.followers ?? 0;
    const following = profile?.stats?.following ?? 0;

    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <Box className="flex-1 bg-background-0">
                    {/* Top bar with title and logout */}
                    <Box className="flex-row items-center justify-between mb-2 px-5 pt-5">
                        <Heading size="xl" className="text-typography-900">
                            설정
                        </Heading>
                        <Button variant="link" onPress={handleLogout}>
                            <LogOut size={24} color={inactiveColor} />
                        </Button>
                    </Box>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Box className="flex-1 bg-background-0 p-5 pt-2">
                            {loading ? (
                                <Box className="items-center justify-center flex-1">
                                    <Text className="text-base text-typography-700">
                                        프로필 정보를 불러오는 중...
                                    </Text>
                                </Box>
                            ) : error ? (
                                <Box className="items-center justify-center flex-1">
                                    <Text className="text-base text-typography-700">
                                        {error}
                                    </Text>
                                </Box>
                            ) : profile ? (
                                <>
                                    {/* Profile Card (avatar, name, username, followers/following) */}
                                    <Box
                                        className={`bg-background-0 rounded-2xl border-2 p-5 mb-4 shadow-[0_2_4px_rgba(0,0,0,0.08)] items-center ${
                                            colorScheme === "dark"
                                                ? "border-secondary-100"
                                                : "border-secondary-400"
                                        }`}
                                    >
                                        <Avatar size="xl">
                                            {profile.avatar ? (
                                                <AvatarImage
                                                    source={{
                                                        uri: profile.avatar,
                                                    }}
                                                />
                                            ) : (
                                                <AvatarFallbackText size="xl">
                                                    {profile.name
                                                        ? profile.name[0]
                                                        : "?"}
                                                </AvatarFallbackText>
                                            )}
                                        </Avatar>
                                        <Heading
                                            size="lg"
                                            className="text-typography-900 mt-3"
                                        >
                                            {profile.name || "-"}
                                        </Heading>
                                        <Text className="text-base text-typography-700 mt-1">
                                            @{profile.username || "-"}
                                        </Text>
                                        <Box className="flex-row items-center justify-center mt-3 mb-1 gap-6">
                                            <Box className="items-center">
                                                <Text className="text-xs text-typography-500">
                                                    팔로워
                                                </Text>
                                                <Text className="text-base font-semibold text-typography-900 mt-0.5">
                                                    {followers}
                                                </Text>
                                            </Box>
                                            <Box className="w-0.5 h-6 bg-background-200 mx-2" />
                                            <Box className="items-center">
                                                <Text className="text-xs text-typography-500">
                                                    팔로잉
                                                </Text>
                                                <Text className="text-base font-semibold text-typography-900 mt-0.5">
                                                    {following}
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Text className="text-xs text-typography-500 mt-2">
                                            가입일:{" "}
                                            <Text className="font-semibold text-typography-900">
                                                {profile.created_at
                                                    ? profile.created_at.slice(
                                                          0,
                                                          10
                                                      )
                                                    : "-"}
                                            </Text>
                                        </Text>
                                    </Box>

                                    {/* Info Card */}
                                    <Box
                                        className={`bg-background-0 rounded-2xl border-2 p-5 mb-4 shadow-[0_2_4px_rgba(0,0,0,0.08)] ${
                                            colorScheme === "dark"
                                                ? "border-secondary-100"
                                                : "border-secondary-400"
                                        }`}
                                    >
                                        <Box className="flex-row items-center justify-between mb-4">
                                            <Heading
                                                size="md"
                                                className="text-typography-900"
                                            >
                                                정보
                                            </Heading>
                                            {/* Profile Edit Button */}
                                            <Button
                                                variant="link"
                                                className="border-primary-500"
                                                onPress={() => {
                                                    /* TODO: navigate to profile edit */
                                                }}
                                            >
                                                <Text className="text-primary-0 font-semibold">
                                                    수정
                                                </Text>
                                            </Button>
                                        </Box>

                                        <Box className="gap-3">
                                            {infoFields.map((field) => (
                                                <Box
                                                    key={field.label}
                                                    className="flex-row items-center justify-between"
                                                >
                                                    {field.label === "인스타그램" ? (
                                                        <Box className="flex-row items-center">
                                                            <Instagram size={20} color={textColor} />
                                                        </Box>
                                                    ) : (
                                                        <Text className="text-base text-typography-700 font-medium">
                                                            {field.label}
                                                        </Text>
                                                    )}
                                                    <Text className="text-base text-typography-900">
                                                        {field.value}
                                                    </Text>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </>
                            ) : null}

                            {/* Settings Card */}
                            <Box
                                className={`bg-background-0 rounded-2xl border-2 p-5 mb-6 shadow-[0_2_4px_rgba(0,0,0,0.08)] ${
                                    colorScheme === "dark"
                                        ? "border-secondary-100"
                                        : "border-secondary-400"
                                }`}
                            >
                                <Heading
                                    size="md"
                                    className="mb-3 text-typography-900"
                                >
                                    설정
                                </Heading>
                                {/* Dark Mode Segmented Control */}
                                <Box className="flex-row justify-center">
                                    <Box className="flex-row bg-background-50 rounded-full p-1 border border-secondary-300">
                                        {modeOptions.map((mode) => {
                                            const ModeIcon = modeIcons[mode];
                                            return (
                                                <Pressable
                                                    key={mode}
                                                    onPress={() =>
                                                        setMode(mode)
                                                    }
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
                    </ScrollView>
                </Box>
            </SafeAreaView>
        </Box>
    );
}
