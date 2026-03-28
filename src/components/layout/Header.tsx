import Button from "../common/Button";

interface HeaderProps {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    onReset: () => void; // 부모로부터 받을 초기화 함수
}

export default function Header({ dialogRef, onReset }: HeaderProps) {
    return (
        <header className="p-4 border-b bg-white flex justify-between items-center border-white shadow-sm ">
            <h1>너 시간 돼?</h1>
            <nav className="flex gap-4">
                <Button
                    text="모든 데이터 초기화"
                    type="button"
                    buttonColor="accent"
                    onClick={onReset}
                />
                <Button
                    text="시간표 추가하기"
                    onClick={() => dialogRef.current?.showModal()}
                />
            </nav>
        </header>
    );
}
