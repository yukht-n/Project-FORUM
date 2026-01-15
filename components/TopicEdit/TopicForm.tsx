'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import type { Category, Topic } from '@/lib/generated/prisma/client';
import { createTopic, updateTopic } from './createTopicAction';

type Props = {
	categories: Category[];
	initialData?: Topic;
};
export default function TopicForm({ categories, initialData }: Props) {
	const searchParams = useSearchParams();
	const returnTo = searchParams.get('returnTo') || '/';
	const actionTopic = initialData
		? updateTopic.bind(null, initialData.id) // Or <input type="hidden" name="id" defaultValue={initialData?.id}/>
		: createTopic;
	const [formState, formAction, isPending] = useActionState(actionTopic, {
		message: '',
		status: 'initial',
	});

	const isEdit = !!initialData;

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
						defaultValue={initialData?.title}
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
						defaultValue={initialData?.categoryId}
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
						rows={12}
						defaultValue={initialData?.content}
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
				<SubmitButton readyContent={isEdit ? 'Save' : 'Create'} />
				{isEdit && <Link href={returnTo}>Cancel</Link>}
			</div>
		</form>
	);
}
