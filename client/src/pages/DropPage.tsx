/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowDown, ArrowLeft, Hand } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

interface DropPageProps {
    currentGesture: string | null;
    gestureConfidence: number;
}

const DropPage = ({ currentGesture, gestureConfidence }: DropPageProps) => {
    const [receivedImage, setReceivedImage] = useState<string | null>(null);
    const [isDropping, setIsDropping] = useState(false);
    const [hasDropped, setHasDropped] = useState(false);

    const RECEIVER_ID = 'user2';

    const lastDropTime = useRef(0);

    const handleDrop = async () => {
        if (isDropping || hasDropped) return;

        lastDropTime.current = Date.now();
        setIsDropping(true);

        try {
            const response = await fetch(
                `${config.API_URL}/drop/${RECEIVER_ID}`
            );
            const data = await response.json();

            if (data.success && data.imagePath) {
                console.log(`${config.API_URL}${data.imagePath}`);
                setTimeout(() => {
                    setReceivedImage(
                        `${config.API_URL}${data.imagePath}` as string
                    );
                    setIsDropping(false);
                    setHasDropped(true);
                }, 1000);
            } else {
                setTimeout(() => {
                    setIsDropping(false);
                }, 2000);
            }
        } catch (error) {
            console.error('Error during drop:', error);
            setTimeout(() => {
                setIsDropping(false);
            }, 2000);
        }
    };

    useEffect(() => {
        const timeSinceLastDrop = Date.now() - lastDropTime.current;
        if (
            currentGesture === 'drop' &&
            gestureConfidence > config.CONFIDENCE_THRESHOLD &&
            !isDropping &&
            !hasDropped &&
            !receivedImage &&
            timeSinceLastDrop > config.COOLDOWN
        ) {
            handleDrop();
        }
    }, [
        currentGesture,
        gestureConfidence,
        isDropping,
        hasDropped,
        receivedImage,
    ]);

    return (
        <div className='min-h-screen bg-linear-to-br from-green-50 to bg-emerald-100 flex flex-col items-center justify-center p-4'>
            {!receivedImage ? (
                <div className='rounded-2xl p-8 max-w-md w-full'>
                    {currentGesture === 'drop' ? (
                        <div className='flex items-center justify-center'>
                            <div className='w-48 h-48 rounded-full bg-cyan-200 animate-pulse shadow-2xl flex justify-center items-center'>
                                <div className='w-32 h-32 rounded-full bg-emerald-100 animate-pulse'></div>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full'>
                            <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                                Drop Zone
                            </h1>
                            <p className='text-gray-600 mb-6 text-center'>
                                Select an image, then make a{' '}
                                <strong>"DROP"</strong> gesture
                            </p>
                            <div className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-300 rounded-xl bg-green-50 mb-6'>
                                <ArrowDown className='h-16 w-16 text-green-400 mb-4' />
                                <span className='text-sm text-gray-600'>
                                    Waiting for drop gesture....
                                </span>
                            </div>
                            <Link
                                to='/'
                                className='mt-4 w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border border-indigo-200 hover:border-indigo-300 hover:shadow-sm'
                            >
                                <ArrowLeft className='w-4 h-4' />
                                <span>Go to Grab Zone</span>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className='relative w-full h-screen'>
                    {isDropping && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black z-10'>
                            <div className='animate-ping absolute w-32 h-32 rounded-full bg-white opacity-75'></div>
                            <div className='animate-pulse absolute w-64 h-64 rounded-full bg-white opacity-50'></div>
                            <div className='animate-bounce absolute w-96 h-96 rounded-full bg-white'></div>
                        </div>
                    )}

                    <img
                        src={receivedImage}
                        alt='Received'
                        className='w-full h-full object-contain'
                    />

                    {/* Gesture Status Indicator */}
                    <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2'>
                        <div
                            className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${
                                hasDropped
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/90 text-gray-700'
                            }`}
                        >
                            <Hand className='w-5 h-5' />
                            <span className='text-sm font-medium'>
                                {hasDropped ? 'Image received!' : 'Waiting...'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropPage;
