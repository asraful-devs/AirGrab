export default {
    MODEL_URL: import.meta.env.VITE_MODEL_URL,
    API_URL: import.meta.env.VITE_API_URL,
    COOLDOWN: parseInt(import.meta.env.VITE_COOLDOWN, 10) || 10000,
    CONFIDENCE_THRESHOLD:
        parseFloat(import.meta.env.VITE_CONFIDENCE_THRESHOLD) || 0.7,
};
