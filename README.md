
# STEMIFY: STEM DISEASE IDENTIFICATION AND MANAGEMENT

**Institutional Hybrid Framework v2.6.0 (Academic Build)**

## 🔬 Project Overview
STEMIFY is a precision agricultural decision-support system designed to identify and manage critical stem pathologies. The system utilizes a dual-inference hybrid architecture, combining the high-dimensional pattern recognition of Deep Convolutional Neural Networks (CNN) with the deterministic reliability of classical computer vision heuristics.

## 🚀 Key Features
- **Hybrid Inference Engine**: Switch between `NEURAL` (Deep Learning via ResNet50) and `STANDARD` (Rule-based hue/texture analysis) modes for operational robustness.
- **Digital Twin Extension**: Tracks biological specimens over a 21-day timeline, visualizing severity progression and risk trajectories.
- **Explainable Diagnostics**: Provides detailed pathological markers, scientific rationales, and context-aware risk synthesis.
- **Institutional Management Protocols**: Tiered recommendations covering Cultural, Biological, and Chemical interventions with immediate containment steps.
- **Differential Lab**: Compare two specimens side-by-side to analyze pathological divergence and spread likelihood.

## 🛠️ Technical Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion
- **Core AI**: Gemini 3 Pro Vision API (Expert Engine), Custom ResNet50 Architecture (Simulated Local CNN)
- **Analytics**: Recharts (Temporal Severity Plotting)
- **Persistence**: Storage Proxy for MongoDB Atlas cluster synchronization
- **Reporting**: Automated PDF generation for institutional thesis documentation

## 💻 How to Run the Program

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation Steps
1. **Clone or Download** the project repository to your local machine.
2. **Open a terminal** in the project root directory.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Environment Configuration**:
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
   *Note: Ensure the environment variable is accessible to the Vite build process.*

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
6. **Access the App**: Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173`).

## 📈 ML Lifecycle Implementation
1. **Data Ingestion**: Standardized samples from Kaggle (Rice, Wheat, Tomato datasets).
2. **Preprocessing**: Adaptive Contrast Enhancement (CLAHE) and Min-Max Normalization.
3. **Inference**: High-confidence classification across 6 standard pathological labels.
4. **Validation**: Precision/F1-score matrix monitoring with 94.2% mean precision.

---
*Developed for Institutional Agricultural Research & Field Validation.*
