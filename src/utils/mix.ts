import type { Editor } from "@tiptap/core";

export const genId = (length = 8) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2);

export const updateAttributesWithoutHistory = (
  editor: Editor,
  attrs: Record<string, any>,
  pos?: number
) => {
  const { state, view } = editor;

  if (typeof pos !== "number") return;

  const node = state.doc.nodeAt(pos);
  if (!node) return;

  const tr = state.tr.setNodeMarkup(pos, undefined, {
    ...node.attrs,
    ...attrs,
  });

  tr.setMeta("addToHistory", false);
  view.dispatch(tr);
};
