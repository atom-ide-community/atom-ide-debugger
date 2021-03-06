import type { DebuggerModeType, IDebugService } from "../types"

import { observableFromSubscribeFunction } from "@atom-ide-community/nuclide-commons/event"
import UniversalDisposable from "@atom-ide-community/nuclide-commons/UniversalDisposable"
import * as React from "react"
import { Observable } from "rxjs-compat/bundles/rxjs-compat.umd.min.js"
import DebuggerSteppingComponent from "./DebuggerSteppingComponent"
import { DebuggerMode } from "../constants"
import DebuggerControllerView from "./DebuggerControllerView"
import { AddTargetButton } from "./DebuggerAddTargetButton"

type Props = {
  service: IDebugService,
}

type State = {
  mode: DebuggerModeType,
}

export default class DebuggerControlsView extends React.PureComponent<Props, State> {
  _disposables: UniversalDisposable

  constructor(props: Props) {
    super(props)

    this._disposables = new UniversalDisposable()
    this.state = {
      mode: DebuggerMode.STOPPED,
    }
  }

  componentDidMount(): void {
    const { service } = this.props
    this._disposables.add(
      Observable.merge(
        observableFromSubscribeFunction(service.onDidChangeProcessMode.bind(service)),
        observableFromSubscribeFunction(service.viewModel.onDidChangeDebuggerFocus.bind(service.viewModel))
      )
        .startWith(null)
        .subscribe(() => {
          const { viewModel } = this.props.service
          const { focusedProcess } = viewModel
          this.setState({
            mode: focusedProcess == null ? DebuggerMode.STOPPED : focusedProcess.debuggerMode,
          })
        })
    )
  }

  componentWillUnmount(): void {
    this._dispose()
  }

  _dispose(): void {
    this._disposables.dispose()
  }

  render(): React.Node {
    const { service } = this.props
    const { mode } = this.state
    const debuggerStoppedNotice =
      mode !== DebuggerMode.STOPPED ? null : (
        <div className="debugger-pane-content">
          <div className="debugger-state-notice">The debugger is not attached.</div>
          <div className="debugger-state-notice">{AddTargetButton("debugger-buttongroup-center")}</div>
        </div>
      )

    const running = mode === DebuggerMode.RUNNING
    const paused = mode === DebuggerMode.PAUSED
    const debuggerRunningNotice =
      !running && !paused ? null : (
        <div className="debugger-pane-content">
          <div className="debugger-state-notice">
            {(service.viewModel.focusedProcess == null ||
            service.viewModel.focusedProcess.configuration.processName == null
              ? "The debug target"
              : service.viewModel.focusedProcess.configuration.processName) + ` is ${running ? "running" : "paused"}.`}
          </div>
        </div>
      )

    return (
      <div className="debugger-container-new">
        <div className="debugger-section-header">
          <DebuggerControllerView service={service} />
        </div>
        <div className="debugger-section-header debugger-controls-section">
          <DebuggerSteppingComponent service={service} />
        </div>
        {debuggerRunningNotice}
        {debuggerStoppedNotice}
      </div>
    )
  }
}
