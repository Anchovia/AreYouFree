import { FiImage, FiUpload } from "react-icons/fi";
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
        <section className="flex flex-col bg-white rounded-3xl shadow-lg p-6">
            {/* 시간표 표시 부분 */}
            {parsedClasses.length > 0 ? (
                <Timetable
                    classes={parsedClasses}
                    showFreeTime={showFreeTime}
                />
            ) : (
                <article className="h-150 flex flex-col gap-4 items-center justify-center">
                    <FiUpload className="size-16 p-3 text-gray-500 bg-gray-200 rounded-2xl" />
                    <div className="text-center">
                        <p className="text-lg font-bold">
                            시간표 이미지를 드래그하세요
                        </p>
                        <p className="text-base text-gray-400">
                            또는 클릭하여 파일 선택
                        </p>
                    </div>
                    <span className="flex gap-2 items-center text-gray-400">
                        <FiImage />
                        <p className="text-sm">PNG, JPG 지원</p>
                    </span>
                </article>
            )}
        </section>
    );
}
