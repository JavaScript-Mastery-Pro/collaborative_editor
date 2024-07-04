'use client';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  liveblocksConfig,
  LiveblocksPlugin,
  FloatingComposer,
  useEditorStatus,
} from '@liveblocks/react-lexical';
import Image from 'next/image';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import Theme from './Theme';
import { Comments } from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return <div className="editor-placeholder">Start writing here...</div>;
}

const initialConfig = liveblocksConfig({
  namespace: 'Editor',
  nodes: [],
  onError: (error: unknown) => {
    console.error(error);
    throw error;
  },
  theme: Theme,
});

export function Editor({ roomId }: { roomId: string }) {
  const status = useEditorStatus();

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full ">
        <div className=" z-50 flex w-screen min-w-full justify-between overflow-auto border-y border-dark-300 bg-dark-100 pl-3 pr-4 shadow-sm">
          <ToolbarPlugin />
          <DeleteModal roomId={roomId} />
        </div>

        <div className="custom-scrollbar flex h-[calc(100vh-114px)] flex-col items-center justify-start gap-5 overflow-auto px-5 pb-16 pt-5 lg:flex-row lg:items-start lg:justify-center  xl:gap-10 xl:pb-20 xl:pt-10">
          {status === 'not-loaded' || status === 'loading' ? (
            <div className="flex size-full h-screen items-center justify-center gap-3 text-[#666666]">
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={32}
                height={32}
                className="animate-spin"
              />
              Loading...
            </div>
          ) : (
            <div className="editor-inner relative h-fit w-full max-w-[800px]  shadow-md">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input h-full" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <FloatingToolbarPlugin />

              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}
          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
