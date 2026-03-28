export const timeStringToNumber = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
};
