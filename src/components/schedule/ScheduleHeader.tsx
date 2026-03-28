import Button from "../common/Button";

interface ScheduleHeaderProps {
    schedules: string[];
    onRemoveSchedule: (name: string) => void;
    showFreeTime: boolean;
    onToggleFreeTime: () => void;
}

const colors = [
    "bg-green-100 text-green-950",
    "bg-red-100 text-red-950",
    "bg-blue-100 text-blue-950",
];

export default function ScheduleHeader({
    schedules,
    onRemoveSchedule,
    showFreeTime,
    onToggleFreeTime,
}: ScheduleHeaderProps) {
    return (
        <article className="flex w-full">
            {/* 시간표 목록 (예: 시간표 1, 시간표 2)*/}
            <ul className="flex gap-2 flex-1">
                {schedules.map((name, i) => (
                    <li
                        key={i}
                        className={`flex items-center px-3 bg-blue-100 text-blue-700 rounded-full text-xs font-bold gap-1 ${colors[i % colors.length]} before:content-['•']`}
                    >
                        <span className="text-sm">{name}</span>
                        <button
                            className="text-xs opacity-70 hover:opacity-100 cursor-pointer ml-1"
                            onClick={() => onRemoveSchedule(name)}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
            {/* 버튼 */}
            <nav className="flex">
                <Button
                    text={showFreeTime ? "공강 숨기기" : "공강 확인"}
                    buttonColor={showFreeTime ? "accent" : "green"}
                    onClick={onToggleFreeTime}
                />
            </nav>
        </article>
    );
}
