
export interface TextItem {
  id: number;
  type: 'dialogue' | 'narration' | 'sfx';
  text: string;
}

export interface Character {
  prompt: string;
  style: string;
  imageBase64: string;
  mimeType: string;
}

export interface PanelData {
  scene: string;
  textItems: TextItem[];
}

export interface Panel extends PanelData {
  id: number;
  imageUrl: string;
  isLoading: boolean;
}

export interface Page {
    id: number;
    panels: Panel[];
}

export interface Project {
  id: number;
  name: string;
  character: Character | null;
  pages: Page[];
}
