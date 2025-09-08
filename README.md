# ComicCrafter

**Your AI-Powered Comic Book Architect**

## 📖 Vision

ComicCrafter is an innovative, web-based platform that empowers creators of all skill levels to transform text scripts into visually rich, multi-page comic books. It bridges the gap between storytelling and art creation by leveraging cutting-edge AI, eliminating the need for traditional drawing skills and dramatically accelerating the production workflow. Our vision is to democratize comic creation, allowing anyone with a story to tell to bring their universe to life with consistent characters, dynamic layouts, and professional-quality artwork.

## ✨ Key Features

- **AI-Powered Art Generation**: Utilizes Google's Gemini and Imagen models to generate stunning character art and panel illustrations from simple text prompts.
- **Consistent Character Creation**: The "Character Architect" generates a character reference sheet, ensuring your characters maintain a consistent appearance across different panels, poses, and expressions.
- **Multi-Project & Page Management**: Create and manage multiple, distinct comic book projects. Each project can contain multiple pages, with all progress automatically saved to your browser's local storage.
- **Dynamic Panel Scripting**: A flexible "Panel Scripter" allows you to add multiple dialogue bubbles, narration boxes, and sound effect (SFX) text items to any panel.
- **Multi-Image Layering**: Go beyond single images. Add multiple image layers to a single panel to create complex, composite scenes with foreground and background elements.
- **Customizable Page Layouts**: Take full control of your page composition with an intuitive drag-and-drop interface to rearrange panels and a selection of predefined layout templates (e.g., Hero Panel, 2x2 Grid).
- **Full Project Export**: Export your work in industry-standard formats. Download a single page as a high-resolution PNG, or export the entire comic book as a multi-page PDF or a CBZ archive, ready for digital comic readers.

## 🚀 Technology Stack

- **Frontend**: Built with [React](https://react.dev/) and styled with [Tailwind CSS](https://tailwindcss.com/) for a modern, responsive user interface.
- **AI Models**:
  - **Google Gemini API (`gemini-2.5-flash-image-preview`)**: The core engine for generating panel artwork with character consistency.
  - **Google Imagen 4 (`imagen-4.0-generate-001`)**: Used by the Character Architect to create high-quality character reference sheets.
- **Core Libraries**:
  - `react-beautiful-dnd`: Powers the smooth drag-and-drop panel reordering.
  - `html-to-image`: Used for capturing high-quality images of comic pages for export.
  - `jspdf` & `jszip`: Enable the creation of multi-page PDF and CBZ archive files.

## ✍️ How It Works: User Flow

1.  **Create a Project**: Start by giving your new comic a name. All your work will be saved under this project.
2.  **Architect Your Character**: Describe your main character and choose an art style. The AI generates a reference image that will be used to keep their appearance consistent.
3.  **Script Your Panels**: For each panel, write a description of the scene and add dialogue, narration, or sound effects.
4.  **Generate & Compose**: Click "Add Panel" to have the AI draw your scene. Hover over the panel to add more image layers for more complex compositions.
5.  **Lay Out Your Page**: Arrange the panels on the page using drag-and-drop or by selecting a predefined layout template.
6.  **Build Your Story**: Add more pages to continue your narrative.
7.  **Export Your Comic**: Once your story is ready, use the Export Manager to download your creation as a PNG, PDF, or CBZ file.
