import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Pressable, RefreshControl } from "react-native";
import { useColorScheme } from "nativewind";
import {
    Heart,
    MessageCircle,
    Clock,
    BadgeQuestionMark,
    BadgeInfo,
} from "lucide-react-native";
import { DateTime, Settings } from "luxon";
import {
    Avatar,
    AvatarFallbackText,
    AvatarImage,
} from "@/components/ui/avatar";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { formatRelativeDate, Locale } from "@/utils/relative-date";
import { router } from "expo-router";
import { Badge, BadgeText } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const postTypeLabels: Record<string, string> = {
    question: "질문",
    article: "정보",
};

// Question Card Component
const PostCard = ({ post, onPress }: { post: any; onPress: () => void }) => {
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
                <Box className="flex-row items-center justify-between mb-1">
                    <Badge
                        variant="solid"
                        action="info"
                        className="bg-secondary-100 gap-1"
                    >
                        {post.type === "question" && (
                            <BadgeQuestionMark size={12} color={iconColor} />
                        )}
                        {post.type === "article" && (
                            <BadgeInfo size={12} color={iconColor} />
                        )}
                        <BadgeText className="text-typography-600">
                            {postTypeLabels[post.type]}
                        </BadgeText>
                    </Badge>
                </Box>
                {/* Question Title */}
                <Heading
                    size="md"
                    className="text-typography-900 mb-2 font-semibold line-clamp-2"
                >
                    {post.title}
                </Heading>

                {/* Author and Time */}
                <Box className="flex-row items-center justify-between mb-3">
                    <Box className="flex-row items-center">
                        <Avatar size="xs">
                            <AvatarFallbackText>
                                {post.author?.slice(0, 2) ?? "?"}
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: post.author.avatar,
                                }}
                            />
                        </Avatar>
                        <Text className="text-typography-500 text-xs font-medium">
                            {"  "}
                            {post.author}
                        </Text>
                    </Box>
                    <Box className="flex-row items-center gap-1">
                        <Clock size={11} color={iconColor} />
                        <Text className="text-typography-400 text-xs">
                            {formatRelativeDate(
                                post.createdAt,
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
                                {post.likes}
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
                                {post.replies}
                            </Text>
                        </Box>
                    </Box>

                    {/* Tags */}
                    <Box className="flex-row items-center space-x-1 gap-1">
                        {post.tags
                            ?.slice(0, 2)
                            .map((tag: string, index: number) => (
                                <Box
                                    key={index}
                                    className="bg-secondary-100 px-2 py-1 rounded-full"
                                >
                                    <Text className="text-typography-600 text-xs">
                                        #{tag}
                                    </Text>
                                </Box>
                            ))}
                        {post.tags && post.tags.length > 2 && (
                            <Text className="text-typography-400 text-xs">
                                +{post.tags.length - 2}
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
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPostsWithReplies = async (): Promise<any[]> => {
        // Fetch posts with author username
        const { data, error } = await supabase
            .from("posts")
            .select(
                "post_id, title, type, tags, stats, created_at, profiles!posts_profile_id_profiles_profile_id_fk!inner(username)"
            )
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch reply counts for all posts
        const { data: replies, error: repliesError } = await supabase
            .from("replies")
            .select("post_id");

        if (repliesError) throw repliesError;

        // Count replies per post_id
        const replyCountMap: Record<number, number> = {};
        (replies || []).forEach((r) => {
            replyCountMap[r.post_id] = (replyCountMap[r.post_id] || 0) + 1;
        });

        // Adapt posts
        return (data || []).map((post: any) => ({
            ...post,
            author: post.profiles?.username ?? "익명",
            likes: post.stats?.likes ?? 0,
            replies: replyCountMap[post.post_id] || 0,
            createdAt: DateTime.fromISO(post.created_at),
            tags: post.tags ?? [],
        }));
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchPostsWithReplies()
            .then(setPosts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const posts = await fetchPostsWithReplies();
            setPosts(posts);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePostPress = (postId: number) => {
        router.push(`/community/${postId}`);
    };

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="flex-1 justify-center items-center">
                <Text>Error: {error}</Text>
            </Box>
        );
    }

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
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                    >
                        <Box className="mb-6">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.post_id}
                                    post={post}
                                    onPress={() =>
                                        handlePostPress(post.post_id)
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
