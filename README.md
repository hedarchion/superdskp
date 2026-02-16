# 🎓 SuperDSKP Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

> **DSKP** = Dokumen Standard Kurikulum dan Pentaksiran  
> An interactive web application for exploring the **KSSM Bahasa Inggeris (CEFR Aligned)** curriculum for Malaysian secondary schools.

🔗 **Live Demo:** [https://hedarchion.github.io/superdskp/](https://hedarchion.github.io/superdskp/)

---

## ✨ Features

- 📚 **Complete Curriculum Coverage** - Browse all 5 forms (Form 1-5) of the KSSM English curriculum
- 🔍 **Multiple Views**:
  - **Overview** - Dashboard with summary statistics
  - **Forms** - Detailed form-by-form exploration
  - **Skills** - Cross-form analysis of Listening, Speaking, Reading, Writing, and Literature
  - **Syllabus** - Grammar, vocabulary, and text types
  - **Performance** - Performance bands and descriptors
- 📋 **Copy to Clipboard** - Easy copying of curriculum content
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Vite for optimal loading

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | 19.2.0 | UI Framework |
| [TypeScript](https://www.typescriptlang.org) | 5.9.3 | Type Safety |
| [Vite](https://vitejs.dev) | 7.2.4 | Build Tool |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.18 | Styling |
| [Lucide React](https://lucide.dev) | 0.563.0 | Icons |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/hedarchion/superdskp.git
cd superdskp/my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
my-app/
├── public/              # Static assets
│   ├── curriculum.json  # Main curriculum data
│   └── data/            # Form-specific JSON files
├── src/
│   ├── components/      # React components
│   │   ├── Navigation.tsx
│   │   ├── OverviewView.tsx
│   │   ├── FormsView.tsx
│   │   ├── SkillsView.tsx
│   │   ├── SyllabusView.tsx
│   │   ├── PerformanceView.tsx
│   │   └── CopyButton.tsx
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript definitions
│   └── lib/             # Utility functions
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 📊 Data Model

The curriculum data includes:

- **5 Forms** (Form 1-5)
- **5 Skill Areas**: Listening, Speaking, Reading, Writing, Literature in Action
- **Content Standards** organized by form
- **Performance Standards** with achievement bands
- **Syllabus Content**: Grammar, Vocabulary, Text Types
- **Learning Objectives** for each form

---

## 🌐 Deployment

This project is configured for GitHub Pages deployment:

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
cd dist
git init
git add .
git commit -m "Deploy"
git branch -m gh-pages
git remote add origin https://github.com/hedarchion/superdskp.git
git push -f origin gh-pages
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 hedarchion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [KPM Malaysia](https://www.moe.gov.my/) - Ministry of Education Malaysia
- [CEFR](https://www.coe.int/en/web/common-european-framework-reference-languages) - Common European Framework of Reference for Languages

---

<div align="center">

**[⬆ Back to Top](#-superdskp-explorer)**

Made with ❤️ for Malaysian educators and students

</div>
