// Classification result from ML5 image classifier
export interface ClassificationResult {
    label: string;
    confidence: number;
}

// ML5 Image Classifier interface
export interface ML5Classifier {
    classify: (
        input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
        callback: (results: ClassificationResult[], error?: Error) => void
    ) => void;
}

// ML5 library interface
export interface ML5 {
    imageClassifier: (
        modelUrl: string,
        callback?: () => void
    ) => Promise<ML5Classifier>;
}

// Props interfaces
export interface GestureDetectorProps {
    onGesture: (label: string, confidence: number) => void;
}

export interface PageProps {
    currentGesture: string | null;
    gestureConfidence: number;
}

declare global {
    interface Window {
        ml5: ML5;
    }
}

export {};
