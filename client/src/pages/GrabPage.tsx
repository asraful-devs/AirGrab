import { Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import config from '../config';

const GrabPage = ({
    currentGesture,
    gestureConfidence,
}: {
    currentGesture: string;
    gestureConfidence: number;
}) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [hasGrabbed, setHasGrabbed] = useState(false);

    const USER_ID = uuid();

    const lastGrabTime = useRef(0);
    const hasCalledGrab = useRef(false);

    const handleGrab = useCallback(async () => {
        if (!selectedImage || isGrabbing) return;

        lastGrabTime.current = Date.now();
        setIsGrabbing(true);

        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('userId', USER_ID);

        try {
            const response = await fetch(`${config.API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setHasGrabbed(true);
                setTimeout(() => {
                    setIsGrabbing(false);
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setIsGrabbing(false);
            setHasGrabbed(false);
        }
    }, [selectedImage, isGrabbing, USER_ID]);

    useEffect(() => {
        const timeSinceLastGrab = Date.now() - lastGrabTime.current;

        if (
            currentGesture === 'grab' &&
            gestureConfidence > config.CONFIDENCE_THRESHOLD &&
            selectedImage &&
            !isGrabbing &&
            !hasGrabbed &&
            timeSinceLastGrab > config.COOLDOWN &&
            !hasCalledGrab.current
        ) {
            hasCalledGrab.current = true;
            setTimeout(() => {
                handleGrab();
            }, 0);
        } else if (hasGrabbed) {
            hasCalledGrab.current = false;
        }
    }, [
        currentGesture,
        gestureConfidence,
        selectedImage,
        isGrabbing,
        hasGrabbed,
        handleGrab,
    ]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setHasGrabbed(false);
            lastGrabTime.current = 0;
            hasCalledGrab.current = false;

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4'>
                {!imagePreview ? (
                    <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full'>
                        <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                            Image Transfer
                        </h1>
                        <p className='text-gray-600 mb-6 text-center'>
                            Select an image, then make a <strong>"GRAB"</strong>{' '}
                            gesture
                        </p>

                        <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-indigo-50 hover:bg-indigo-100'>
                            <Upload className='w-16 h-16 text-indigo-400 mb-4' />
                            <span className='text-sm text-gray-600'>
                                Click to select image
                            </span>
                            <input
                                type='file'
                                className='hidden'
                                accept='images/*'
                                onChange={handleImageSelect}
                            />
                        </label>

                        <Link
                            to={'/drop'}
                            className='mt-6 w-fit flex items-center justify-center gap-2 text-gray-600 underline py-2 text-xs rounded-xl transition-colors'
                        >
                            Go to Drop Page
                        </Link>
                    </div>
                ) : (
                    <div className='relative w-full h-screen'>
                        <img
                            src={imagePreview}
                            alt='Selected Image'
                            className='w-full h-full object-contain'
                        />
                        {isGrabbing && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                                <div className='animate-ping absolute w-96 h-96 rounded-full bg-white opacity-75'></div>
                                <div className='animate-pulse absolute w-64 h-64 rounded-full bg-white opacity-75'></div>
                                <div className='animate-bounce absolute w-32 h-32 rounded-full bg-white opacity-75'></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrabPage;
