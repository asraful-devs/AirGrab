import { useEffect, useRef, useState } from 'react';
import config from '../config';
import type {
    ClassificationResult,
    GestureDetectorProps,
    ML5Classifier,
} from '../types/index.global';

const GestureDetector = ({ onGesture }: GestureDetectorProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoStarted, setIsVideoStarted] = useState<boolean>(false);
    const [classifier, setClassifier] = useState<ML5Classifier | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedClassifier = await window.ml5.imageClassifier(
                    config.MODEL_URL,
                    () => {
                        console.log('Gesture model loaded');
                    }
                );
                setClassifier(loadedClassifier);
            } catch (error) {
                console.error('Model loading failed: ', error);
            }
        };

        loadModel();
    }, []);

    const classifyGesture = (): void => {
        if (classifier && videoRef.current) {
            classifier.classify(
                videoRef.current,
                (results: ClassificationResult[], error?: Error) => {
                    if (error) {
                        console.error('Classification error: ', error);
                        return;
                    }
                    if (results && results[0]) {
                        onGesture(results[0].label, results[0].confidence);
                    }

                    setTimeout(() => classifyGesture(), 30);
                }
            );
        } else {
            setTimeout(() => classifyGesture(), 30);
        }
    };

    const startVideo = async () => {
        if (
            navigator.mediaDevices &&
            (await navigator.mediaDevices.getUserMedia())
        ) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;

                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                            setIsVideoStarted(true);
                            classifyGesture();
                        };
                    }
                })
                .catch((error) => {
                    console.error('Camera access denied: ', error);
                });
        }
    };

    useEffect(() => {
        if (classifier && !isVideoStarted) {
            startVideo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classifier]);

    return (
        <div>
            {' '}
            <video
                ref={videoRef}
                width={640}
                height={480}
                style={{ display: 'none' }}
                autoPlay
                muted
            />
        </div>
    );
};

export default GestureDetector;
