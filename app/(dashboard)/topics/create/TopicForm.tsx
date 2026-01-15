'use client';

import { useActionState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import type { Category } from '@/lib/generated/prisma/client';
import { createTopic } from './createTopicAction';

type Props = { categories: Category[] };
export default function TopicForm({ categories }: Props) {
	const [formState, formAction, isPending] = useActionState(createTopic, {
		message: '',
		status: 'initial',
	});

	return (
		<form className="topic-form" action={formAction}>
			<div className="topic-form__section">
				<div className="form-group">
					<label className="form-group__label" htmlFor="title">
						Topic title *
					</label>
					<input
						className="form-group__input"
						type="text"
						id="title"
						name="title"
						placeholder="What do you want to talk about?"
						required
					/>
				</div>

				<div className="form-group">
					<label className="form-group__label" htmlFor="categoryId">
						Category *
					</label>
					<select
						className="form-group__select"
						name="categoryId"
						id="categoryId"
						required
					>
						<option value="">Choose category...</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				<div className="form-group">
					<label className="form-group__label" htmlFor="content">
						Message *
					</label>
					<textarea
						className="form-group__textarea"
						id="content"
						name="content"
						rows={10}
						placeholder="Write the details of your question..."
						required
					/>
				</div>
			</div>

			<div className="topic-form__footer">
				{formState.message && !isPending && (
					<div
						className={`topic-form__message topic-form__message--${formState.status}`}
					>
						{formState.message}
					</div>
				)}
				<SubmitButton />
			</div>
		</form>
	);
}
