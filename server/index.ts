import cors from 'cors';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// ============ Type Definitions ============

interface UploadRequestBody {
    userId: string;
}

interface DropRequestParams {
    receiverId: string;
}

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

interface UploadSuccessData {
    imageUrl: string;
}

interface DropSuccessData {
    imagePath: string;
}

// ============ Server Setup ============

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins: string[] = [
    'http://localhost:5173',
    'https://air-grab.vercel.app',
];

app.use(
    cors({
        origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void
        ) => {
            if (!origin) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ Upload Directory Setup ============

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// key: userId, value: imagePath
const imageCache = new Map<string, string>();

// key: userId, value: Set of friend userIds
const friendsMap = new Map<string, Set<string>>([
    ['user1', new Set(['user2'])],
    ['user2', new Set(['user1'])],
]);

// ============ Multer Setup ============

const storage = multer.diskStorage({
    destination: (_req, _file, callback): void => {
        callback(null, uploadsDir);
    },
    filename: (_req, file, callback): void => {
        const uniqueString = Math.random().toString(36).substring(7);
        const timeStamp = Date.now();
        const ext = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, ext);
        callback(null, `image-${fileName}-${timeStamp}-${uniqueString}${ext}`);
    },
});

const upload = multer({ storage });

// ============ Routes ============

app.post(
    '/upload',
    upload.single('image'),
    (
        req: Request<object, ApiResponse<UploadSuccessData>, UploadRequestBody>,
        res: Response<ApiResponse<UploadSuccessData>>
    ): void => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
                return;
            }

            const userId: string = req.body.userId;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                });
                return;
            }

            const imagePath = `/uploads/${req.file.filename}`;
            // Store with userId as key so we can look up by userId later
            imageCache.set(userId, imagePath);

            res.json({
                success: true,
                message: 'File uploaded successfully',
                data: { imageUrl: imagePath },
            });
        } catch (error: unknown) {
            console.error('Error uploading file:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading file',
            });
        }
    }
);

app.get(
    '/drop/:receiverId',
    (
        req: Request<DropRequestParams, ApiResponse<DropSuccessData>>,
        res: Response<ApiResponse<DropSuccessData>>
    ): void => {
        try {
            const { receiverId } = req.params;
            const senderIds = friendsMap.get(receiverId);

            if (!senderIds || senderIds.size === 0) {
                res.status(400).json({
                    success: false,
                    message: 'No friends found for this user',
                });
                return;
            }

            const senderId = Array.from(senderIds)[0];

            if (!senderId) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid sender ID',
                });
                return;
            }

            // Get image by senderId (userId)
            const imagePath = imageCache.get(senderId);

            if (!imagePath) {
                res.status(404).json({
                    success: false,
                    message: 'No image found for sender',
                });
                return;
            }

            imageCache.delete(senderId);

            res.json({
                success: true,
                message: 'Image received',
                data: { imagePath },
            });
        } catch (error: unknown) {
            console.error('Error in drop route:', error);
            res.status(500).json({
                success: false,
                message: 'Drop failed',
            });
        }
    }
);

app.get('/', (_req: Request, res: Response): void => {
    res.send('Hello World! This is the AirGrab server.');
});

const PORT = 5000;

app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
