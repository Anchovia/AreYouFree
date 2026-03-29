import type { ClassInfo } from "../../types/schedule";
import Timetable from "./Timetable";

interface ScheduleProps {
    parsedClasses: ClassInfo[];
    showFreeTime: boolean;
}

export default function Schedule({
    parsedClasses,
    showFreeTime,
}: ScheduleProps) {
    return (
        <section className="flex flex-col bg-white rounded-3xl shadow-lg min-h-175 p-6">
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
