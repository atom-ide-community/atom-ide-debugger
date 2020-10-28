"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bindObservableAsProps = require("@atom-ide-community/nuclide-commons-ui/bindObservableAsProps");

var React = _interopRequireWildcard(require("react"));

var _rxjs = require("rxjs");

var _Section = require("@atom-ide-community/nuclide-commons-ui/Section");

var _UniversalDisposable = _interopRequireDefault(require("@atom-ide-community/nuclide-commons/UniversalDisposable"));

var _event = require("@atom-ide-community/nuclide-commons/event");

var _expected = require("@atom-ide-community/nuclide-commons/expected");

var _LoadingSpinner = require("@atom-ide-community/nuclide-commons-ui/LoadingSpinner");

var _ExpressionTreeComponent = require("./ExpressionTreeComponent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const NO_VARIABLES = /*#__PURE__*/React.createElement("div", {
  className: "debugger-expression-value-row"
}, /*#__PURE__*/React.createElement("span", {
  className: "debugger-expression-value-content"
}, "(no variables)"));
const LOADING = /*#__PURE__*/React.createElement("div", {
  className: "debugger-expression-value-row"
}, /*#__PURE__*/React.createElement("span", {
  className: "debugger-expression-value-content"
}, /*#__PURE__*/React.createElement(_LoadingSpinner.LoadingSpinner, {
  size: "MEDIUM"
})));

class ScopesComponent extends React.Component {
  constructor(props) {
    super(props);
    this._disposables = void 0;
    this._expansionStates = void 0;
    this.state = {
      scopes: _expected.Expect.value([]),
      // UX: Local scope names should be expanded by default.
      expandedScopes: new Set(["Local", "Locals"])
    };
    this._expansionStates = new Map();
    this._disposables = new _UniversalDisposable.default();
  }

  componentDidMount() {
    const {
      viewModel
    } = this.props.service;

    this._disposables.add(_rxjs.Observable.merge((0, _event.observableFromSubscribeFunction)(viewModel.onDidChangeDebuggerFocus.bind(viewModel)).map(() => false), (0, _event.observableFromSubscribeFunction)(viewModel.onDidChangeExpressionContext.bind(viewModel)).map(() => true)).debounceTime(100).startWith(false).switchMap(forceRefresh => this._getScopes(forceRefresh)).subscribe(scopes => {
      this.setState({
        scopes
      });
    }));
  }

  _getScopes(forceRefresh) {
    const {
      focusedStackFrame
    } = this.props.service.viewModel;

    if (focusedStackFrame == null) {
      return _rxjs.Observable.of(_expected.Expect.value([]));
    } else {
      // If refreshing explicitly, don't start with pending because
      // there's no reason to show a spinner in an already-populated
      // scopes tree.
      const result = _rxjs.Observable.fromPromise(focusedStackFrame.getScopes(forceRefresh).then(scopes => _expected.Expect.value(scopes), error => _expected.Expect.error(error)));

      return forceRefresh ? result : _rxjs.Observable.of(_expected.Expect.pending()).concat(result);
    }
  }

  componentWillUnmount() {
    this._disposables.dispose();
  }

  _renderScopeSection(scope) {
    // Non-local scopes should be collapsed by default since users typically care less about them.
    const expanded = this._isScopeExpanded(scope);

    const ScopeBodyComponent = expanded ? (0, _bindObservableAsProps.bindObservableAsProps)(this._getScopeVariables(scope).map(variables => ({
      variables,
      containerContext: this
    })), ScopeComponent) : () => null;
    return /*#__PURE__*/React.createElement(_Section.Section, {
      key: scope.getId(),
      collapsable: true,
      collapsed: !expanded,
      onChange: isCollapsed => this._setScopeExpanded(scope, !isCollapsed),
      headline: scope.name,
      size: "small"
    }, /*#__PURE__*/React.createElement(ScopeBodyComponent, null));
  }

  _getScopeVariables(scope) {
    return _rxjs.Observable.of(_expected.Expect.pending()).concat(_rxjs.Observable.fromPromise(scope.getChildren().then(variables => _expected.Expect.value(variables), error => _expected.Expect.error(error))));
  }

  _isScopeExpanded(scope) {
    return this.state.expandedScopes.has(scope.name);
  }

