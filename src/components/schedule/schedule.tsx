import type { ClassInfo } from "../../types/schedule";
import ScheduleHeader from "./ScheduleHeader";
import Timetable from "./Timetable";

interface ScheduleProps {
    schedules: string[];
    parsedClasses: ClassInfo[];
    showFreeTime: boolean;
    setShowFreeTime: React.Dispatch<React.SetStateAction<boolean>>;
    onRemoveSchedule: (name: string) => void;
}

export default function Schedule({
    schedules,
    parsedClasses,
    showFreeTime,
    setShowFreeTime,
    onRemoveSchedule,
}: ScheduleProps) {
    return (
        <section className="flex flex-col gap-4 bg-white rounded-3xl shadow-lg min-h-175 p-6 max-w-10/12 mx-auto">
            <ScheduleHeader
                schedules={schedules}
                onRemoveSchedule={onRemoveSchedule}
                showFreeTime={showFreeTime}
                onToggleFreeTime={() => setShowFreeTime((prev) => !prev)}
            />
            {/* 시간표 표시 부분 */}
            {parsedClasses.length > 0 ? (
                <Timetable
                    classes={parsedClasses}
                    showFreeTime={showFreeTime}
                />
            ) : (
                <article className="h-150 flex flex-col items-center justify-center">
                    <h2>에타 웹에서 공유받은 시간표 이미지를 붙여주세요!</h2>
                </article>
            )}
        </section>
    );
}
