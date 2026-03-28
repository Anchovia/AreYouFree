import { forwardRef, useRef, useState } from "react";

interface EverytimeImageImportModalProps {
    existingSchedules: string[];
    onImport: (file: File, startHour: number, scheduleName: string) => void;
}

const EverytimeImageImportModal = forwardRef<
    HTMLDialogElement,
    EverytimeImageImportModalProps
>(({ existingSchedules, onImport }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [startHour, setStartHour] = useState<number>(9);
    // 1. 이름 입력을 위한 상태 추가
    const [scheduleName, setScheduleName] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. 파일 타입 검사
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        // 2. 이미지 크기 검사를 위해 임시 객체 생성
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();

        // 3. 이미지가 로드되었을 때 사이즈를 체크합니다 (비동기 처리)
        img.onload = () => {
            URL.revokeObjectURL(imageUrl); // 메모리 해제

            // 가로 사이즈가 딱 960px인지 확인!
            if (img.naturalWidth !== 960) {
                alert(
                    `에브리타임 정규 스크린샷 규격이 아닙니다.\n(가로 960px 이미지만 가능, 현재: ${img.naturalWidth}px)`
                );

                // 에러 시 input 요소 초기화 및 파일 선택 해제
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedFile(null);
                return;
            }

            // ✨ 960px 검사를 무사히 통과했을 때만 파일 상태를 저장합니다!
            setSelectedFile(file);

            // 이름 자동 완성
            if (!scheduleName) setScheduleName(file.name.split(".")[0]);
        };

        // 이미지 읽기 실패 시 예외 처리
        img.onerror = () => {
            URL.revokeObjectURL(imageUrl);
            alert("이미지 파일을 읽는 중 오류가 발생했습니다.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            setSelectedFile(null);
        };

        // 4. src를 넣어주면 이때부터 브라우저가 사이즈 체크를 시작합니다
        img.src = imageUrl;
    };

    const resetState = () => {
        setSelectedFile(null);
        setStartHour(9);
        setScheduleName(""); // 초기화
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImportClick = () => {
        if (!selectedFile) {
            alert("이미지 파일을 먼저 선택해주세요.");
            return;
        }
        if (!scheduleName.trim()) {
            alert("시간표 이름(친구 이름)을 입력해주세요.");
            return;
        }

        // 2. 전달할 때 이름도 같이 넘김
        onImport(selectedFile, startHour, scheduleName.trim());
        resetState();

        const trimmedName = scheduleName.trim();
        if (!trimmedName) {
            alert("시간표 이름(친구 이름)을 입력해주세요.");
            return;
        }

        // 🚨 3. 중복 검사 핵심 로직 추가!
        if (existingSchedules.includes(trimmedName)) {
            alert("이미 존재하는 이름입니다. 다른 이름을 입력해주세요!");
            return; // 튕겨내고 함수 종료! (모달 안 닫힘)
        }
    };

    const handleCloseClick = () => {
        resetState();
        if (ref && "current" in ref) {
            ref.current?.close();
        }
    };

    return (
        <dialog
            ref={ref}
            className="w-full max-w-md p-6 m-auto bg-white shadow-xl rounded-2xl backdrop:bg-black/50 open:animate-in open:fade-in open:zoom-in-95"
        >
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        이미지 시간표 추가하기
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        에브리타임에서 저장한 시간표 이미지를 올려주세요.
                    </p>
                </div>

                {/* --- 새로 추가된 시간표 이름 입력 영역 --- */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                        시간표 이름 (친구 이름)
                    </label>
                    <input
                        type="text"
                        placeholder="예) 홍길동, 1학기 최종"
                        className="w-full p-3 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={scheduleName}
                        onChange={(e) => setScheduleName(e.target.value)}
                    />
                </div>

                {/* --- 1. 파일 업로드 영역 --- */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                        시간표 이미지
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        id="modal-image-upload"
                    />
                    <label
                        htmlFor="modal-image-upload"
                        className="flex flex-col items-center justify-center p-6 text-sm text-gray-500 transition-colors border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100"
                    >
                        {selectedFile ? (
                            <span className="font-bold text-blue-600 truncate max-w-50">
                                {selectedFile.name}
                            </span>
                        ) : (
                            <span>클릭하여 이미지 파일 선택</span>
                        )}
                    </label>
                </div>

                {/* --- 2. 시작 시간 선택 영역 --- */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">
                        시간표 시작 시간
                    </label>
                    <div className="flex gap-2">
                        {[7, 8, 9, 10, 11, 12].map((hour) => (
                            <button
                                key={hour}
                                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                                    startHour === hour
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                                onClick={() => setStartHour(hour)}
                            >
                                {hour}시
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- 3. 버튼 영역 --- */}
                <div className="flex gap-2 mt-2">
                    <button
                        className="flex-1 py-3 font-bold bg-gray-100 rounded-xl"
                        onClick={handleCloseClick}
                    >
                        취소
                    </button>
                    <button
                        className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleImportClick}
                        // 이름과 파일이 모두 있어야 버튼 활성화
                        disabled={!selectedFile || !scheduleName.trim()}
                    >
                        분석 및 추가
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default EverytimeImageImportModal;
