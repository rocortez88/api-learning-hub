import MonacoEditor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  theme?: 'vs-dark' | 'light';
}

const DEFAULT_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
};

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '300px',
  theme = 'vs-dark',
}: CodeEditorProps) {
  function handleChange(newValue: string | undefined) {
    onChange(newValue ?? '');
  }

  return (
    <MonacoEditor
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={handleChange}
      options={{ ...DEFAULT_OPTIONS, readOnly }}
    />
  );
}
