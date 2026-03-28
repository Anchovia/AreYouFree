import type { ImageClassInfo } from "../types/schedule";
import {
    createImageClassInfo,
    detectDarkMode,
    detectDayWidthFromOffset,
    detectHorizontalBorderThickness,
    detectHourHeightFromOffset,
    detectOffsetXFromTopLeft,
    detectOffsetYFromTopLeft,
    detectVerticalBorderThickness,
    getPixelRgb,
    isBackgroundOrBorder,
} from "./utils";

// 에브리타임 시간표 이미지에서 수업 블록을 읽어 시간 정보로 변환
export const analyzeEverytimeImage = (
    image: HTMLImageElement,
    startHour: number,
    startDay: number
): ImageClassInfo[] | null => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);

    // 이미지 전체 픽셀을 한 번에 가져와 스캔 비용 최소화
    const imageData = ctx.getImageData(0, 0, width, height).data;
    // 다크모드 분석
    const isDarkMode = detectDarkMode(imageData, width);
    // 좌측 시간축 너비 (월요일 시작점)
    const OFFSET_X = detectOffsetXFromTopLeft(
        imageData,
        width,
        isDarkMode,
        5,
        5
    );
    // 현재 캡처 포맷 기준 레이아웃 상수
    const OFFSET_Y = detectOffsetYFromTopLeft(
        imageData,
        width,
        height,
        isDarkMode,
        5,
        5
    );

    // 수직 보더 넓이
    const VerticalBorderThickness = detectVerticalBorderThickness(
        imageData,
        width,
        isDarkMode,
        OFFSET_X
    );
    // 수평 보더 넓이
    const HorizontalBorderThickness = detectHorizontalBorderThickness(
        imageData,
        width,
        height,
        isDarkMode,
        OFFSET_Y
    );

    console.log("측정된 세로 선 두께:", VerticalBorderThickness);
    console.log("측정된 가로 선 두께:", HorizontalBorderThickness);

    // 요일별 가로 너비
    const DAY_WIDTH = detectDayWidthFromOffset(
        imageData,
        width,
        isDarkMode,
        OFFSET_X,
        VerticalBorderThickness
    );
    // 1시간당 세로 높이
    const HOUR_HEIGHT = detectHourHeightFromOffset(
        imageData,
        width,
        height,
        isDarkMode,
        OFFSET_Y,
        HorizontalBorderThickness
    );

    const results: ImageClassInfo[] = [];

    // 월(0) ~ 금(4) 각 열을 세로 스캔
    for (let day = 0; day < startDay; day++) {
        const scanX = Math.floor(OFFSET_X + day * DAY_WIDTH + DAY_WIDTH * 0.95);

        let isClassOngoing = false;
        let classStartPixelY = 0;
        let currentColor = "";

        for (let y = OFFSET_Y; y < height; y++) {
            // 현재 스캔 좌표의 픽셀 RGB 값을 가져옴
            const { r, g, b } = getPixelRgb(imageData, width, scanX, y);
            // 현재 픽셀이 배경/보더인지(수업 블록이 아닌지) 판별
            const isBgOrBorder = isBackgroundOrBorder(r, g, b, isDarkMode);

            if (!isBgOrBorder) {
                // 배경이 아닌 첫 픽셀을 수업 시작점으로 기록
                if (!isClassOngoing) {
                    isClassOngoing = true;
                    classStartPixelY = y;
                    currentColor = `rgb(${r},${g},${b})`;
                }
            } else if (isClassOngoing) {
                // 다시 배경을 만나면 수업 종료
                isClassOngoing = false;
                const classEndPixelY = y;
                results.push(
                    createImageClassInfo(
                        day,
                        classStartPixelY,
                        classEndPixelY,
                        OFFSET_Y,
                        HOUR_HEIGHT,
                        startHour,
                        currentColor
                    )
                );
            }
        }

        // 이미지 하단에서 수업이 끝나는 케이스 보정
        if (isClassOngoing) {
            const classEndPixelY = height;
            results.push(
                createImageClassInfo(
                    day,
                    classStartPixelY,
                    classEndPixelY,
                    OFFSET_Y,
                    HOUR_HEIGHT,
                    startHour,
                    currentColor
                )
            );
        }
    }

    // 디버그 로그
    console.group("에브리타임 이미지 분석 결과");
    console.log(
        `감지된 테마: ${isDarkMode ? "다크 모드 🌙" : "라이트 모드 ☀️"}`
    );
    console.log(
        `최좌측 최상단 Grid 오른쪽 보더 시작점(OFFSET_X): ${OFFSET_X}px`
    );
    console.log(`최좌측 최상단 Grid 하단 보더 시작점(OFFSET_Y): ${OFFSET_Y}px`);
    console.log(`사용된 1시간 기준 넓이(DAY_WIDTH): ${DAY_WIDTH}px`);
    console.log(`사용된 1시간 기준 높이(HOUR_HEIGHT): ${HOUR_HEIGHT}px`);
    console.log(results);
    console.groupEnd();

    return results;
};
