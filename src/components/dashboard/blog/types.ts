export type ToolbarSection = {
  tools: ToolbarItem[];
};

export type ToolbarItem = {
  icon: React.ElementType;
  action: () => void;
  active?: boolean;
  title: string;
};

export interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string, json: object) => void;
  placeholder?: string;
  characterLimit?: number;
  editable?: boolean;
}
