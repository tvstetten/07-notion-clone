// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
//     typeof define === 'function' && define.amd ? define(['react'], factory) :
//       (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.useWindowSize = factory(global.React));
// }(this, (function (react) {
//   'use strict';

import React from "react";

/**
 * useIsomorphicEffect
 * Resolves to useEffect when "window" is not in scope and useLayout effect in the browser
 * @param {function} callback Callback function to be called on mount
 */
const useIsomorphicEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const nullDimensions = {
  innerWidth: null,
  innerHeight: null,
  outerWidth: null,
  outerHeight: null
};

export function getDimensions() {
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight
  };
}
/**
 * useWindowSize hook
 * A hook that provides information of the dimensions of the window
 * @return Dimensions of the window
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getDimensions();
    }
    else {
      return nullDimensions;
    }
  });
  // set resize handler once on mount and clean before unmount
  useIsomorphicEffect(() => {
    function onResize() {
      setWindowSize(getDimensions());
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return windowSize;
}
