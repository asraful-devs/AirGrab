<div align="center">

# ✋ AirGrab

### Gesture-Powered Image Transfer System

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.2-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ML5.js](https://img.shields.io/badge/ML5.js-AI-FF6F61?style=for-the-badge)](https://ml5js.org/)

**Transfer images between devices using hand gestures - no buttons, no clicks, just natural movements.**

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Tech Stack](#tech-stack)

</div>

---

## 🎯 Overview

AirGrab is an innovative web application that uses machine learning-powered gesture recognition to transfer images between devices. Simply select an image and make a **"Grab"** gesture to send it, then on another device, make a **"Drop"** gesture to receive it.

Perfect for presentations, collaborative work, or just impressing your friends with futuristic file sharing!

---

## ✨ Features

| Feature                    | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| 🤖 **AI-Powered Gestures** | Uses ML5.js image classification to detect hand gestures in real-time |
| 🔄 **Seamless Transfer**   | Grab images on one device, drop them on another                       |
| 📱 **Responsive Design**   | Works beautifully on desktop and mobile devices                       |
| ⚡ **Real-time Feedback**  | Visual indicators show gesture detection status and confidence        |
| 🎨 **Modern UI**           | Clean, intuitive interface with smooth animations                     |
| 🔒 **Privacy First**       | Camera processing happens locally in your browser                     |

---

## 🎬 Demo

### Grab Zone

1. Select an image from your device
2. Show the **"Grab"** gesture to your camera
3. Watch the magic as your image is sent!

### Drop Zone

1. Navigate to the Drop Zone
2. Show the **"Drop"** gesture
3. Your image appears instantly!

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Frontend

</td>
<td align="center" width="50%">

### Backend

</td>
</tr>
<tr>
<td>

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **ML5.js** - Machine Learning
- **React Router** - Navigation
- **Lucide React** - Icons

</td>
<td>

- **Bun** - Runtime
- **Express 5** - Web Framework
- **Multer** - File Uploads
- **CORS** - Cross-Origin Support
- **TypeScript** - Type Safety

</td>
</tr>
</table>

---

## 📁 Project Structure

```
AirGrab/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── GestureDetector.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── GrabPage.tsx
│   │   │   └── DropPage.tsx
│   │   ├── config/          # Configuration
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── server/                  # Express Backend
│   ├── index.ts             # Server entry point
│   ├── uploads/             # Uploaded images
│   └── package.json
│
└── README.md
```

---

## ⚙️ Configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Md Asraful**

- GitHub: [@asraful-devs](https://github.com/asraful-devs)

---

<div align="center">

### ⭐ Star this repo if you found it useful!

Made with ❤️ and lots of ☕

</div>
