import { capitalize } from 'es-toolkit';
import { IntegerIdSchema } from '@/types/helpers';

/**
 * validateHeadingLevel(level: number, sanitizeIfOutOfRange?: boolean): number
 *
 * Validate and optionally sanitize an HTML heading level.
 *
 * Returns the provided heading level when it is an integer in the range 1–6.
 * If the level is not an integer, an Error is thrown. If the level is outside
 * the 1–6 range and sanitizeIfOutOfRange is true (default), the value is clamped
 * to the nearest valid value (1 or 6) and a console.warn is emitted. If the
 * level is outside the range and sanitizeIfOutOfRange is false, an Error is thrown.
 *
 * @param level - The heading level to validate (expected integer).
 * @param sanitizeIfOutOfRange - When true, out-of-range values are sanitized
 *                                (clamped to 1 or 6) and a warning is logged.
 *                                When false, out-of-range values cause an Error.
 *                                Defaults to true.
 * @returns A valid heading level between 1 and 6 (inclusive).
 *
 * @example
 * const lvl: number = validateHeadingLevel(3); // -> 3
 *
 * @example
 * const sanitized: number = validateHeadingLevel(0); // -> 1 (and logs a warning)
 *
 * @example
 * validateHeadingLevel(7, false); // -> throws Error
 */
export function validateHeadingLevel(
	level: number,
	sanitizeIfOutOfRange = true,
) {
	if ([1, 2, 3, 4, 5, 6].includes(level)) {
		return level;
	}

	if (!Number.isInteger(level)) {
		throw Error(`Heading levis is not an integer: ${level}:`);
	}

	if (!sanitizeIfOutOfRange) {
		throw Error(`Heading level is out of range: ${level}`);
	}

	if (level < 1) {
		console.warn(`Heading level was lower than 1: ${level}`);
		return 1;
	}

	if (level > 6) {
		console.warn(`Heading level was higher than 6: ${level}`);
		return 6;
	}

	return level;
}

/**
 * isVisible(show: unknown): 'visible' | 'hidden'
 *
 * Returns a CSS visibility value for the Activity component.
 *
 * @param show - When truthy, the Activity component should be visible; when falsy, it should be hidden.
 * @returns 'visible' | 'hidden' A CSS visibility string to apply to the component.
 *
 * @example
 * const v: 'visible' | 'hidden' = isVisible(true); // -> 'visible'
 */
export function isVisible(show: unknown) {
	return show ? 'visible' : 'hidden';
}

/**
 * getFormattedPrice(price: number, options?: { currency?: string; divider?: number; locale?: string }): string
 *
 * Formats a price value as a localized currency string using Intl.NumberFormat.
 *
 * @param price - The price value to format (will be divided by divider).
 * @param options - Formatting options.
 * @param options.currency - ISO 4217 currency code (default: 'EUR').
 * @param options.divider - Divisor to convert price to currency units (e.g., 100 for cents) (default: 100).
 * @param options.locale - BCP 47 locale tag (defaults to document language or 'de-DE').
 * @returns The formatted currency string.
 *
 * @example
 * // Format 1000 cents as EUR in de-DE locale
 * const formattedPrice: string = getFormattedPrice(1000);
 * // -> '10,00 €'
 *
 * @example
 * // Format with custom options
 * const formattedPrice: string = getFormattedPrice(2500, { currency: 'USD', locale: 'en-US' });
 * // -> '$25.00'
 */
export function getFormattedPrice(
	price: number,
	options: { currency?: string; divider?: number; locale?: string } = {},
) {
	const { currency = 'EUR', divider = 100, locale = 'de-DE' } = options;

	return new Intl.NumberFormat(locale, { currency, style: 'currency' }).format(
		price / divider,
	);
}

/**
 * wait(ms: number): Promise<void>
 *
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - Number of milliseconds to wait before resolving.
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * await wait(500); // pauses for 500ms
 */
export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns the current URL as a `URL` object.
 *
 * @returns URL The current URL.
 */
export function getCurrentUrl() {
	return new URL(window.location.href);
}

/**
 * getIdFromSlug(slug: string): number
 *
 * Extracts the numeric ID from a slug where the ID is the last hyphen-separated segment.
 *
 * @param slug - Slug string (e.g. "some-product-name-123").
 * @returns The parsed integer ID, or NaN if the last segment is not a valid integer.
 *
 * @example
 * const id: number = getIdFromSlug('product-name-42'); // -> 42
 */
export function getIdFromSlug(slug: string): number {
	const id = slug.split('-').at(-1);

	const { success, data } = IntegerIdSchema.safeParse(id);

	return success ? data : NaN;
}

export function getUserLocation(): Promise<GeolocationPosition> {
	// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
	const options: PositionOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	};

	/* Die ältere geolocation-API basiert auf Callback-Funktionen statt
      Promises. Hier wird sie in ein Promise verpackt, um sie in asynchronen
      Funktionen nutzen zu können. */
	return new Promise((resolve, reject) => {
		window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
}

/* Die exakte Berechnung der Distanz zwischen zwei Koordinaten ist nicht ganz trivial, da
die Erde keine perfekte Kugel ist. Für die meisten Anwendungsfälle liefert die
"Haversine-Formel" ausreichend genaue Ergebnisse. Hier eine leicht angepasste
Version dieser Implementierung: http://www.geodatasource.com/developers/javascript
Auf der Seite findet man auch Versionen für andere Sprachen, z.B. PHP. */
export function getDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
	unit: 'K' | 'N' | 'M' = 'K',
) {
	if (lat1 === lat2 && lon1 === lon2) {
		return 0;
	}

	const radlat1 = (Math.PI * lat1) / 180;
	const radlat2 = (Math.PI * lat2) / 180;
	const theta = lon1 - lon2;
	const radtheta = (Math.PI * theta) / 180;
	let dist =
		Math.sin(radlat1) * Math.sin(radlat2) +
		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = (dist * 180) / Math.PI;
	dist *= 60 * 1.1515; // Ergibt Entfernung in Meilen
	// Ggf. Umrechnung in Kilometer oder nautische Meilen
	if (unit === 'K') {
		dist *= 1.609344;
	} else if (unit === 'N') {
		dist *= 0.8684;
	}
	return dist;
}

export function getShopCategoryName(originalName: string) {
	return decodeURIComponent(originalName)
		.replaceAll('_', ' ')
		.split(' ')
		.map(capitalize)
		.join(' ');
}
