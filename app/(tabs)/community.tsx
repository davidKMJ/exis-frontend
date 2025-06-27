import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { Heart, MessageCircle, Clock } from "lucide-react-native";
import { DateTime, Settings } from "luxon";
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { formatRelativeDate, Locale } from "@/utils/relative-date";
import { router } from "expo-router";

// Sample question data (Korean)
const sampleQuestions = [
    {
        id: 1,
        title: "턱걸이 힘을 기르는 최고의 방법은 무엇인가요?",
        author: "운동매니아",
        likes: 24,
        replies: 8,
        createdAt: DateTime.now().minus({ hours: 2 }),
        tags: ["근력", "턱걸이"],
    },
    {
        id: 2,
        title: "데드리프트 올바른 자세 - 제가 제대로 하고 있나요?",
        author: "헬스초보",
        likes: 15,
        replies: 12,
        createdAt: DateTime.now().minus({ days: 1 }),
        tags: ["자세", "데드리프트", "부상예방"],
    },
    {
        id: 3,
        title: "아침 운동 전 최고의 식사는?",
        author: "아침형인간",
        likes: 31,
        replies: 15,
        createdAt: DateTime.now().minus({ hours: 6 }),
        tags: ["영양", "운동전식사", "아침"],
    },
    {
        id: 4,
        title: "다이어트 중 동기부여를 유지하는 방법?",
        author: "다이어트중",
        likes: 42,
        replies: 23,
        createdAt: DateTime.now().minus({ days: 2 }),
        tags: ["동기부여", "다이어트", "식단"],
    },
    {
        id: 5,
        title: "하체 운동 후 근육통(DOMS) 회복 팁",
        author: "하체의달인",
        likes: 18,
        replies: 9,
        createdAt: DateTime.now().minus({ hours: 12 }),
        tags: ["회복", "근육통", "하체"],
    },
];

// Question Card Component
const QuestionCard = ({
    question,
    onPress,
}: {
    question: (typeof sampleQuestions)[0];
    onPress: () => void;
}) => {
    const { colorScheme } = useColorScheme();

    const iconColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-typography-500"]
    })`;

    return (
        <Pressable onPress={onPress}>
            <Box
                className={`bg-background-0 rounded-2xl border-2 p-4 mb-4 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${
                    colorScheme === "dark"
                        ? "border-secondary-100"
                        : "border-secondary-400"
                }`}
            >
                {/* Question Title */}
                <Heading
                    size="md"
                    className="text-typography-900 mb-2 font-semibold line-clamp-2"
                >
                    {question.title}
                </Heading>

                {/* Author and Time */}
                <Box className="flex-row items-center justify-between mb-3">
                    <Box className="flex-row items-center">
                        <Avatar size="xs">
                            <AvatarFallbackText>
                                {question.author.slice(0, 2)}
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: "https://avatars.githubusercontent.com/u/62834557?v=4",
                                }}
                            />
                        </Avatar>
                        <Text className="text-typography-500 text-xs font-medium">
                            {"  "}
                            {question.author}
                        </Text>
                    </Box>
                    <Box className="flex-row items-center gap-1">
                        <Clock
                            size={11}
                            color={iconColor}
                        />
                        <Text className="text-typography-400 text-xs">
                            {formatRelativeDate(
                                question.createdAt,
                                Settings.defaultLocale as Locale
                            )}
                        </Text>
                    </Box>
                </Box>

                {/* Stats Row */}
                <Box className="flex-row items-center justify-between">
                    <Box className="flex-row items-center space-x-4">
                        {/* Likes */}
                        <Box className="flex-row items-center">
                            <Heart
                                size={13}
                                className="text-typography-400"
                                color={iconColor}
                            />
                            <Text className="text-typography-500 text-xs font-medium ml-1">
                                {question.likes}
                            </Text>
                        </Box>

                        {/* Replies */}
                        <Box className="flex-row items-center ml-1">
                            <MessageCircle
                                size={13}
                                className="text-typography-400"
                                color={iconColor}
                            />
                            <Text className="text-typography-500 text-xs font-medium ml-1">
                                {question.replies}
                            </Text>
                        </Box>
                    </Box>

                    {/* Tags */}
                    <Box className="flex-row items-center space-x-1 gap-1">
                        {question.tags.slice(0, 2).map((tag, index) => (
                            <Box
                                key={index}
                                className="bg-secondary-100 px-2 py-1 rounded-full"
                            >
                                <Text className="text-typography-600 text-xs">
                                    #{tag}
                                </Text>
                            </Box>
                        ))}
                        {question.tags.length > 2 && (
                            <Text className="text-typography-400 text-xs">
                                +{question.tags.length - 2}
                            </Text>
                        )}
                    </Box>
                </Box>
            </Box>
        </Pressable>
    );
};

export default function CommunityScreen() {
    const { colorScheme } = useColorScheme();
    const [questions, setQuestions] = useState(sampleQuestions);

    const handleQuestionPress = (questionId: number) => {
        router.push(`/community/${questionId}`);
    };

    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <Box className="flex-1 bg-background-0">
                    <Heading
                        size="xl"
                        className="text-typography-900 mb-4 px-5 pt-5"
                    >
                        커뮤니티
                    </Heading>
                    <ScrollView
                        className="flex-1 w-full px-5 pt-2"
                        showsVerticalScrollIndicator={false}
                    >
                        <Box className="mb-6">
                            {questions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    onPress={() =>
                                        handleQuestionPress(question.id)
                                    }
                                />
                            ))}
                        </Box>
                    </ScrollView>
                </Box>
            </SafeAreaView>
        </Box>
    );
}
