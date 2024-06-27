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
} from '@liveblocks/react-lexical';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import Theme from './Theme';
import { Comments } from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return <div className="editor-placeholder">Start writing here...</div>;
}

export function Editor({ roomId }: { roomId: string }) {
  const initialConfig = liveblocksConfig({
    namespace: 'Demo',
    nodes: [],
    onError: (error: unknown) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full bg-[#f8f8f8]">
        <div className=" z-50 flex w-screen min-w-full justify-between overflow-auto border-b bg-white pl-3 pr-4 shadow-sm">
          <ToolbarPlugin />
          <DeleteModal roomId={roomId} />
        </div>

        <div className="custom-height flex flex-col items-center justify-start gap-5 overflow-auto px-5 pb-16 pt-5 lg:flex-row lg:items-start lg:justify-center  xl:gap-10 xl:pb-20 xl:pt-10">
          <div className="editor-inner relative h-fit w-full max-w-[800px] border border-gray-300/40  shadow-md">
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

          <LiveblocksPlugin>
            <FloatingComposer className="w-[350px]" />
            <Comments />
          </LiveblocksPlugin>
        </div>
      </div>
    </LexicalComposer>
  );
}
