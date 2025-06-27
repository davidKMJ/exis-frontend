import React, { useState, useRef, useEffect, useContext } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionTitleText,
    AccordionContent,
    AccordionContentText,
    AccordionIcon,
} from "@/components/ui/accordion";
import {
    Checkbox,
    CheckboxIndicator,
    CheckboxIcon,
} from "@/components/ui/checkbox";
import { Check } from "lucide-react-native";
import { Animated, Pressable } from "react-native";
import { clearAuthStore, useAuthStore } from "@/utils/auth-store";
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";
import { DateTime } from "luxon";

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

const workoutData = [
    {
        id: 1,
        name: "Pull-ups",
        sets: [
            { id: 1, reps: 8, weight: "Bodyweight", completed: false },
            { id: 2, reps: 8, weight: "Bodyweight", completed: false },
            { id: 3, reps: 6, weight: "Bodyweight", completed: false },
        ],
    },
    {
        id: 2,
        name: "Hammer Curls",
        sets: [
            { id: 1, reps: 12, weight: "25 lbs", completed: false },
            { id: 2, reps: 12, weight: "25 lbs", completed: false },
            { id: 3, reps: 10, weight: "25 lbs", completed: false },
        ],
    },
    {
        id: 3,
        name: "Barbell Rows",
        sets: [
            { id: 1, reps: 10, weight: "135 lbs", completed: false },
            { id: 2, reps: 10, weight: "135 lbs", completed: false },
            { id: 3, reps: 8, weight: "135 lbs", completed: false },
        ],
    },
    {
        id: 4,
        name: "Bicep Curls",
        sets: [
            { id: 1, reps: 12, weight: "30 lbs", completed: false },
            { id: 2, reps: 12, weight: "30 lbs", completed: false },
            { id: 3, reps: 10, weight: "30 lbs", completed: false },
        ],
    },
];

export default function DashboardScreen() {
    const { logOut } = useAuthStore();
    const { colorScheme } = useColorScheme();
    const [workoutState, setWorkoutState] = useState(workoutData);
    const [containerWidth, setContainerWidth] = useState(0);
    const animatedProgress = useRef(new Animated.Value(0)).current;

    // Calculate progress
    const totalSets = workoutState.reduce(
        (acc, exercise) => acc + exercise.sets.length,
        0
    );
    const completedSets = workoutState.reduce(
        (acc, exercise) =>
            acc + exercise.sets.filter((set) => set.completed).length,
        0
    );
    const progressPercentage =
        totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    // Animate progress when it changes
    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: progressPercentage,
            duration: 500, // 500ms animation
            useNativeDriver: false, // Required for width animations
        }).start();
    }, [progressPercentage]);

    // Handle set completion
    const toggleSetCompletion = (exerciseId: number, setId: number) => {
        setWorkoutState((prev) =>
            prev.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                          ...exercise,
                          sets: exercise.sets.map((set) =>
                              set.id === setId
                                  ? { ...set, completed: !set.completed }
                                  : set
                          ),
                      }
                    : exercise
            )
        );
    };

    // Get set container styling based on completion
    const getSetContainerStyle = (isCompleted: boolean) => {
        return isCompleted
            ? "bg-background-0 border-secondary-100"
            : "bg-background-50 border-background-200";
    };

    return (
        <Box className="flex-1 bg-background-0">
            <SafeAreaView style={{ flex: 1, marginBottom: 35 }}>
                <Box className="flex-1 bg-background-0 p-5">
                    <Heading size="xl" className="text-typography-900 mb-4">
                        대시보드
                    </Heading>
                    <Box
                        className={`rounded-3xl border-2 bg-background-0 p-4 shadow-[0_2px_4px_rgba(0,0,0,0.2)] ${
                            colorScheme === "dark"
                                ? "border-secondary-100"
                                : "border-secondary-400"
                        }`}
                    >
                        {/* Progress Section */}
                        <Box className="mb-6 mt-4">
                            <Box
                                className="bg-background-300 rounded-full w-full h-3 mb-2"
                                onLayout={(e) =>
                                    setContainerWidth(
                                        e.nativeEvent.layout.width
                                    )
                                }
                            >
                                {containerWidth > 0 && (
                                    <Animated.View
                                        className="bg-primary-500 rounded-full h-full"
                                        style={{
                                            width: animatedProgress.interpolate(
                                            {
                                                    inputRange: [0, 100],
                                                    outputRange: [
                                                        0,
                                                        containerWidth,
                                                    ],
                                                }
                                            ),
                                        }}
                                    />
                                )}
                            </Box>
                            <Text className="text-xs text-typography-600">
                                {Math.round(progressPercentage)}% 완료됨
                            </Text>
                        </Box>

                        {/* Workout Title */}
                        <Box className="mb-4">
                            <Text className="text-lg font-semibold text-typography-900">
                                풀 데이 루틴
                            </Text>
                            <Text className="text-sm text-typography-600">
                                모든 운동을 완료하면 오늘의 운동이 끝납니다
                            </Text>
                        </Box>

                        {/* Accordion for Exercises */}
                        <Accordion variant="unfilled" size="md">
                            {workoutState.map((exercise) => (
                                <AccordionItem
                                    key={exercise.id}
                                    value={`exercise-${exercise.id}`}
                                >
                                    <AccordionHeader>
                                        <AccordionTrigger className="bg-secondary-50 rounded-lg my-2">
                                            <AccordionTitleText>
                                                {exercise.name === "Pull-ups"
                                                    ? "턱걸이"
                                                    : exercise.name ===
                                                      "Hammer Curls"
                                                    ? "해머 컬"
                                                    : exercise.name ===
                                                      "Barbell Rows"
                                                    ? "바벨 로우"
                                                    : exercise.name ===
                                                      "Bicep Curls"
                                                    ? "이두 컬"
                                                    : exercise.name}
                                            </AccordionTitleText>
                                            <AccordionIcon />
                                        </AccordionTrigger>
                                    </AccordionHeader>
                                    <AccordionContent>
                                        <AccordionContentText>
                                            <Box className="space-y-3">
                                                {exercise.sets.map((set) => (
                                                    <Box
                                                        key={set.id}
                                                        className={`flex-row items-center justify-between p-3 rounded-lg border h-15 w-full my-2 transition-colors duration-200 ${getSetContainerStyle(
                                                            set.completed
                                                        )}`}
                                                    >
                                                        <Box className="flex-1">
                                                            <Text
                                                                className={`text-sm font-medium ${
                                                                    set.completed
                                                                        ? "text-typography-100"
                                                                        : "text-typography-900"
                                                                }`}
                                                            >
                                                                세트 {set.id}
                                                            </Text>
                                                            <Text
                                                                className={`text-xs ${
                                                                    set.completed
                                                                        ? "text-typography-100"
                                                                        : "text-typography-600"
                                                                }`}
                                                            >
                                                                {set.reps}회 ×{" "}
                                                                {set.weight}
                                                            </Text>
                                                        </Box>
                                                        <Checkbox
                                                            value={`${exercise.id}-${set.id}`}
                                                            isChecked={
                                                                set.completed
                                                            }
                                                            onChange={() =>
                                                                toggleSetCompletion(
                                                                    exercise.id,
                                                                    set.id
                                                                )
                                                            }
                                                            size="md"
                                                        >
                                                            <CheckboxIndicator>
                                                                <CheckboxIcon
                                                                    as={Check}
                                                                />
                                                            </CheckboxIndicator>
                                                        </Checkbox>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </AccordionContentText>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Box>
                </Box>
            </SafeAreaView>
        </Box>
    );
}
