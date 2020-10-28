"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultEvaluationExpression = getDefaultEvaluationExpression;

var _atom = require("atom");

/**
Originally copied from https://github.com/Microsoft/vscode/blob/b34f17350f2d20dbbbfdb26df91dd50bb9160900/src/vs/workbench/parts/debug/electron-browser/debugHover.ts#L125-L166

MIT License

Copyright (c) 2015 - present Microsoft Corporation

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function getDefaultEvaluationExpression(editor, position) {
  const lineContent = editor.lineTextForBufferRow(position.row);
  let matchingExpression;
  let startOffset = 0; // Some example supported expressions: myVar.prop, a.b.c.d, myVar?.prop, myVar->prop, MyClass::StaticProp, *myVar
  // Match any character except a set of characters which often break interesting sub-expressions

  const expression = /([^()[\]{}<>\s+\-/%~#^;=|,`!]|->)+/g;
  let result; // First find the full expression under the cursor

  while (result = expression.exec(lineContent)) {
    const start = result.index + 1;
    const end = start + result[0].length;

    if (start <= position.column + 1 && end >= position.column + 1) {
      matchingExpression = result[0];
      startOffset = start;
      break;
    }
  } // If there are non-word characters after the cursor, we want to truncate the expression then.
  // For example in expression 'a.b.c.d', if the focus was under 'b', 'a.b' would be evaluated.


  if (matchingExpression != null) {
    const subExpression = /\w+/g;
    let subExpressionResult;

    while (subExpressionResult = subExpression.exec(matchingExpression)) {
      const subEnd = subExpressionResult.index + 1 + startOffset + subExpressionResult[0].length;

      if (subEnd >= position.column + 1) {
        break;
      }
    }

    if (subExpressionResult) {
      matchingExpression = matchingExpression.substring(0, subExpression.lastIndex);
    }
  }

  if (matchingExpression == null) {
    return null;
  }

  return {
    expression: matchingExpression,
    range: new _atom.Range([position.row, startOffset - 1], [position.row, startOffset + matchingExpression.length - 1])
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2YWx1YXRpb25FeHByZXNzaW9uLmpzIl0sIm5hbWVzIjpbImdldERlZmF1bHRFdmFsdWF0aW9uRXhwcmVzc2lvbiIsImVkaXRvciIsInBvc2l0aW9uIiwibGluZUNvbnRlbnQiLCJsaW5lVGV4dEZvckJ1ZmZlclJvdyIsInJvdyIsIm1hdGNoaW5nRXhwcmVzc2lvbiIsInN0YXJ0T2Zmc2V0IiwiZXhwcmVzc2lvbiIsInJlc3VsdCIsImV4ZWMiLCJzdGFydCIsImluZGV4IiwiZW5kIiwibGVuZ3RoIiwiY29sdW1uIiwic3ViRXhwcmVzc2lvbiIsInN1YkV4cHJlc3Npb25SZXN1bHQiLCJzdWJFbmQiLCJzdWJzdHJpbmciLCJsYXN0SW5kZXgiLCJyYW5nZSIsIlJhbmdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBNEJBOztBQTVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJTyxTQUFTQSw4QkFBVCxDQUNMQyxNQURLLEVBRUxDLFFBRkssRUFNTDtBQUNBLFFBQU1DLFdBQVcsR0FBR0YsTUFBTSxDQUFDRyxvQkFBUCxDQUE0QkYsUUFBUSxDQUFDRyxHQUFyQyxDQUFwQjtBQUNBLE1BQUlDLGtCQUFKO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLENBQWxCLENBSEEsQ0FLQTtBQUNBOztBQUNBLFFBQU1DLFVBQVUsR0FBRyxxQ0FBbkI7QUFDQSxNQUFJQyxNQUFKLENBUkEsQ0FVQTs7QUFDQSxTQUFRQSxNQUFNLEdBQUdELFVBQVUsQ0FBQ0UsSUFBWCxDQUFnQlAsV0FBaEIsQ0FBakIsRUFBZ0Q7QUFDOUMsVUFBTVEsS0FBSyxHQUFHRixNQUFNLENBQUNHLEtBQVAsR0FBZSxDQUE3QjtBQUNBLFVBQU1DLEdBQUcsR0FBR0YsS0FBSyxHQUFHRixNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVVLLE1BQTlCOztBQUVBLFFBQUlILEtBQUssSUFBSVQsUUFBUSxDQUFDYSxNQUFULEdBQWtCLENBQTNCLElBQWdDRixHQUFHLElBQUlYLFFBQVEsQ0FBQ2EsTUFBVCxHQUFrQixDQUE3RCxFQUFnRTtBQUM5RFQsTUFBQUEsa0JBQWtCLEdBQUdHLE1BQU0sQ0FBQyxDQUFELENBQTNCO0FBQ0FGLE1BQUFBLFdBQVcsR0FBR0ksS0FBZDtBQUNBO0FBQ0Q7QUFDRixHQXBCRCxDQXNCQTtBQUNBOzs7QUFDQSxNQUFJTCxrQkFBa0IsSUFBSSxJQUExQixFQUFnQztBQUM5QixVQUFNVSxhQUFhLEdBQUcsTUFBdEI7QUFDQSxRQUFJQyxtQkFBSjs7QUFDQSxXQUFRQSxtQkFBbUIsR0FBR0QsYUFBYSxDQUFDTixJQUFkLENBQW1CSixrQkFBbkIsQ0FBOUIsRUFBdUU7QUFDckUsWUFBTVksTUFBTSxHQUFHRCxtQkFBbUIsQ0FBQ0wsS0FBcEIsR0FBNEIsQ0FBNUIsR0FBZ0NMLFdBQWhDLEdBQThDVSxtQkFBbUIsQ0FBQyxDQUFELENBQW5CLENBQXVCSCxNQUFwRjs7QUFDQSxVQUFJSSxNQUFNLElBQUloQixRQUFRLENBQUNhLE1BQVQsR0FBa0IsQ0FBaEMsRUFBbUM7QUFDakM7QUFDRDtBQUNGOztBQUVELFFBQUlFLG1CQUFKLEVBQXlCO0FBQ3ZCWCxNQUFBQSxrQkFBa0IsR0FBR0Esa0JBQWtCLENBQUNhLFNBQW5CLENBQTZCLENBQTdCLEVBQWdDSCxhQUFhLENBQUNJLFNBQTlDLENBQXJCO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJZCxrQkFBa0IsSUFBSSxJQUExQixFQUFnQztBQUM5QixXQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFPO0FBQ0xFLElBQUFBLFVBQVUsRUFBRUYsa0JBRFA7QUFFTGUsSUFBQUEsS0FBSyxFQUFFLElBQUlDLFdBQUosQ0FBVSxDQUFDcEIsUUFBUSxDQUFDRyxHQUFWLEVBQWVFLFdBQVcsR0FBRyxDQUE3QixDQUFWLEVBQTJDLENBQUNMLFFBQVEsQ0FBQ0csR0FBVixFQUFlRSxXQUFXLEdBQUdELGtCQUFrQixDQUFDUSxNQUFqQyxHQUEwQyxDQUF6RCxDQUEzQztBQUZGLEdBQVA7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuT3JpZ2luYWxseSBjb3BpZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L3ZzY29kZS9ibG9iL2IzNGYxNzM1MGYyZDIwZGJiYmZkYjI2ZGY5MWRkNTBiYjkxNjA5MDAvc3JjL3ZzL3dvcmtiZW5jaC9wYXJ0cy9kZWJ1Zy9lbGVjdHJvbi1icm93c2VyL2RlYnVnSG92ZXIudHMjTDEyNS1MMTY2XG5cbk1JVCBMaWNlbnNlXG5cbkNvcHlyaWdodCAoYykgMjAxNSAtIHByZXNlbnQgTWljcm9zb2Z0IENvcnBvcmF0aW9uXG5cbkFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiovXG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSBcImF0b21cIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEV2YWx1YXRpb25FeHByZXNzaW9uKFxuICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgcG9zaXRpb246IGF0b20kUG9pbnRcbik6ID97XG4gIGV4cHJlc3Npb246IHN0cmluZyxcbiAgcmFuZ2U6IGF0b20kUmFuZ2UsXG59IHtcbiAgY29uc3QgbGluZUNvbnRlbnQgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocG9zaXRpb24ucm93KVxuICBsZXQgbWF0Y2hpbmdFeHByZXNzaW9uOiA/c3RyaW5nXG4gIGxldCBzdGFydE9mZnNldCA9IDBcblxuICAvLyBTb21lIGV4YW1wbGUgc3VwcG9ydGVkIGV4cHJlc3Npb25zOiBteVZhci5wcm9wLCBhLmIuYy5kLCBteVZhcj8ucHJvcCwgbXlWYXItPnByb3AsIE15Q2xhc3M6OlN0YXRpY1Byb3AsICpteVZhclxuICAvLyBNYXRjaCBhbnkgY2hhcmFjdGVyIGV4Y2VwdCBhIHNldCBvZiBjaGFyYWN0ZXJzIHdoaWNoIG9mdGVuIGJyZWFrIGludGVyZXN0aW5nIHN1Yi1leHByZXNzaW9uc1xuICBjb25zdCBleHByZXNzaW9uID0gLyhbXigpW1xcXXt9PD5cXHMrXFwtLyV+I147PXwsYCFdfC0+KSsvZ1xuICBsZXQgcmVzdWx0XG5cbiAgLy8gRmlyc3QgZmluZCB0aGUgZnVsbCBleHByZXNzaW9uIHVuZGVyIHRoZSBjdXJzb3JcbiAgd2hpbGUgKChyZXN1bHQgPSBleHByZXNzaW9uLmV4ZWMobGluZUNvbnRlbnQpKSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gcmVzdWx0LmluZGV4ICsgMVxuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgcmVzdWx0WzBdLmxlbmd0aFxuXG4gICAgaWYgKHN0YXJ0IDw9IHBvc2l0aW9uLmNvbHVtbiArIDEgJiYgZW5kID49IHBvc2l0aW9uLmNvbHVtbiArIDEpIHtcbiAgICAgIG1hdGNoaW5nRXhwcmVzc2lvbiA9IHJlc3VsdFswXVxuICAgICAgc3RhcnRPZmZzZXQgPSBzdGFydFxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgbm9uLXdvcmQgY2hhcmFjdGVycyBhZnRlciB0aGUgY3Vyc29yLCB3ZSB3YW50IHRvIHRydW5jYXRlIHRoZSBleHByZXNzaW9uIHRoZW4uXG4gIC8vIEZvciBleGFtcGxlIGluIGV4cHJlc3Npb24gJ2EuYi5jLmQnLCBpZiB0aGUgZm9jdXMgd2FzIHVuZGVyICdiJywgJ2EuYicgd291bGQgYmUgZXZhbHVhdGVkLlxuICBpZiAobWF0Y2hpbmdFeHByZXNzaW9uICE9IG51bGwpIHtcbiAgICBjb25zdCBzdWJFeHByZXNzaW9uID0gL1xcdysvZ1xuICAgIGxldCBzdWJFeHByZXNzaW9uUmVzdWx0XG4gICAgd2hpbGUgKChzdWJFeHByZXNzaW9uUmVzdWx0ID0gc3ViRXhwcmVzc2lvbi5leGVjKG1hdGNoaW5nRXhwcmVzc2lvbikpKSB7XG4gICAgICBjb25zdCBzdWJFbmQgPSBzdWJFeHByZXNzaW9uUmVzdWx0LmluZGV4ICsgMSArIHN0YXJ0T2Zmc2V0ICsgc3ViRXhwcmVzc2lvblJlc3VsdFswXS5sZW5ndGhcbiAgICAgIGlmIChzdWJFbmQgPj0gcG9zaXRpb24uY29sdW1uICsgMSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdWJFeHByZXNzaW9uUmVzdWx0KSB7XG4gICAgICBtYXRjaGluZ0V4cHJlc3Npb24gPSBtYXRjaGluZ0V4cHJlc3Npb24uc3Vic3RyaW5nKDAsIHN1YkV4cHJlc3Npb24ubGFzdEluZGV4KVxuICAgIH1cbiAgfVxuXG4gIGlmIChtYXRjaGluZ0V4cHJlc3Npb24gPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cHJlc3Npb246IG1hdGNoaW5nRXhwcmVzc2lvbixcbiAgICByYW5nZTogbmV3IFJhbmdlKFtwb3NpdGlvbi5yb3csIHN0YXJ0T2Zmc2V0IC0gMV0sIFtwb3NpdGlvbi5yb3csIHN0YXJ0T2Zmc2V0ICsgbWF0Y2hpbmdFeHByZXNzaW9uLmxlbmd0aCAtIDFdKSxcbiAgfVxufVxuIl19