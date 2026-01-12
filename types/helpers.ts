import z from 'zod';

/* Mit dieser sehr nützlichen Hilfsfunktion kann man beliebige Bedingungen
  prüfen. Wenn die Prüfung false ergibt, wird ein Fehler geworfen. */
export function assert(condition: unknown, message = ''): asserts condition {
	if (condition === false) {
		throw new Error(message);
	}
}

/* https://www.totaltypescript.com/concepts/the-prettify-helper */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/* ZOD-Schema, dass Interger-Zahlen ab 1 erfasst und auch versucht,
andere Werte wie Strings in Ingeger-Zahlen zu verwandeln. */
export const IntegerIdSchema = z.coerce.number().int().positive();
