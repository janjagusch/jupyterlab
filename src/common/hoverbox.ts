// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  CodeEditor
} from '../codeeditor';


/**
 * The class name added to all hover boxes.
 */
const HOVERBOX_CLASS = 'jp-HoverBox';

/**
 * The class name added to a hovering node that is scrolled out of view.
 */
const OUTOFVIEW_CLASS = 'jp-mod-outofview';


/**
 * A namespace for `HoverBox` members.
 */
export
namespace HoverBox {
  /**
   * Options for setting the geometry of a hovering node and its anchor node.
   */
  export
  interface IOptions {
    /**
     * The cursor definition of the referent editor.
     */
    cursor: { start: number; end: number; };

    /**
     * The referent editor.
     */
    editor: CodeEditor.IEditor;

    /**
     * The maximum height of a hover box.
     *
     * #### Notes
     * This value is only used if a CSS max-height attribute is not set for the
     * hover box. It is a fallback value.
     */
    maxHeight: number;

    /**
     * The minimum height of a hover box.
     */
    minHeight: number;

    /**
     * The hover box node.
     */
    node: HTMLElement;
  }


  /**
   * Set the visible dimensions of a hovering box anchored to an editor cursor.
   *
   * @param options - The hover box geometry calculation options.
   */
  export
  function setGeometry(options: IOptions): void {
    const { cursor, editor, node } = options;
    const { charWidth, host } = editor;
    const position = editor.getPositionAt(cursor.start);
    const coords = editor.getCoordinateForPosition(position);

    // Add hover box class if it does not exist.
    node.classList.add(HOVERBOX_CLASS);

    // If the current coordinates are not visible, bail.
    if (!host.contains(document.elementFromPoint(coords.left, coords.top))) {
      node.classList.add(OUTOFVIEW_CLASS);
      return;
    }

    // Clear any previously set max-height.
    node.style.maxHeight = '';

    // Clear any programmatically set margin-top.
    node.style.marginTop = '';

    // Make sure the node is visible.
    node.classList.remove(OUTOFVIEW_CLASS);

    const style = window.getComputedStyle(node);
    const innerHeight = window.innerHeight;
    const spaceAbove = coords.top;
    const spaceBelow = innerHeight - coords.bottom;
    const marginTop = parseInt(style.marginTop, 10) || 0;
    const minHeight = parseInt(style.minHeight, 10) || options.minHeight;

    let maxHeight = parseInt(style.maxHeight, 10) || options.maxHeight;
    let top: number;

    // If the whole box fits below or if there is more space below, then
    // rendering the box below the text being typed is privileged so that
    // the code above is not obscured.
    let renderBelow = spaceBelow >= maxHeight || spaceBelow >= spaceAbove;
    if (renderBelow) {
      maxHeight = Math.min(spaceBelow - marginTop, maxHeight);
    } else {
      maxHeight = Math.min(spaceAbove, maxHeight);
      // If the box renders above the text, its top margin is irrelevant.
      node.style.marginTop = '0px';
    }
    node.style.maxHeight = `${maxHeight}px`;

    // Make sure the box ought to be visible.
    let withinBounds = maxHeight > minHeight &&
      (spaceBelow >= minHeight || spaceAbove >= minHeight);

    if (!withinBounds) {
      node.classList.add(OUTOFVIEW_CLASS);
      return;
    }

    let borderLeftWidth = style.borderLeftWidth;
    let left = coords.left + (parseInt(borderLeftWidth, 10) || 0);
    let { start, end } = cursor;
    let nodeRect = node.getBoundingClientRect();

    // Position the box vertically.
    top = renderBelow ? innerHeight - spaceBelow : spaceAbove - nodeRect.height;
    node.style.top = `${Math.floor(top)}px`;

    // Move box to the start of the blob of text in the referent editor.
    left -= charWidth * (end - start);
    node.style.left = `${Math.ceil(left)}px`;
    node.style.width = 'auto';

    // Expand the menu width by the scrollbar size, if present.
    if (node.scrollHeight >= maxHeight) {
      node.style.width = `${2 * node.offsetWidth - node.clientWidth}`;
      node.scrollTop = 0;
    }
  }
}
