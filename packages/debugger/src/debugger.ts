// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { runIcon, stopIcon } from '@jupyterlab/ui-components';

import { DebuggerConfig } from './config';

import {
  closeAllIcon as closeAll,
  stepIntoIcon as stepInto,
  stepOverIcon as stepOver,
  stepOutIcon as stepOut,
  variableIcon as variable,
  viewBreakpointIcon as viewBreakpoint
} from './icons';

import { DebuggerModel } from './model';

import { DebuggerService } from './service';

import { DebuggerSession } from './session';

import { DebuggerSidebar } from './sidebar';

import { DebuggerSources } from './sources';

/**
 * A namespace for `Debugger` statics.
 */
export namespace Debugger {
  /**
   * Debugger configuration for all kernels.
   */
  export class Config extends DebuggerConfig {}

  /**
   * A model for a debugger.
   */
  export class Model extends DebuggerModel {}

  /**
   * The main IDebugger implementation.
   */
  export class Service extends DebuggerService {}

  /**
   * A concrete implementation of IDebugger.ISession.
   */
  export class Session extends DebuggerSession {}

  /**
   * The debugger sidebar UI.
   */
  export class Sidebar extends DebuggerSidebar {}

  /**
   * The source and editor manager for a debugger instance.
   */
  export class Sources extends DebuggerSources {}

  /**
   * The debugger user interface icons.
   */
  export namespace Icons {
    export const closeAllIcon = closeAll;
    export const continueIcon = runIcon;
    export const stepIntoIcon = stepInto;
    export const stepOutIcon = stepOut;
    export const stepOverIcon = stepOver;
    export const terminateIcon = stopIcon;
    export const variableIcon = variable;
    export const viewBreakpointIcon = viewBreakpoint;
  }
}
