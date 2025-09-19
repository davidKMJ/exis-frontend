import React, { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

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
    post,
    replies,
}: {
    post: any;
    replies: any[];
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
                                {post.author?.slice(0, 2) ?? "?"}
                            </AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: post.author.avatar,
                                }}
                            />
                        </Avatar>
                        <Box className="ml-3">
                            <Text className="text-typography-900 font-semibold text-base">
                                {post.author}
                            </Text>
                            <Box className="flex-row items-center mt-1">
                                <Clock size={13} color={iconColor} />
                                <Text className="text-typography-500 text-xs ml-1">
                                    {formatRelativeDate(
                                        post.createdAt,
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
                        {post.title}
                    </Heading>

                    {/* Tags */}
                    <Box className="flex-row items-center mb-4 flex-wrap gap-2">
                        {post.tags?.map((tag: string, idx: number) => (
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
                            {post.content}
                        </Text>
                    </Box>

                    {/* Stats Row */}
                    <Box className="flex-row items-center mb-6 gap-6">
                        <Box className="flex-row items-center">
                            <Heart size={20} color={iconColor} />
                            <Text className="ml-1 text-typography-700 font-semibold text-lg">
                                {post.likes}
                            </Text>
                        </Box>
                        <Box className="flex-row items-center">
                            <MessageCircle size={20} color={iconColor} />
                            <Text className="ml-1 text-typography-700 font-semibold text-lg">
                                {replies.length}
                            </Text>
                        </Box>
                    </Box>

                    {/* AI Response Section (untouched) */}
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
                                <Box
                                    className="w-full h-full shadow-[1px_1px_1px_rgba(0,0,0,0.05)] shadow-cyan-400 bg-background-0 rounded-2xl p-4 flex-row items-start"
                                    style={{ zIndex: 2 }}
                                >
                                    <Box className="mr-3 mt-1">
                                        <Bot size={28} color={iconColor} />
                                    </Box>
                                    <Box className="flex-1">
                                        <Text className="text-primary-900 font-semibold mb-1">
                                            AI의 답변
                                        </Text>
                                        <Text className="text-primary-900 text-base leading-relaxed">
                                            {/* AI response left untouched intentionally */}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {replies.map((reply) => (
                            <Box
                                key={reply.reply_id}
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
                        {replies.length === 0 && (
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
    const [post, setPost] = useState<any | null>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        const fetchData = async () => {
            try {
                // Fetch post with author
                const { data: posts, error: postError } = await supabase
                    .from("posts")
                    .select(
                        "post_id, title, content, tags, stats, created_at, profiles!posts_profile_id_profiles_profile_id_fk!inner(username)"
                    )
                    .eq("post_id", id)
                    .limit(1);
                if (postError) throw postError;
                const post = posts && posts[0];
                if (!post) throw new Error("Not found");
                // Fix: handle profiles as array or object
                let author = "익명";
                if (post.profiles) {
                    if (Array.isArray(post.profiles)) {
                        author =
                            (post.profiles as any[])[0]?.username ?? "익명";
                    } else {
                        author = (post.profiles as any).username ?? "익명";
                    }
                }
                const adaptedPost = {
                    ...post,
                    author,
                    likes: post.stats?.likes ?? 0,
                    createdAt: DateTime.fromISO(post.created_at),
                    tags: post.tags ?? [],
                };
                setPost(adaptedPost);

                // Fetch replies with author
                const { data: repliesData, error: repliesError } =
                    await supabase
                        .from("replies")
                        .select(
                            "reply_id, content, created_at, profiles!replies_profile_id_profiles_profile_id_fk!inner(username)"
                        )
                        .eq("post_id", id)
                        .order("created_at", { ascending: true });
                if (repliesError) throw repliesError;
                const adaptedReplies = (repliesData || []).map((reply: any) => {
                    let author = "익명";
                    if (reply.profiles) {
                        if (Array.isArray(reply.profiles)) {
                            author =
                                (reply.profiles as any[])[0]?.username ??
                                "익명";
                        } else {
                            author = (reply.profiles as any).username ?? "익명";
                        }
                    }
                    return {
                        ...reply,
                        author,
                        createdAt: DateTime.fromISO(reply.created_at),
                    };
                });
                setReplies(adaptedReplies);
            } catch (err: any) {
                setError(err.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-background-0">
                <Text>Loading...</Text>
            </Box>
        );
    }
    if (error || !post) {
        return <CommunityDetailError />;
    }
    return <CommunityDetailSuccess post={post} replies={replies} />;
}
