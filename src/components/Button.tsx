interface ButtonProps {
    htmlFor?: string;
    text: string;
}

export default function Button({ htmlFor, text }: ButtonProps) {
    return htmlFor ? (
        <label
            htmlFor={htmlFor}
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold cursor-pointer transition-colors"
        >
            {text}
        </label>
    ) : (
        <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors">
            {text}
        </button>
    );
}
