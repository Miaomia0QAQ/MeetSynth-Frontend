declare global {
    interface Window {
        RecorderManager: new (path: string) => {
            start: (config: {
                sampleRate: number;
                frameSize: number;
            }) => void;
            stop: () => void;
            onStart: () => void;
            onStop: (buffers: ArrayBuffer[]) => void;
            onFrameRecorded: (callback: (data: {
                isLastFrame: boolean;
                frameBuffer: ArrayBuffer;
            }) => void) => void;
        };
    }
}

export { }; // 确保文件作为模块