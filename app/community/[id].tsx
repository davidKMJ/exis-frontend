import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import {
    Heart,
    MessageCircle,
    Clock,
    Bot,
    CornerDownRight,
    ArrowLeft,
} from "lucide-react-native";
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { DateTime, Settings } from "luxon";
import { formatRelativeDate, Locale } from "@/utils/relative-date";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

// Mock data (should be replaced with real data fetching)
const sampleQuestions = [
    {
        id: 1,
        title: "턱걸이 힘을 기르는 최고의 방법은 무엇인가요?",
        author: "운동매니아",
        likes: 24,
        createdAt: DateTime.now().minus({ hours: 2 }),
        tags: ["근력", "턱걸이"],
        content:
            "턱걸이 힘을 기르기 위한 최고의 방법은 무엇일까요? 다양한 운동법과 팁을 공유해주세요!",
        aiResponse:
            "턱걸이 힘을 기르기 위해서는 점진적 과부하 원칙을 적용한 보조 운동(예: 네거티브 턱걸이, 밴드 턱걸이)과 충분한 휴식, 영양 섭취가 중요합니다. 주 2~3회 꾸준히 연습해보세요!",
        replies: [
            {
                id: 1,
                author: "헬스초보",
                content: "저는 밴드 턱걸이로 시작해서 점점 힘이 붙었어요!",
                createdAt: DateTime.now().minus({ hours: 1, minutes: 10 }),
            },
            {
                id: 2,
                author: "운동고수",
                content: "네거티브 턱걸이 강추합니다.",
                createdAt: DateTime.now().minus({ minutes: 40 }),
            },
        ],
    },
    // ... more questions
];

function CommunityDetailHeader({ title }: { title: string }) {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const iconColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-typography-900"]
    })`;
    return (
        <Box className="flex-row items-center p-4">
            <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                style={{ marginRight: 8 }}
            >
                <ArrowLeft size={24} color={iconColor} />
            </Pressable>
            <Heading size="lg" className="text-typography-900 font-bold">
                {title}
            </Heading>
        </Box>
    );
}

function CommunityDetailError() {
    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1 }}>
                <CommunityDetailHeader title="" />
                <Box className="flex-1 bg-background-0 p-5 items-center justify-center">
                    <Link href="/(tabs)/community" dismissTo asChild>
                        <Text className="text-typography-700 text-lg">
                            질문을 찾을 수 없습니다.
                        </Text>
                    </Link>
                </Box>
            </SafeAreaView>
        </Box>
    );
}

function CommunityDetailSuccess({
    question,
}: {
    question: (typeof sampleQuestions)[0];
}) {
    const { colorScheme } = useColorScheme();
    const iconColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-typography-500"]
    })`;
    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <CommunityDetailHeader title="커뮤니티" />
                <ScrollView className="flex-1 bg-background-0 p-6">
                    {/* Author Row */}
                    <Box className="flex-row items-center mb-4">
                        <Avatar size="md">
                            <AvatarFallbackText>
                                {question.author.slice(0, 2)}
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: "https://avatars.githubusercontent.com/u/62834557?v=4",
                                }}
                            />
                        </Avatar>
                        <Box className="ml-3">
                            <Text className="text-typography-900 font-semibold text-base">
                                {question.author}
                            </Text>
                            <Box className="flex-row items-center mt-1">
                                <Clock size={13} color={iconColor} />
                                <Text className="text-typography-500 text-xs ml-1">
                                    {formatRelativeDate(
                                        question.createdAt,
                                        Settings.defaultLocale as Locale
                                    )}
                                </Text>
                            </Box>
                        </Box>
                    </Box>

                    {/* Title */}
                    <Heading
                        size="xl"
                        className="text-typography-900 mb-2 font-bold text-xl"
                    >
                        {question.title}
                    </Heading>

                    {/* Tags */}
                    <Box className="flex-row items-center mb-4 flex-wrap gap-2">
                        {question.tags.map((tag, idx) => (
                            <Box
                                key={idx}
                                className="bg-secondary-100 px-3 py-1 rounded-full"
                            >
                                <Text className="text-typography-600 text-xs">
                                    #{tag}
                                </Text>
                            </Box>
                        ))}
                    </Box>

                    {/* Content */}
                    <Box className="bg-secondary-50 rounded-2xl p-4 mb-6 border border-secondary-300 shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                        <Text className="text-typography-900 text-base leading-relaxed">
                            {question.content}
                        </Text>
                    </Box>

                    {/* Stats Row */}
                    <Box className="flex-row items-center mb-6 gap-6">
                        <Box className="flex-row items-center">
                            <Heart size={20} color={iconColor} />
                            <Text className="ml-1 text-typography-700 font-semibold text-lg">
                                {question.likes}
                            </Text>
                        </Box>
                        <Box className="flex-row items-center">
                            <MessageCircle size={20} color={iconColor} />
                            <Text className="ml-1 text-typography-700 font-semibold text-lg">
                                {question.replies.length}
                            </Text>
                        </Box>
                    </Box>

                    <Box className="gap-4 mb-10">
                        <Box className="relative mb-2">
                            <LinearGradient
                                colors={["#FFBF00", "#00FFFF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    position: "absolute",
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    borderRadius: 16,
                                    opacity: 0.1,
                                    zIndex: 1,
                                }}
                            />
                            <Box
                                className="rounded-2xl flex-row items-start shadow-[-1px_-1px_1px_rgba(0,0,0,0.05)] shadow-amber-400"
                                style={{ position: "relative", zIndex: 0 }}
                            >
                                <Box className="w-full h-full shadow-[1px_1px_1px_rgba(0,0,0,0.05)] shadow-cyan-400 bg-background-0 rounded-2xl p-4 flex-row items-start" style={{ zIndex: 2 }}>
                                    <Box className="mr-3 mt-1">
                                        <Bot size={28} color={iconColor} />
                                    </Box>
                                    <Box className="flex-1">
                                        <Text className="text-primary-900 font-semibold mb-1">
                                            AI의 답변
                                        </Text>
                                        <Text className="text-primary-900 text-base leading-relaxed">
                                            {question.aiResponse}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {question.replies.map((reply) => (
                            <Box
                                key={reply.id}
                                className="flex-row items-start bg-secondary-50 rounded-xl p-3 border border-secondary-300 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            >
                                <Box className="mt-1 mr-2">
                                    <CornerDownRight
                                        size={16}
                                        color={iconColor}
                                    />
                                </Box>
                                <Box className="flex-1">
                                    <Text className="font-semibold text-typography-900 mb-1">
                                        {reply.author}
                                    </Text>
                                    <Text className="text-typography-700 mb-1">
                                        {reply.content}
                                    </Text>
                                    <Text className="text-typography-400 text-xs">
                                        {formatRelativeDate(
                                            reply.createdAt,
                                            Settings.defaultLocale as Locale
                                        )}
                                    </Text>
                                </Box>
                            </Box>
                        ))}
                        {question.replies.length === 0 && (
                            <Text className="text-typography-400">
                                아직 답변이 없습니다.
                            </Text>
                        )}
                    </Box>
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}

export default function CommunityDetailScreen() {
    const { id } = useLocalSearchParams();
    const question = sampleQuestions.find((q) => q.id === Number(id));
    if (!question) {
        return <CommunityDetailError />;
    }
    return <CommunityDetailSuccess question={question} />;
}
