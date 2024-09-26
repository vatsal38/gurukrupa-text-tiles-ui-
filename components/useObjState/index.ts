import React, { useState } from "react";

/**
 *
 * @param {object} initialState
 * @returns {[object, Function]}
 */
function useObjState(initialState: any) {
  const [state, setState] = useState(initialState);

  function handleState(key: any, value: any) {
    setState((prevObj: any) => ({ ...prevObj, [key]: value }));
  }

  function clearState() {
    setState(initialState);
  }

  return [state, setState, handleState, clearState];
}

export default useObjState;