  _setScopeExpanded(scope, expanded) {
    if (expanded === this.state.expandedScopes.has(scope.name)) {
      return;
    } // TODO: (wbinnssmith) T30771435 this setState depends on current state
    // and should use an updater function rather than an object
    // eslint-disable-next-line react/no-access-state-in-setstate


    const expandedScopes = new Set(this.state.expandedScopes);

    if (expanded) {
      expandedScopes.add(scope.name);
    } else {
      expandedScopes.delete(scope.name);
    }

    this.setState({
      expandedScopes
    });
  }

  render() {
    const {
      scopes
    } = this.state;

    if (scopes.isError) {
      return /*#__PURE__*/React.createElement("span", null, "Error fetching scopes: ", scopes.error.toString());
    } else if (scopes.isPending) {
      return LOADING;
    } else if (scopes.value.length === 0) {
      return /*#__PURE__*/React.createElement("span", null, "(no variables)");
    }

    const scopeSections = scopes.value.map(scope => this._renderScopeSection(scope));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "debugger-expression-value-list"
    }, scopeSections));
  }

}

exports.default = ScopesComponent;

class ScopeComponent extends React.Component {
  render() {
    const {
      variables
    } = this.props;

    if (variables.isError) {
      return /*#__PURE__*/React.createElement("div", null, "Error fetching scope variables ", variables.error.toString());
    } else if (variables.isPending) {
      return LOADING;
    } else if (variables.value.length === 0) {
      return NO_VARIABLES;
    } else {
      return variables.value.map(variable => this._renderVariable(variable));
    }
  }

  _renderVariable(expression) {
    return /*#__PURE__*/React.createElement("div", {
      className: "debugger-expression-value-row debugger-scope",
      key: expression.name
    }, /*#__PURE__*/React.createElement("div", {
      className: "debugger-expression-value-content"
    }, /*#__PURE__*/React.createElement(_ExpressionTreeComponent.ExpressionTreeComponent, {
      expression: expression,
      containerContext: this.props.containerContext
    })));
  }

}

