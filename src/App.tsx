import { useState } from "react";
import Button from "./components/Button";

function App() {
    // 업로드된 시간표 파일들을 관리할 상태
    const [schedules, setSchedules] = useState<File[]>([]);

    // 파일 업로드 핸들러 (임시)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSchedules((prev) => [...prev, ...filesArray]);
        }
    };

    console.log(schedules);

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <header className="p-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex flex-row justify-between items-start gap-4">
                    <h1>너 시간 돼?</h1>
                    <nav className="flex gap-2 w-auto">
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <Button text="+ 시간표 넣기" htmlFor="file-upload" />
                        <Button text="PNG 다운로드" />
                        <Button text="PDF 저장" />
                    </nav>
                </div>

                <div className="flex flex-row justify-between items-start gap-4">
                    <ul className="flex flex-wrap gap-2">
                        {schedules.length === 0 ? (
                            <li className="text-sm text-disabled">
                                아직 업로드된 시간표가 없습니다.
                            </li>
                        ) : (
                            schedules.map((file, index) => (
                                <li
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-primary rounded-full text-xs font-bold"
                                >
                                    {file.name}
                                </li>
                            ))
                        )}
                    </ul>
                    <Button text="모두가 겹치는 공강 찾기" />
                </div>
            </header>
            <main className="p-4 sm:p-6 overflow-auto">
                <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">
                    시간표 이미지를 업로드하면 이곳에 통합 시간표가 나타납니다.
                </div>
            </main>
            <footer className="text-center p-4 text-xs text-gray-400">
                © 2026 ARE-YOU-FREE. All rights reserved.
            </footer>
        </div>
    );
}

export default App;
