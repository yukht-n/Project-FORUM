import { useDebugValue, useEffect, useState } from 'react';

// https://dmitripavlutin.com/controlled-inputs-using-react-hooks/
export function useDebouncedValue<ValueType>(value: ValueType, wait: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebouncedValue(value), wait);
		return () => clearTimeout(id);
	}, [value, wait]);

	useDebugValue({ value, debouncedValue }, (data) => data);

	return debouncedValue;
}
