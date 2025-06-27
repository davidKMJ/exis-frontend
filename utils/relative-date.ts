import { DateTime } from "luxon";

export type Locale = "en" | "ko";

export function formatRelativeDate(
    date: DateTime,
    locale: "en" | "ko" = "en"
): string {
    const now = DateTime.now();
    const diff = now
        .diff(date, ["years", "months", "days", "hours", "minutes", "seconds"])
        .toObject();

    const rtf: Record<string, {
        year: string;
        month: string;
        day: string;
        hour: string;
        minute: string;
        second: string;
        ago: string;
        justNow: string;
        plural: string;
    }> = {
        en: {
            year: "year",
            month: "month",
            day: "day",
            hour: "hour",
            minute: "minute",
            second: "second",
            ago: "ago",
            justNow: "just now",
            plural: "s",
        },
        ko: {
            year: "년",
            month: "개월",
            day: "일",
            hour: "시간",
            minute: "분",
            second: "초",
            ago: "전",
            justNow: "방금 전",
            plural: "",
        },
    };

    const lang = rtf[locale];

    if (diff.years && diff.years >= 1) {
        const n = Math.floor(diff.years);
        return locale === "en"
            ? `${n} ${lang.year}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.year} ${lang.ago}`;
    }
    if (diff.months && diff.months >= 1) {
        const n = Math.floor(diff.months);
        return locale === "en"
            ? `${n} ${lang.month}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.month} ${lang.ago}`;
    }
    if (diff.days && diff.days >= 1) {
        const n = Math.floor(diff.days);
        return locale === "en"
            ? `${n} ${lang.day}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.day} ${lang.ago}`;
    }
    if (diff.hours && diff.hours >= 1) {
        const n = Math.floor(diff.hours);
        return locale === "en"
            ? `${n} ${lang.hour}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.hour} ${lang.ago}`;
    }
    if (diff.minutes && diff.minutes >= 1) {
        const n = Math.floor(diff.minutes);
        return locale === "en"
            ? `${n} ${lang.minute}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.minute} ${lang.ago}`;
    }
    if (diff.seconds && diff.seconds >= 5) {
        const n = Math.floor(diff.seconds);
        return locale === "en"
            ? `${n} ${lang.second}${n > 1 ? lang.plural : ""} ${lang.ago}`
            : `${n}${lang.second} ${lang.ago}`;
    }
    return lang.justNow;
}
