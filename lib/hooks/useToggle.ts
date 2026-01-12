import { useCallback, useDebugValue, useState } from 'react';

export function useToggle(initialState: boolean) {
	const [state, setState] = useState(initialState);

	const toggle = useCallback(
		() => setState((currentState) => !currentState),
		[],
	);

	const setTrue = useCallback(() => setState(true), []);
	const setFalse = useCallback(() => setState(false), []);
	const reset = useCallback(() => setState(initialState), [initialState]);

	useDebugValue(state, (state) => state);

	return [state, toggle, setState, setTrue, setFalse, reset] as const;
}
