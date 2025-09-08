import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { Project, Page } from '../types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ComicPage from '../components/ComicPage';

type Theme = 'light' | 'dark';

// Helper function to render a page off-screen and get its image data URL
const getPageAsImage = async (page: Page, pageIndex: number, theme: Theme): Promise<string> => {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.id = `export-container-${page.id}`;
    if (theme === 'dark') {
      container.classList.add('dark');
    }
    // Position it off-screen
    Object.assign(container.style, {
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '1280px', // A fixed width for consistent export size
        height: 'auto',
        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
    });
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    const pageElement = React.createElement(ComicPage, {
        panels: page.panels,
        onRemovePanel: () => {}, // No-op for export
        exportId: `comic-page-export-${page.id}`,
    });

    // Render the component. We'll wait a bit for images to load.
    root.render(pageElement);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nodeToCapture = document.getElementById(`comic-page-export-${page.id}`);
    if (!nodeToCapture) {
        document.body.removeChild(container);
        throw new Error(`Could not find page element to export for page ${pageIndex + 1}`);
    }

    const dataUrl = await toPng(nodeToCapture, {
        cacheBust: true,
        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
        pixelRatio: 1.5,
    });

    // Cleanup
    root.unmount();
    document.body.removeChild(container);

    return dataUrl;
};


export const exportProjectToPdf = async (
    project: Project,
    onProgress: (message: string) => void,
    theme: Theme
): Promise<void> => {
    onProgress('Starting PDF export...');
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [1280, 1775] 
    });
    doc.deletePage(1); // Remove the default first page

    for (let i = 0; i < project.pages.length; i++) {
        const page = project.pages[i];
        if (page.panels.length === 0) continue; // Skip empty pages

        onProgress(`Processing page ${i + 1} of ${project.pages.length}...`);
        const imageDataUrl = await getPageAsImage(page, i, theme);
        
        doc.addPage();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.addImage(imageDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
    }
    
    onProgress('Saving PDF...');
    doc.save(`${project.name.replace(/ /g, '_')}.pdf`);
    onProgress(''); // Clear progress
};


export const exportProjectToCbz = async (
    project: Project,
    onProgress: (message: string) => void,
    theme: Theme
): Promise<void> => {
    onProgress('Starting CBZ export...');
    const zip = new JSZip();

    for (let i = 0; i < project.pages.length; i++) {
        const page = project.pages[i];
        if (page.panels.length === 0) continue; // Skip empty pages

        onProgress(`Processing page ${i + 1} of ${project.pages.length}...`);
        const imageDataUrl = await getPageAsImage(page, i, theme);
        
        // Remove the data URL prefix to get the base64 string
        const base64Data = imageDataUrl.split(',')[1];
        
        // Pad page number for correct ordering in comic readers
        const pageNumber = String(i).padStart(3, '0');
        zip.file(`page_${pageNumber}.png`, base64Data, { base64: true });
    }

    onProgress('Saving CBZ...');
    const content = await zip.generateAsync({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${project.name.replace(/ /g, '_')}.cbz`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    onProgress(''); // Clear progress
};