import { FiEye, FiPlus, FiTrash } from "react-icons/fi";

type ButtonColor = "default" | "red" | "green" | "gray";
type ButtonType = "delete" | "add" | "vision";

interface ButtonProps {
    htmlFor?: string;
    text: string;
    buttonColor?: ButtonColor;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    buttonType?: ButtonType;
}

// variant 별로 적용될 Tailwind 클래스 맵핑
const buttonStyles: Record<ButtonColor, string> = {
    default: "border-blue-300 text-blue-700",
    red: "border-red-300 text-red-600",
    green: "border-lime-400 text-lime-700",
    gray: "border-gray-300 text-gray-700",
};

export default function Button({
    htmlFor,
    text,
    onClick,
    buttonColor = "default",
    type = "button",
    buttonType = "add",
}: ButtonProps) {
    const commonStyle =
        "flex items-center gap-2 flex-1 flex-none text-center px-3 py-1.5 rounded-lg text-base font-bold cursor-pointer border transition-colors";
    return htmlFor ? (
        <label
            htmlFor={htmlFor}
            className={`${buttonStyles[buttonColor]} ${commonStyle}`}
        >
            {text}
        </label>
    ) : (
        <button
            type={type}
            onClick={onClick}
            className={`${buttonStyles[buttonColor]} ${commonStyle}`}
        >
            {buttonType === "delete" && <FiTrash />}
            {buttonType === "vision" && <FiEye />}
            {buttonType === "add" && <FiPlus />}
            {text}
        </button>
    );
}
