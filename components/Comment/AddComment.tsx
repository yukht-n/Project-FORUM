import type { FormEvent } from 'react';

type Props = {
	handleAddComment: (e: FormEvent<HTMLFormElement>) => void;
	isLoggedIn: boolean;
};
export default function AddComment({ handleAddComment, isLoggedIn }: Props) {
	return (
		<form onSubmit={handleAddComment}>
			<textarea
				name="content"
				placeholder={
					isLoggedIn
						? 'Write commentar...'
						: 'To write comments you must be logged in.'
				}
				required
			/>
			<button type="submit" disabled={!isLoggedIn}>
				Send
			</button>
		</form>
	);
}
