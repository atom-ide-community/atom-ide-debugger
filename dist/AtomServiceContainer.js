"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConsoleService = setConsoleService;
exports.getConsoleService = getConsoleService;
exports.setConsoleRegisterExecutor = setConsoleRegisterExecutor;
exports.getConsoleRegisterExecutor = getConsoleRegisterExecutor;
exports.setDatatipService = setDatatipService;
exports.getDatatipService = getDatatipService;
exports.setNotificationService = setNotificationService;
exports.getNotificationService = getNotificationService;
exports.setTerminalService = setTerminalService;
exports.getTerminalService = getTerminalService;
exports.setRpcService = setRpcService;
exports.isNuclideEnvironment = isNuclideEnvironment;
exports.addDebugConfigurationProvider = addDebugConfigurationProvider;
exports.resolveDebugConfiguration = resolveDebugConfiguration;

var _UniversalDisposable = _interopRequireDefault(require("@atom-ide-community/nuclide-commons/UniversalDisposable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _raiseNativeNotification = null;
let _registerExecutor = null;
let _datatipService = null;
let _createConsole = null;
let _terminalService = null;
let _rpcService = null;

const _configurationProviders = new Map();

function setConsoleService(createConsole) {
  _createConsole = createConsole;
  return new _UniversalDisposable.default(() => {
    _createConsole = null;
  });
}

function getConsoleService() {
  return _createConsole;
}

function setConsoleRegisterExecutor(registerExecutor) {
  _registerExecutor = registerExecutor;
  return new _UniversalDisposable.default(() => {
    _registerExecutor = null;
  });
}

function getConsoleRegisterExecutor() {
  return _registerExecutor;
}

function setDatatipService(datatipService) {
  _datatipService = datatipService;
  return new _UniversalDisposable.default(() => {
    _datatipService = null;
  });
}

function getDatatipService() {
  return _datatipService;
}

function setNotificationService(raiseNativeNotification) {
  _raiseNativeNotification = raiseNativeNotification;
}

function getNotificationService() {
  return _raiseNativeNotification;
}

function setTerminalService(terminalService) {
  _terminalService = terminalService;
  return new _UniversalDisposable.default(() => {
    _terminalService = null;
  });
}

function getTerminalService() {
  return _terminalService;
}

function setRpcService(rpcService) {
  _rpcService = rpcService;
  return new _UniversalDisposable.default(() => {
    _rpcService = null;
  });
}

function isNuclideEnvironment() {
  return _rpcService != null;
}

function addDebugConfigurationProvider(provider) {
  const existingProvider = _configurationProviders.get(provider.adapterType);

  if (existingProvider != null) {
    throw new Error("Debug Configuration Provider already exists for adapter type: " + provider.adapterType);
  }

  _configurationProviders.set(provider.adapterType, provider);

  return new _UniversalDisposable.default(() => {
    _configurationProviders.delete(provider.adapterType);
  });
}

async function resolveDebugConfiguration(configuration) {
  const existingProvider = _configurationProviders.get(configuration.adapterType);

  return existingProvider != null ? existingProvider.resolveConfiguration(configuration) : configuration;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF0b21TZXJ2aWNlQ29udGFpbmVyLmpzIl0sIm5hbWVzIjpbIl9yYWlzZU5hdGl2ZU5vdGlmaWNhdGlvbiIsIl9yZWdpc3RlckV4ZWN1dG9yIiwiX2RhdGF0aXBTZXJ2aWNlIiwiX2NyZWF0ZUNvbnNvbGUiLCJfdGVybWluYWxTZXJ2aWNlIiwiX3JwY1NlcnZpY2UiLCJfY29uZmlndXJhdGlvblByb3ZpZGVycyIsIk1hcCIsInNldENvbnNvbGVTZXJ2aWNlIiwiY3JlYXRlQ29uc29sZSIsIlVuaXZlcnNhbERpc3Bvc2FibGUiLCJnZXRDb25zb2xlU2VydmljZSIsInNldENvbnNvbGVSZWdpc3RlckV4ZWN1dG9yIiwicmVnaXN0ZXJFeGVjdXRvciIsImdldENvbnNvbGVSZWdpc3RlckV4ZWN1dG9yIiwic2V0RGF0YXRpcFNlcnZpY2UiLCJkYXRhdGlwU2VydmljZSIsImdldERhdGF0aXBTZXJ2aWNlIiwic2V0Tm90aWZpY2F0aW9uU2VydmljZSIsInJhaXNlTmF0aXZlTm90aWZpY2F0aW9uIiwiZ2V0Tm90aWZpY2F0aW9uU2VydmljZSIsInNldFRlcm1pbmFsU2VydmljZSIsInRlcm1pbmFsU2VydmljZSIsImdldFRlcm1pbmFsU2VydmljZSIsInNldFJwY1NlcnZpY2UiLCJycGNTZXJ2aWNlIiwiaXNOdWNsaWRlRW52aXJvbm1lbnQiLCJhZGREZWJ1Z0NvbmZpZ3VyYXRpb25Qcm92aWRlciIsInByb3ZpZGVyIiwiZXhpc3RpbmdQcm92aWRlciIsImdldCIsImFkYXB0ZXJUeXBlIiwiRXJyb3IiLCJzZXQiLCJkZWxldGUiLCJyZXNvbHZlRGVidWdDb25maWd1cmF0aW9uIiwiY29uZmlndXJhdGlvbiIsInJlc29sdmVDb25maWd1cmF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BOzs7O0FBU0EsSUFBSUEsd0JBQXNELEdBQUcsSUFBN0Q7QUFDQSxJQUFJQyxpQkFBNEMsR0FBRyxJQUFuRDtBQUNBLElBQUlDLGVBQWdDLEdBQUcs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QixHQUEyQkEsZ0JBQWdCLENBQUNRLG9CQUFqQixDQUFzQ0QsYUFBdEMsQ0FBM0IsR0FBa0ZBLGFBQXpGO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERhdGF0aXBTZXJ2aWNlLCBDb25zb2xlU2VydmljZSwgUmVnaXN0ZXJFeGVjdXRvckZ1bmN0aW9uLCBUZXJtaW5hbEFwaSB9IGZyb20gXCJhdG9tLWlkZS11aVwiXG5pbXBvcnQgdHlwZSB7XG4gIERlYnVnZ2VyQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuICBJUHJvY2Vzc0NvbmZpZyxcbiAgVnNBZGFwdGVyVHlwZSxcbn0gZnJvbSBcIkBhdG9tLWlkZS1jb21tdW5pdHkvbnVjbGlkZS1kZWJ1Z2dlci1jb21tb25cIlxuXG5pbXBvcnQgVW5pdmVyc2FsRGlzcG9zYWJsZSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMvVW5pdmVyc2FsRGlzcG9zYWJsZVwiXG5cbnR5cGUgcmFpc2VOYXRpdmVOb3RpZmljYXRpb25GdW5jID0gPyhcbiAgdGl0bGU6IHN0cmluZyxcbiAgYm9keTogc3RyaW5nLFxuICB0aW1lb3V0OiBudW1iZXIsXG4gIHJhaXNlSWZBdG9tSGFzRm9jdXM6IGJvb2xlYW5cbikgPT4gP0lEaXNwb3NhYmxlXG5cbmxldCBfcmFpc2VOYXRpdmVOb3RpZmljYXRpb246ID9yYWlzZU5hdGl2ZU5vdGlmaWNhdGlvbkZ1bmMgPSBudWxsXG5sZXQgX3JlZ2lzdGVyRXhlY3V0b3I6ID9SZWdpc3RlckV4ZWN1dG9yRnVuY3Rpb24gPSBudWxsXG5sZXQgX2RhdGF0aXBTZXJ2aWNlOiA/RGF0YXRpcFNlcnZpY2UgPSBudWxsXG5sZXQgX2NyZWF0ZUNvbnNvbGU6ID9Db25zb2xlU2VydmljZSA9IG51bGxcbmxldCBfdGVybWluYWxTZXJ2aWNlOiA/VGVybWluYWxBcGkgPSBudWxsXG5sZXQgX3JwY1NlcnZpY2U6ID9udWNsaWRlJFJwY1NlcnZpY2UgPSBudWxsXG5jb25zdCBfY29uZmlndXJhdGlvblByb3ZpZGVyczogTWFwPFZzQWRhcHRlclR5cGUsIERlYnVnZ2VyQ29uZmlndXJhdGlvblByb3ZpZGVyPiA9IG5ldyBNYXAoKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29uc29sZVNlcnZpY2UoY3JlYXRlQ29uc29sZTogQ29uc29sZVNlcnZpY2UpOiBJRGlzcG9zYWJsZSB7XG4gIF9jcmVhdGVDb25zb2xlID0gY3JlYXRlQ29uc29sZVxuICByZXR1cm4gbmV3IFVuaXZlcnNhbERpc3Bvc2FibGUoKCkgPT4ge1xuICAgIF9jcmVhdGVDb25zb2xlID0gbnVsbFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uc29sZVNlcnZpY2UoKTogP0NvbnNvbGVTZXJ2aWNlIHtcbiAgcmV0dXJuIF9jcmVhdGVDb25zb2xlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb25zb2xlUmVnaXN0ZXJFeGVjdXRvcihyZWdpc3RlckV4ZWN1dG9yOiBSZWdpc3RlckV4ZWN1dG9yRnVuY3Rpb24pOiBJRGlzcG9zYWJsZSB7XG4gIF9yZWdpc3RlckV4ZWN1dG9yID0gcmVnaXN0ZXJFeGVjdXRvclxuICByZXR1cm4gbmV3IFVuaXZlcnNhbERpc3Bvc2FibGUoKCkgPT4ge1xuICAgIF9yZWdpc3RlckV4ZWN1dG9yID0gbnVsbFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uc29sZVJlZ2lzdGVyRXhlY3V0b3IoKTogP1JlZ2lzdGVyRXhlY3V0b3JGdW5jdGlvbiB7XG4gIHJldHVybiBfcmVnaXN0ZXJFeGVjdXRvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YXRpcFNlcnZpY2UoZGF0YXRpcFNlcnZpY2U6IERhdGF0aXBTZXJ2aWNlKTogSURpc3Bvc2FibGUge1xuICBfZGF0YXRpcFNlcnZpY2UgPSBkYXRhdGlwU2VydmljZVxuICByZXR1cm4gbmV3IFVuaXZlcnNhbERpc3Bvc2FibGUoKCkgPT4ge1xuICAgIF9kYXRhdGlwU2VydmljZSA9IG51bGxcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGF0aXBTZXJ2aWNlKCk6ID9EYXRhdGlwU2VydmljZSB7XG4gIHJldHVybiBfZGF0YXRpcFNlcnZpY2Vcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE5vdGlmaWNhdGlvblNlcnZpY2UocmFpc2VOYXRpdmVOb3RpZmljYXRpb246IHJhaXNlTmF0aXZlTm90aWZpY2F0aW9uRnVuYyk6IHZvaWQge1xuICBfcmFpc2VOYXRpdmVOb3RpZmljYXRpb24gPSByYWlzZU5hdGl2ZU5vdGlmaWNhdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm90aWZpY2F0aW9uU2VydmljZSgpOiA/cmFpc2VOYXRpdmVOb3RpZmljYXRpb25GdW5jIHtcbiAgcmV0dXJuIF9yYWlzZU5hdGl2ZU5vdGlmaWNhdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VGVybWluYWxTZXJ2aWNlKHRlcm1pbmFsU2VydmljZTogVGVybWluYWxBcGkpOiBJRGlzcG9zYWJsZSB7XG4gIF90ZXJtaW5hbFNlcnZpY2UgPSB0ZXJtaW5hbFNlcnZpY2VcbiAgcmV0dXJuIG5ldyBVbml2ZXJzYWxEaXNwb3NhYmxlKCgpID0+IHtcbiAgICBfdGVybWluYWxTZXJ2aWNlID0gbnVsbFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVybWluYWxTZXJ2aWNlKCk6ID9UZXJtaW5hbEFwaSB7XG4gIHJldHVybiBfdGVybWluYWxTZXJ2aWNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRScGNTZXJ2aWNlKHJwY1NlcnZpY2U6IG51Y2xpZGUkUnBjU2VydmljZSk6IElEaXNwb3NhYmxlIHtcbiAgX3JwY1NlcnZpY2UgPSBycGNTZXJ2aWNlXG4gIHJldHVybiBuZXcgVW5pdmVyc2FsRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgX3JwY1NlcnZpY2UgPSBudWxsXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc051Y2xpZGVFbnZpcm9ubWVudCgpOiBib29sZWFuIHtcbiAgcmV0dXJuIF9ycGNTZXJ2aWNlICE9IG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZERlYnVnQ29uZmlndXJhdGlvblByb3ZpZGVyKHByb3ZpZGVyOiBEZWJ1Z2dlckNvbmZpZ3VyYXRpb25Qcm92aWRlcik6IElEaXNwb3NhYmxlIHtcbiAgY29uc3QgZXhpc3RpbmdQcm92aWRlciA9IF9jb25maWd1cmF0aW9uUHJvdmlkZXJzLmdldChwcm92aWRlci5hZGFwdGVyVHlwZSlcbiAgaWYgKGV4aXN0aW5nUHJvdmlkZXIgIT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkRlYnVnIENvbmZpZ3VyYXRpb24gUHJvdmlkZXIgYWxyZWFkeSBleGlzdHMgZm9yIGFkYXB0ZXIgdHlwZTogXCIgKyBwcm92aWRlci5hZGFwdGVyVHlwZSlcbiAgfVxuICBfY29uZmlndXJhdGlvblByb3ZpZGVycy5zZXQocHJvdmlkZXIuYWRhcHRlclR5cGUsIHByb3ZpZGVyKVxuICByZXR1cm4gbmV3IFVuaXZlcnNhbERpc3Bvc2FibGUoKCkgPT4ge1xuICAgIF9jb25maWd1cmF0aW9uUHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlci5hZGFwdGVyVHlwZSlcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVEZWJ1Z0NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbjogSVByb2Nlc3NDb25maWcpOiBQcm9taXNlPElQcm9jZXNzQ29uZmlnPiB7XG4gIGNvbnN0IGV4aXN0aW5nUHJvdmlkZXIgPSBfY29uZmlndXJhdGlvblByb3ZpZGVycy5nZXQoY29uZmlndXJhdGlvbi5hZGFwdGVyVHlwZSlcbiAgcmV0dXJuIGV4aXN0aW5nUHJvdmlkZXIgIT0gbnVsbCA/IGV4aXN0aW5nUHJvdmlkZXIucmVzb2x2ZUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgOiBjb25maWd1cmF0aW9uXG59XG4iXX0=