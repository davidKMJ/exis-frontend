import React from "react";
import { Tabs, usePathname } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Dumbbell, Calendar, Users, User, Settings } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

function TabBarIcon({
    Icon,
    color,
    isSelected,
}: {
    Icon: any;
    color: string;
    isSelected: boolean;
}) {
    return <Icon size={28} color={color} fill={isSelected ? color : "none"} />;
}

export default function TabLayout() {
    const { colorScheme } = useColorScheme();

    const backgroundColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-background-0"]
    })`;
    const activeColor = `rgb(${
        colors[colorScheme ?? "light"]["--color-background-950"]
    })`;
    const inactiveColor =
        colorScheme === "dark"
            ? `rgb(${colors[colorScheme ?? "light"]["--color-background-100"]})`
            : `rgb(${
                  colors[colorScheme ?? "light"]["--color-background-300"]
              })`;
    const borderColor =
        colorScheme === "dark"
            ? `rgb(${colors[colorScheme ?? "light"]["--color-secondary-100"]})`
            : `rgb(${colors[colorScheme ?? "light"]["--color-secondary-400"]})`;

    const pathname = usePathname();

    return (
        <Box className="flex-1 bg-background-0">
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                    tabBarStyle: [
                        {
                            position: "absolute",
                            backgroundColor: backgroundColor,
                            borderTopWidth: 2,
                            borderWidth: 2,
                            borderColor: borderColor,
                            height: 60,
                            borderRadius: 20,
                            marginHorizontal: 8,
                            marginBottom: Platform.OS === "ios" ? 40 : 30,
                            paddingTop: 8,
                            // iOS shadow properties
                            shadowColor: "#000000",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: colorScheme === "dark" ? 0.3 : 0.2,
                            shadowRadius: 8,
                            // Android shadow properties
                            elevation: 8,
                        },
                    ],
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon
                                Icon={Dumbbell}
                                color={color}
                                isSelected={pathname === "/"}
                            />
                        ),
                        animation: "fade",
                    }}
                />
                <Tabs.Screen
                    name="calendar"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon
                                Icon={Calendar}
                                color={color}
                                isSelected={false}
                            />
                        ),
                        animation: "fade",
                    }}
                />
                <Tabs.Screen
                    name="community"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon
                                Icon={Users}
                                color={color}
                                isSelected={false}
                            />
                        ),
                        animation: "fade",
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon
                                Icon={Settings}
                                color={color}
                                isSelected={false}
                            />
                        ),
                        animation: "fade",
                    }}
                />
            </Tabs>
        </Box>
    );
}
