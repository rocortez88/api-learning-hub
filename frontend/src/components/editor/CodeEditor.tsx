import MonacoEditor from '@monaco-editor/react';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  theme?: 'vs-dark' | 'light';
}

const DEFAULT_OPTIONS = {
  fontSize: 14,
  minimap: { enabled: false },
  wordWrap: 'on' as const,
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
