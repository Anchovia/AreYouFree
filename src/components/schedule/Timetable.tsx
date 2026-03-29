import { useMemo } from "react";
import type { ClassInfo } from "../../types/schedule";

interface TimetableProps {
    classes: ClassInfo[];
    showFreeTime: boolean;
}

// 요청하신 사진(2번째)의 파스텔 톤 헥스 색상을 적용했습니다.
const FRIEND_COLORS_HEX = [
    "#dbeafe", // 파랑 (blue-100)
    "#fce7f3", // 분홍 (pink-100)
    "#dcfce7", // 초록 (green-100)
    "#fef3c7", // 노랑 (yellow-100)
    "#f3e8ff", // 보라 (purple-100)
];

const ALL_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function Timetable({ classes, showFreeTime }: TimetableProps) {
    const startHour = 7;
    const endHour = 23;
    const hours = Array.from(
        { length: endHour - startHour + 1 },
        (_, i) => i + startHour
    );
    const hourHeight = 60;

    // 1. 최대 요일(day) 값을 찾아 표시할 요일의 개수를 결정합니다.
    const maxDay = useMemo(() => {
        return classes.reduce((max, c) => Math.max(max, c.day), 4);
    }, [classes]);

    const displayDays = ALL_DAYS.slice(0, Math.min(maxDay + 1, 7));
    const numCols = displayDays.length;

    // 친구(인원) 기준 고유 목록
    const uniqueFriends = useMemo(() => {
        return Array.from(new Set(classes.map((c) => c.fId)));
    }, [classes]);

    const getFriendColorHex = (fId: string) => {
        const index = uniqueFriends.indexOf(fId);
        return FRIEND_COLORS_HEX[index % FRIEND_COLORS_HEX.length];
    };

    const formatTimeText = (time: number) => {
        const h = Math.floor(time);
        const m = Math.round((time - h) * 60);
        return m === 0 ? `${h}시` : `${h}시 ${m}분`;
    };

    const renderFreeTimeOverlays = (dayIdx: number) => {
        if (!showFreeTime || uniqueFriends.length === 0) return null;

        const dayClasses = classes
            .filter((c) => c.day === dayIdx)
            .sort((a, b) => a.start - b.start);

        const freeBlocks: { start: number; end: number }[] = [];
        let currentTime = startHour;

        for (const c of dayClasses) {
            if (currentTime < c.start) {
                freeBlocks.push({ start: currentTime, end: c.start });
            }
            currentTime = Math.max(currentTime, c.end);
        }

        if (currentTime < endHour) {
            freeBlocks.push({ start: currentTime, end: endHour });
        }

        return freeBlocks
            .filter((block) => block.end - block.start >= 1)
            .map((block, idx) => (
                <div
                    key={`free-${idx}`}
                    className="absolute z-10 rounded-md border border-green-300/60 bg-green-100/40 flex flex-col items-center justify-center pointer-events-none"
                    style={{
                        top: `${(block.start - startHour) * hourHeight}px`,
                        height: `${(block.end - block.start) * hourHeight}px`,
                        left: "4px",
                        right: "4px",
                    }}
                >
                    <div className="bg-background/80 px-2 py-1 rounded-md text-center shadow-sm backdrop-blur-sm">
                        <span className="block text-green-700 font-bold text-xs">
                            {formatTimeText(block.start)} ~{" "}
                            {formatTimeText(block.end)}
                        </span>
                    </div>
                </div>
            ));
    };

    return (
        <div id="timetable-capture-area" className="flex-1 overflow-auto p-4">
            <div className="bg-card rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* 헤더 행 (시간 + 요일) */}
                <div
                    className="grid border-b border-gray-200 bg-gray-50"
                    style={{
                        gridTemplateColumns: `60px repeat(${numCols}, minmax(0, 1fr))`,
                    }}
                >
                    <div className="p-3 text-center text-xs font-medium text-muted-foreground">
                        시간
                    </div>
                    {displayDays.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-sm font-semibold text-foreground border-l border-gray-200"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 본문 행 */}
                <div
                    className="grid"
                    style={{
                        gridTemplateColumns: `60px repeat(${numCols}, minmax(0, 1fr))`,
                    }}
                >
                    {/* Y축 (시간) */}
                    <div className="border-r border-gray-200 bg-card">
                        {hours.slice(0, -1).map((h) => (
                            <div
                                key={h}
                                className="h-15 flex items-start justify-center pt-1 text-xs text-muted-foreground border-b border-gray-200"
                            >
                                {h}:00
                            </div>
                        ))}
                    </div>

                    {/* X축 (요일별 컬럼) */}
                    {displayDays.map((_, dIdx) => (
                        <div
                            key={`col-${dIdx}`}
                            className="relative border-l border-gray-200 border-r-0"
                        >
                            {/* 배경 그리드 선 */}
                            {hours.slice(0, -1).map((_, i) => (
                                <div
                                    key={`grid-${i}`}
                                    className="h-15 border-b border-gray-200"
                                ></div>
                            ))}

                            {/* 공강 시간 렌더링 */}
                            {renderFreeTimeOverlays(dIdx)}

                            {/* 수업 블록 렌더링 (★수정된 부분★) */}
                            {classes
                                .filter((c) => c.day === dIdx)
                                .map((c, i) => {
                                    // 너비 분할 계산 로직(`widthPercent`, `fIndex`)을 모두 제거했습니다.
                                    // DOM 순서대로 알아서 포개집니다.

                                    return (
                                        <div
                                            key={`${c.fId}-${i}`}
                                            // className에 `absolute`, `z-10`, `rounded-lg` 등을 유지.
                                            // `hover:z-20`과 `hover:shadow-lg`를 넣어 아래에 깔린 요소를 마우스 오버 시 위로 올리게 처리했습니다.
                                            className=" absolute rounded-lg px-2 py-1.5 overflow-hidden shadow-sm border border-transparent hover:border-primary/30 transition-all cursor-default group z-10 hover:z-20 hover:shadow-lg"
                                            style={{
                                                top: `${(c.start - startHour) * hourHeight}px`,
                                                height: `${(c.end - c.start) * hourHeight}px`,
                                                // ★변경★ 너비를 꽉 채우고(양 옆에 작은 여백) 계산식 제거
                                                left: "4px",
                                                right: "4px",
                                                backgroundColor:
                                                    getFriendColorHex(c.fId),
                                            }}
                                            title={`[${c.fId}]`}
                                        >
                                            <div className="text-xs font-medium text-foreground/80 truncate">
                                                {c.fId}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
