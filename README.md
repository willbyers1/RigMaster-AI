# 🎮 RigMaster AI

**Your PC's Personal Health Guardian & AI Performance Predictor**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)


---

## 🚀 About The Project

**RigMaster AI** is a next-generation web application designed for PC gamers and hardware enthusiasts. It solves two major problems: **"Can I run it?"** and **"When should I clean it?"**

Powered by **Google's Gemini 1.5 Flash AI model**, RigMaster predicts FPS values for any game configuration without relying on static databases. Additionally, it acts as a maintenance companion, tracking your thermal paste and fan cleaning schedules based on your specific device type (Laptop/Desktop).

### ✨ Key Features

* **🤖 AI-Powered FPS Predictor:** Utilizes Google Gemini to estimate Low, Medium, and Ultra FPS for *any* game and hardware combination.
* **🛠️ Smart Maintenance Scheduler:** Automatically calculates the next service date for Fan Cleaning and Thermal Paste replacement based on device type.
* **🔧 Custom Hardware Support:** Don't see your GPU? No problem. The **"Other / Custom"** input allows manual entry for specific or legacy hardware.
* **📚 Interactive Guide Hub:** Direct access to curated repair guides (iFixit, Tom's Hardware) for your specific form factor.
* **🌓 Dark & Light Mode:** Fully responsive UI with a sleek, gamer-focused aesthetic.
* **💾 Local Persistence:** Saves your rig profile locally so you never have to re-enter specs.

---

## 🏗️ Tech Stack

This project was built using modern web technologies focusing on performance and UX.

* **Frontend:** React.js (Vite Ecosystem)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn UI
* **Icons:** Lucide React
* **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
* **Routing:** React Router DOM

---

## ⚡ Getting Started

Follow these steps to run RigMaster AI locally on your machine.

### Prerequisites

* Node.js (v18 or higher)
* A Google Gemini API Key (Get it [here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/willbyers/rigmaster-ai.git](https://github.com/willbyers/rigmaster-ai.git)
    cd rigmaster-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```

5.  Open `http://localhost:5173` in your browser.

---

## 📸 Screenshots
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/5160658d-3631-4b9b-9181-8e3ace2c86d9" />
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/9b38b591-1e49-4979-8e3a-ef2f885b9117" />



---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---


<div align="center">

**Created By Mert Batu Bülbül**
* 🎓 Computer Engineering Undergraduate * 💻 Full Stack Developer & AI Enthusiast *



*Start tracking your rig's health today!* 🖥️✨
<br/>
**Don't forget to star ⭐ this repo if you found it useful!**

</div>
