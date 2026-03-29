import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { FiImage, FiUpload, FiUsers } from "react-icons/fi";
import Button from "../common/Button";

interface ScheduleHeaderProps {
    schedules: string[];
    onRemoveSchedule: (name: string) => void;
    showFreeTime: boolean;
    onToggleFreeTime: () => void;
    dialogRef: React.RefObject<HTMLDialogElement | null>;
}

const colors = ["border-l-purple-200", "border-l-red-100", "border-l-blue-100"];

export default function ScheduleHeader({
    schedules,
    onRemoveSchedule,
    showFreeTime,
    onToggleFreeTime,
    dialogRef,
}: ScheduleHeaderProps) {
    const [openUpload, setOpenUpload] = useState(false);
    return (
        <section className="flex flex-col w-full gap-6">
            <div className="flex w-full items-center">
                {/* 시간표 목록 (예: 시간표 1, 시간표 2)*/}
                <article className="flex gap-2 flex-1 items-center">
                    <span className="text-sm flex items-center gap-2 text-gray-500 font-normal">
                        <FiUsers />
                        {`${schedules.length} 명`}
                    </span>
                    <ul className="flex gap-2 flex-1">
                        {schedules.map((name, i) => (
                            <li
                                key={i}
                                className={`flex items-center px-3 py-1 rounded-full  font-medium gap-1 border-l-5  ${colors[i % colors.length]} border border-gray-300`}
                            >
                                <FaEdit className="text-gray-600 text-xs" />
                                <span className="text-gray-600 text-sm">
                                    {name}
                                </span>
                                <button
                                    className="text-gray-600 text-xs cursor-pointer ml-1"
                                    onClick={() => onRemoveSchedule(name)}
                                >
                                    <FaTimes />
                                </button>
                            </li>
                        ))}
                    </ul>
                </article>
                {/* 버튼 */}
                <nav className="flex gap-3">
                    <Button
                        text="시간표 추가"
                        buttonColor="gray"
                        buttonType="add"
                        onClick={() => setOpenUpload(!openUpload)}
                    />
                    <Button
                        text={showFreeTime ? "공강 숨기기" : "공강 보기"}
                        buttonColor={showFreeTime ? "red" : "green"}
                        buttonType="vision"
                        onClick={onToggleFreeTime}
                    />
                </nav>
            </div>
            {openUpload && (
                <label
                    onClick={() => dialogRef.current?.showModal()}
                    className="flex flex-col gap-3 items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-2xl"
                >
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
                </label>
            )}
        </section>
    );
}