module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjb3Blc0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6WyJOT19WQVJJQUJMRVMiLCJMT0FESU5HIiwiU2NvcGVzQ29tcG9uZW50IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiX2Rpc3Bvc2FibGVzIiwiX2V4cGFuc2lvblN0YXRlcyIsInN0YXRlIiwic2NvcGVzIiwiRXhwZWN0IiwidmFsdWUiLCJleHBhbmRlZFNjb3BlcyIsIlNldCIsIk1hcCIsIlVuaXZlcnNhbERpc3Bvc2FibGUiLCJjb21wb25lbnREaWRNb3VudCIsInZpZXdNb2RlbCIsInNlcnZpY2UiLCJhZGQiLCJPYnNlcnZhYmxlIiwibWVyZ2UiLCJvbkRpZENoYW5nZURlYnVnZ2VyRm9jdXMiLCJiaW5kIiwibWFwIiwib25EaWRDaGFuZ2VFeHByZXNzaW9uQ29udGV4dCIsImRlYm91bmNlVGltZSIsInN0YXJ0V2l0aCIsInN3aXRjaE1hcCIsImZvcmNlUmVmcmVzaCIsIl9nZXRTY29wZXMiLCJzdWJzY3JpYmUiLCJzZXRTdGF0ZSIsImZvY3VzZWRTdGFja0ZyYW1lIiwib2YiLCJyZXN1bHQiLCJmcm9tUHJvbWlzZSIsImdldFNjb3BlcyIsInRoZW4iLCJlcnJvciIsInBlbmRpbmciLCJjb25jYXQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJfcmVuZGVyU2NvcGVTZWN0aW9uIiwic2NvcGUiLCJleHBhbmRlZCIsIl9pc1Njb3BlRXhwYW5kZWQiLCJTY29wZUJvZHlDb21wb25lbnQiLCJfZ2V0U2NvcGVWYXJpYWJsZXMiLCJ2YXJpYWJsZXMiLCJjb250YWluZXJDb250ZXh0IiwiU2NvcGVDb21wb25lbnQiLCJnZXRJZCIsImlzQ29sbGFwc2VkIiwiX3NldFNjb3BlRXhwYW5kZWQiLCJuYW1lIiwiZ2V0Q2hpbGRyZW4iLCJoYXMiLCJkZWxldGUiLCJyZW5kZXIiLCJpc0Vycm9yIiwidG9TdHJpbmciLCJpc1BlbmRpbmciLCJsZW5ndGgiLCJzY29w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QUFMLENBQVc4QztBQUE5RSxNQURGLENBREYsQ0FERjtBQU9EOztBQXRCc0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IElEZWJ1Z1NlcnZpY2UsIElTY29wZSwgSVZhcmlhYmxlIH0gZnJvbSBcIi4uL3R5cGVzXCJcbmltcG9ydCB0eXBlIHsgRXhwZWN0ZWQgfSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMvZXhwZWN0ZWRcIlxuXG5pbXBvcnQgeyBiaW5kT2JzZXJ2YWJsZUFzUHJvcHMgfSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMtdWkvYmluZE9ic2VydmFibGVBc1Byb3BzXCJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIlxuaW1wb3J0IHsgU2VjdGlvbiB9IGZyb20gXCJAYXRvbS1pZGUtY29tbXVuaXR5L251Y2xpZGUtY29tbW9ucy11aS9TZWN0aW9uXCJcbmltcG9ydCBVbml2ZXJzYWxEaXNwb3NhYmxlIGZyb20gXCJAYXRvbS1pZGUtY29tbXVuaXR5L251Y2xpZGUtY29tbW9ucy9Vbml2ZXJzYWxEaXNwb3NhYmxlXCJcbmltcG9ydCB7IG9ic2VydmFibGVGcm9tU3Vic2NyaWJlRnVuY3Rpb24gfSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMvZXZlbnRcIlxuaW1wb3J0IHsgRXhwZWN0IH0gZnJvbSBcIkBhdG9tLWlkZS1jb21tdW5pdHkvbnVjbGlkZS1jb21tb25zL2V4cGVjdGVkXCJcbmltcG9ydCB7IExvYWRpbmdTcGlubmVyIH0gZnJvbSBcIkBhdG9tLWlkZS1jb21tdW5pdHkvbnVjbGlkZS1jb21tb25zLXVpL0xvYWRpbmdTcGlubmVyXCJcbmltcG9ydCB7IEV4cHJlc3Npb25UcmVlQ29tcG9uZW50IH0gZnJvbSBcIi4vRXhwcmVzc2lvblRyZWVDb21wb25lbnRcIlxuXG50eXBlIFByb3BzID0ge1xuICArc2VydmljZTogSURlYnVnU2VydmljZSxcbn1cblxuY29uc3QgTk9fVkFSSUFCTEVTID0gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImRlYnVnZ2VyLWV4cHJlc3Npb24tdmFsdWUtcm93XCI+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiZGVidWdnZXItZXhwcmVzc2lvbi12YWx1ZS1jb250ZW50XCI+KG5vIHZhcmlhYmxlcyk8L3NwYW4+XG4gIDwvZGl2PlxuKVxuXG5jb25zdCBMT0FESU5HID0gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImRlYnVnZ2VyLWV4cHJlc3Npb24tdmFsdWUtcm93XCI+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiZGVidWdnZXItZXhwcmVzc2lvbi12YWx1ZS1jb250ZW50XCI+XG4gICAgICA8TG9hZGluZ1NwaW5uZXIgc2l6ZT1cIk1FRElVTVwiIC8+XG4gICAgPC9zcGFuPlxuICA8L2Rpdj5cbilcblxudHlwZSBTdGF0ZSA9IHtcbiAgc2NvcGVzOiBFeHBlY3RlZDxBcnJheTxJU2NvcGU+PixcbiAgZXhwYW5kZWRTY29wZXM6IFNldDxzdHJpbmc+LFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29wZXNDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIF9kaXNwb3NhYmxlczogVW5pdmVyc2FsRGlzcG9zYWJsZVxuICBfZXhwYW5zaW9uU3RhdGVzOiBNYXA8c3RyaW5nIC8qIGV4cHJlc3Npb24gKi8sIE9iamVjdCAvKiB1bmlxdWUgcmVmZXJlbmNlIGZvciBleHByZXNzaW9uICovPlxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzY29wZXM6IEV4cGVjdC52YWx1ZShbXSksXG4gICAgICAvLyBVWDogTG9jYWwgc2NvcGUgbmFtZXMgc2hvdWxkIGJlIGV4cGFuZGVkIGJ5IGRlZmF1bHQuXG4gICAgICBleHBhbmRlZFNjb3BlczogbmV3IFNldChbXCJMb2NhbFwiLCBcIkxvY2Fsc1wiXSksXG4gICAgfVxuICAgIHRoaXMuX2V4cGFuc2lvblN0YXRlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuX2Rpc3Bvc2FibGVzID0gbmV3IFVuaXZlcnNhbERpc3Bvc2FibGUoKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKTogdm9pZCB7XG4gICAgY29uc3QgeyB2aWV3TW9kZWwgfSA9IHRoaXMucHJvcHMuc2VydmljZVxuICAgIHRoaXMuX2Rpc3Bvc2FibGVzLmFkZChcbiAgICAgIE9ic2VydmFibGUubWVyZ2UoXG4gICAgICAgIG9ic2VydmFibGVGcm9tU3Vic2NyaWJlRnVuY3Rpb24odmlld01vZGVsLm9uRGlkQ2hhbmdlRGVidWdnZXJGb2N1cy5iaW5kKHZpZXdNb2RlbCkpLm1hcCgoKSA9PiBmYWxzZSksXG4gICAgICAgIG9ic2VydmFibGVGcm9tU3Vic2NyaWJlRnVuY3Rpb24odmlld01vZGVsLm9uRGlkQ2hhbmdlRXhwcmVzc2lvbkNvbnRleHQuYmluZCh2aWV3TW9kZWwpKS5tYXAoKCkgPT4gdHJ1ZSlcbiAgICAgIClcbiAgICAgICAgLmRlYm91bmNlVGltZSgxMDApXG4gICAgICAgIC5zdGFydFdpdGgoZmFsc2UpXG4gICAgICAgIC5zd2l0Y2hNYXAoKGZvcmNlUmVmcmVzaDogYm9vbGVhbikgPT4gdGhpcy5fZ2V0U2NvcGVzKGZvcmNlUmVmcmVzaCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKHNjb3BlcykgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzY29wZXMgfSlcbiAgICAgICAgfSlcbiAgICApXG4gIH1cblxuICBfZ2V0U2NvcGVzKGZvcmNlUmVmcmVzaDogYm9vbGVhbik6IE9ic2VydmFibGU8RXhwZWN0ZWQ8QXJyYXk8SVNjb3BlPj4+IHtcbiAgICBjb25zdCB7IGZvY3VzZWRTdGFja0ZyYW1lIH0gPSB0aGlzLnByb3BzLnNlcnZpY2Uudmlld01vZGVsXG4gICAgaWYgKGZvY3VzZWRTdGFja0ZyYW1lID09IG51bGwpIHtcbiAgICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKEV4cGVjdC52YWx1ZShbXSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHJlZnJlc2hpbmcgZXhwbGljaXRseSwgZG9uJ3Qgc3RhcnQgd2l0aCBwZW5kaW5nIGJlY2F1c2VcbiAgICAgIC8vIHRoZXJlJ3Mgbm8gcmVhc29uIHRvIHNob3cgYSBzcGlubmVyIGluIGFuIGFscmVhZHktcG9wdWxhdGVkXG4gICAgICAvLyBzY29wZXMgdHJlZS5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IE9ic2VydmFibGUuZnJvbVByb21pc2UoXG4gICAgICAgIGZvY3VzZWRTdGFja0ZyYW1lLmdldFNjb3Blcyhmb3JjZVJlZnJlc2gpLnRoZW4oXG4gICAgICAgICAgKHNjb3BlcykgPT4gRXhwZWN0LnZhbHVlKHNjb3BlcyksXG4gICAgICAgICAgKGVycm9yKSA9PiBFeHBlY3QuZXJyb3IoZXJyb3IpXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIHJldHVybiBmb3JjZVJlZnJlc2ggPyByZXN1bHQgOiBPYnNlcnZhYmxlLm9mKEV4cGVjdC5wZW5kaW5nKCkpLmNvbmNhdChyZXN1bHQpXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKTogdm9pZCB7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIH1cblxuICBfcmVuZGVyU2NvcGVTZWN0aW9uKHNjb3BlOiBJU2NvcGUpOiA/UmVhY3QuRWxlbWVudDxhbnk+IHtcbiAgICAvLyBOb24tbG9jYWwgc2NvcGVzIHNob3VsZCBiZSBjb2xsYXBzZWQgYnkgZGVmYXVsdCBzaW5jZSB1c2VycyB0eXBpY2FsbHkgY2FyZSBsZXNzIGFib3V0IHRoZW0uXG4gICAgY29uc3QgZXhwYW5kZWQgPSB0aGlzLl9pc1Njb3BlRXhwYW5kZWQoc2NvcGUpXG4gICAgY29uc3QgU2NvcGVCb2R5Q29tcG9uZW50ID0gZXhwYW5kZWRcbiAgICAgID8gYmluZE9ic2VydmFibGVBc1Byb3BzKFxuICAgICAgICAgIHRoaXMuX2dldFNjb3BlVmFyaWFibGVzKHNjb3BlKS5tYXAoKHZhcmlhYmxlcykgPT4gKHtcbiAgICAgICAgICAgIHZhcmlhYmxlcyxcbiAgICAgICAgICAgIGNvbnRhaW5lckNvbnRleHQ6IHRoaXMsXG4gICAgICAgICAgfSkpLFxuICAgICAgICAgIFNjb3BlQ29tcG9uZW50XG4gICAgICAgIClcbiAgICAgIDogKCkgPT4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTZWN0aW9uXG4gICAgICAgIGtleT17c2NvcGUuZ2V0SWQoKX1cbiAgICAgICAgY29sbGFwc2FibGU9e3RydWV9XG4gICAgICAgIGNvbGxhcHNlZD17IWV4cGFuZGVkfVxuICAgICAgICBvbkNoYW5nZT17KGlzQ29sbGFwc2VkKSA9PiB0aGlzLl9zZXRTY29wZUV4cGFuZGVkKHNjb3BlLCAhaXNDb2xsYXBzZWQpfVxuICAgICAgICBoZWFkbGluZT17c2NvcGUubmFtZX1cbiAgICAgICAgc2l6ZT1cInNtYWxsXCJcbiAgICAgID5cbiAgICAgICAgPFNjb3BlQm9keUNvbXBvbmVudCAvPlxuICAgICAgPC9TZWN0aW9uPlxuICAgIClcbiAgfVxuXG4gIF9nZXRTY29wZVZhcmlhYmxlcyhzY29wZTogSVNjb3BlKTogT2JzZXJ2YWJsZTxFeHBlY3RlZDxBcnJheTxJVmFyaWFibGU+Pj4ge1xuICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKEV4cGVjdC5wZW5kaW5nKCkpLmNvbmNhdChcbiAgICAgIE9ic2VydmFibGUuZnJvbVByb21pc2UoXG4gICAgICAgIHNjb3BlLmdldENoaWxkcmVuKCkudGhlbihcbiAgICAgICAgICAodmFyaWFibGVzKSA9PiBFeHBlY3QudmFsdWUodmFyaWFibGVzKSxcbiAgICAgICAgICAoZXJyb3IpID0+IEV4cGVjdC5lcnJvcihlcnJvcilcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcbiAgfVxuXG4gIF9pc1Njb3BlRXhwYW5kZWQoc2NvcGU6IElTY29wZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmV4cGFuZGVkU2NvcGVzLmhhcyhzY29wZS5uYW1lKVxuICB9XG5cbiAgX3NldFNjb3BlRXhwYW5kZWQoc2NvcGU6IElTY29wZSwgZXhwYW5kZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoZXhwYW5kZWQgPT09IHRoaXMuc3RhdGUuZXhwYW5kZWRTY29wZXMuaGFzKHNjb3BlLm5hbWUpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gVE9ETzogKHdiaW5uc3NtaXRoKSBUMzA3NzE0MzUgdGhpcyBzZXRTdGF0ZSBkZXBlbmRzIG9uIGN1cnJlbnQgc3RhdGVcbiAgICAvLyBhbmQgc2hvdWxkIHVzZSBhbiB1cGRhdGVyIGZ1bmN0aW9uIHJhdGhlciB0aGFuIGFuIG9iamVjdFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hY2Nlc3Mtc3RhdGUtaW4tc2V0c3RhdGVcbiAgICBjb25zdCBleHBhbmRlZFNjb3BlcyA9IG5ldyBTZXQodGhpcy5zdGF0ZS5leHBhbmRlZFNjb3BlcylcbiAgICBpZiAoZXhwYW5kZWQpIHtcbiAgICAgIGV4cGFuZGVkU2NvcGVzLmFkZChzY29wZS5uYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICBleHBhbmRlZFNjb3Blcy5kZWxldGUoc2NvcGUubmFtZSlcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGV4cGFuZGVkU2NvcGVzIH0pXG4gIH1cblxuICByZW5kZXIoKTogUmVhY3QuTm9kZSB7XG4gICAgY29uc3QgeyBzY29wZXMgfSA9IHRoaXMuc3RhdGVcbiAgICBpZiAoc2NvcGVzLmlzRXJyb3IpIHtcbiAgICAgIHJldHVybiA8c3Bhbj5FcnJvciBmZXRjaGluZyBzY29wZXM6IHtzY29wZXMuZXJyb3IudG9TdHJpbmcoKX08L3NwYW4+XG4gICAgfSBlbHNlIGlmIChzY29wZXMuaXNQZW5kaW5nKSB7XG4gICAgICByZXR1cm4gTE9BRElOR1xuICAgIH0gZWxzZSBpZiAoc2NvcGVzLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDxzcGFuPihubyB2YXJpYWJsZXMpPC9zcGFuPlxuICAgIH1cbiAgICBjb25zdCBzY29wZVNlY3Rpb25zID0gc2NvcGVzLnZhbHVlLm1hcCgoc2NvcGUpID0+IHRoaXMuX3JlbmRlclNjb3BlU2VjdGlvbihzY29wZSkpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVidWdnZXItZXhwcmVzc2lvbi12YWx1ZS1saXN0XCI+e3Njb3BlU2VjdGlvbnN9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxudHlwZSBTY29wZVByb3BzID0ge1xuICB2YXJpYWJsZXM6IEV4cGVjdGVkPEFycmF5PElWYXJpYWJsZT4+LFxuICBjb250YWluZXJDb250ZXh0OiBPYmplY3QsXG59XG5cbmNsYXNzIFNjb3BlQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFNjb3BlUHJvcHM+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgdmFyaWFibGVzIH0gPSB0aGlzLnByb3BzXG4gICAgaWYgKHZhcmlhYmxlcy5pc0Vycm9yKSB7XG4gICAgICByZXR1cm4gPGRpdj5FcnJvciBmZXRjaGluZyBzY29wZSB2YXJpYWJsZXMge3ZhcmlhYmxlcy5lcnJvci50b1N0cmluZygpfTwvZGl2PlxuICAgIH0gZWxzZSBpZiAodmFyaWFibGVzLmlzUGVuZGluZykge1xuICAgICAgcmV0dXJuIExPQURJTkdcbiAgICB9IGVsc2UgaWYgKHZhcmlhYmxlcy52YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBOT19WQVJJQUJMRVNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhcmlhYmxlcy52YWx1ZS5tYXAoKHZhcmlhYmxlKSA9PiB0aGlzLl9yZW5kZXJWYXJpYWJsZSh2YXJpYWJsZSkpXG4gICAgfVxuICB9XG5cbiAgX3JlbmRlclZhcmlhYmxlKGV4cHJlc3Npb246IElWYXJpYWJsZSk6ID9SZWFjdC5FbGVtZW50PGFueT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlYnVnZ2VyLWV4cHJlc3Npb24tdmFsdWUtcm93IGRlYnVnZ2VyLXNjb3BlXCIga2V5PXtleHByZXNzaW9uLm5hbWV9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlYnVnZ2VyLWV4cHJlc3Npb24tdmFsdWUtY29udGVudFwiPlxuICAgICAgICAgIDxFeHByZXNzaW9uVHJlZUNvbXBvbmVudCBleHByZXNzaW9uPXtleHByZXNzaW9ufSBjb250YWluZXJDb250ZXh0PXt0aGlzLnByb3BzLmNvbnRhaW5lckNvbnRleHR9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=