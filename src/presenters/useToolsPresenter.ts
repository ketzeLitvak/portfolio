import { useState } from 'react';
export function useToolsPresenter() {
  const [tool, setTool] = useState<'json' | 'url'>('json');
  const [json, setJson] = useState(
    '{"project":"Chilta","stack":["Next.js","Node.js"],"builtBy":"Ezequiel"}',
  );
  const [url, setUrl] = useState('Hello from Buenos Aires!');
  const [output, setOutput] = useState(() => JSON.stringify(JSON.parse(json), null, 2));
  const [hasError, setHasError] = useState(false);
  const run = (action: 'json' | 'encode' | 'decode') => {
    try {
      setOutput(
        action === 'json'
          ? JSON.stringify(JSON.parse(json), null, 2)
          : action === 'encode'
            ? encodeURIComponent(url)
            : decodeURIComponent(url),
      );
      setHasError(false);
    } catch {
      setOutput('');
      setHasError(true);
    }
  };
  const selectTool = (next: 'json' | 'url') => {
    setTool(next);
    setHasError(false);
    setOutput('');
  };
  return { tool, json, url, output, hasError, setJson, setUrl, selectTool, run };
}
