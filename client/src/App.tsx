import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GestureDetector from './components/GestureDetector';
import DropPage from './pages/DropPage';
import GrabPage from './pages/GrabPage';

const App = () => {
    const [currentGesture, setCurrentGesture] = useState<string | null>(null);
    const [gestureConfidence, setGestureConfidence] = useState(0);

    const handleGesture = (gesture: string, confidence: number) => {
        setCurrentGesture(gesture);
        setGestureConfidence(confidence);
    };

    return (
        <BrowserRouter>
            <GestureDetector onGesture={handleGesture} />
            <Routes>
                <Route
                    path='/'
                    element={
                        <GrabPage
                            currentGesture={currentGesture}
                            gestureConfidence={gestureConfidence}
                        />
                    }
                />
                <Route
                    path='/drop'
                    element={
                        <DropPage
                            currentGesture={currentGesture}
                            gestureConfidence={gestureConfidence}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
