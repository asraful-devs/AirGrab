import { useEffect, useRef, useState } from 'react';
import config from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Classifier = any;

interface GestureDetectorProps {
    onGesture: (label: string, confidence: number) => void;
}

const GestureDetector = ({ onGesture }: GestureDetectorProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoStarted, setIsVideoStarted] = useState(false);
    const [classifier, setClassifier] = useState<Classifier | null>(null);

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

    const classifyGesture = () => {
        if (classifier && videoRef.current) {
            classifier.classify(
                videoRef.current,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (results: any[], error: Error) => {
                    if (error) {
                        console.error('Classification error: ', error);
                        return;
                    }
                    //console.log(results)
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
