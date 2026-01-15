'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

/* Beide Arten, Attribute zu typisieren, funktionieren. Wir nutzen die kürzere
Variante. Man könnte noch mit ComponentPropsWithRef oder ComponentPropsWithoutRef
explizit festlegen, ob das ref-Attribut erlaubt ist, das ist aber für die meisten
Fälle nicht nötig. Details hier: https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#wrappingmirroring */

/* type Props = {
	readyContent?: ReactNode;
	pendingContent?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>; */

type Props = {
	readyContent?: ReactNode;
	pendingContent?: ReactNode;
} & ComponentProps<'button'>;

export default function SubmitButton({
	readyContent = 'Absenden',
	pendingContent = 'Warten…',
	...props
}: Props) {
	/* 
Der useFormStatus-Hook kann nur in einer Komponente genutzt werden,
die eine Kind-Komponente eines Formulars ist. Seit useActionState
auch den pending-Status zurückgibt, ist useFormStatus noch
weniger nützlich als ohnehin.

Der Button soll disabled sein, wenn pending true ist.
Im Button soll als default "Absenden" oder "Warten…" stehen, je
nachdem, ob pending false oder true ist.
Der Inhalt des Buttons soll aber konfigurierbar sein,  nutzt
dafür zwei Props: readyContent und pendingContent. Diese sollen
alles enthalten können, was in React dargestellt werden kann.
Bonus: Der Button soll alle erlaubten Attribute erhalten können.
*/
	const { pending } = useFormStatus();
	return (
		<button {...props} type="submit" disabled={pending}>
			{pending ? pendingContent : readyContent}
		</button>
	);
}
