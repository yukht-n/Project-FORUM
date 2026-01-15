'use client';
import Image from 'next/image';
import { type FormEventHandler, startTransition, useOptimistic } from 'react';
import z from 'zod';
import type { Comment } from '@/lib/generated/prisma/client';
import AddComment from './AddComment';
import { serverAddCommentAction } from './commentActions';
import { authClient } from '@/lib/auth-client';

type Props = {
	topicId: string;
	initialComments: CommentWithAuthor[];
	parentId?: string | null;
	topicSlug: string;
};
type CommentWithAuthor = Omit<Comment, 'authorId'> & { author: Author };
type Author = {
	name: string;
	image: string | null | undefined;
};

export default function Comments({
	topicId,
	initialComments,
	parentId = null,
	topicSlug,
}: Props) {
	const [optimisticComments, optimisticCommentsDispatch] = useOptimistic(
		initialComments,
		optimisticReducer,
	);
	const { data, isPending } = authClient.useSession();
	const author = data?.user
		? { name: data.user.name, image: data.user.image }
		: null;
	const handleAddComment: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!author) return;
		const commentForm = e.currentTarget;
		const content = z
			.string()
			.trim()
			.min(1)
			.max(200)
			.parse(commentForm.content.value);
		commentForm.reset();

		const newComment = { content, topicId, parentId };
		startTransition(() => {
			optimisticCommentsDispatch({
				action: 'add',
				newComment: { ...newComment, author },
			});
		});

		await serverAddCommentAction(newComment, topicSlug);
	};
	return (
		<div className="comments-container">
			<AddComment handleAddComment={handleAddComment} isLoggedIn={!!author} />

			<div className="comments-list">
				{optimisticComments.map((comment) => (
					<article key={comment.id} className="comment">
						<div className="comment__header">
							{comment.author.image && (
								<Image
									src={comment.author.image}
									alt={`${comment.author.name} avatar`}
									width={40}
									height={40}
									className="comment__avatar"
								/>
							)}
							<div className="comment__meta">
								<span className="comment__author-name">
									{comment.author.name}
								</span>
								<span className="comment__date">
									{comment.createdAt.toLocaleTimeString('de-DE', {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>
						</div>
						<div className="comment__body">
							<p className="comment__text">{comment.content}</p>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

function optimisticReducer(
	comments: CommentWithAuthor[],
	message: {
		action: 'add';
		newComment: {
			content: string;
			topicId: string;
			parentId: string | null;
			author: Author;
		};
	},
) {
	switch (message.action) {
		case 'add': {
			const date = new Date();
			return [
				{
					...message.newComment,
					createdAt: date,
					updatedAt: date,
					id: `${date.toJSON()}-${message.newComment.author.name}`,
				},
				...comments,
			];
		}
	}
}
