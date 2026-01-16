'use client';
import Image from 'next/image';
import {
	type FormEventHandler,
	startTransition,
	useEffect,
	useOptimistic,
	useRef,
	useState,
} from 'react';
import z from 'zod';
import { authClient } from '@/lib/auth-client';
import type { Comment } from '@/lib/generated/prisma/client';
import AddComment from './AddComment';
import {
	serverAddCommentAction,
	serverDeleteCommentAction,
	serverUpdateCommentAction,
} from './commentActions';
import type { Session } from '@/auth';

type Props = {
	topicId: string;
	initialComments: CommentWithAuthor[];
	parentId?: string | null;
	topicSlug: string;
};
type CommentWithAuthor = Comment & { author: Author };
type Author = {
	name: string;
	image: string | null | undefined;
};
const CommentsContentSchema = z.string().trim().min(1).max(200);

export default function Comments({
	topicId,
	initialComments,
	parentId = null,
	topicSlug,
}: Props) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [optimisticComments, optimisticCommentsDispatch] = useOptimistic(
		initialComments,
		optimisticReducer,
	);
	const inputRef = useRef<HTMLTextAreaElement>(null!);
	const { data } = authClient.useSession() as {
		data: Session | null;
		isPending: boolean;
	};

	/* Users Status */
	const author = data?.user
		? {
				name: data.user.name,
				image: data.user.image,
				id: data.user.id,
				role: data.user.role,
			}
		: null;

	const isEditor =
		data?.user.role === 'MODERATOR' || data?.user.role === 'ADMIN';

	/*ADD COMENTAR*/
	const handleAddComment: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		if (!author) return;
		const commentForm = e.currentTarget;
		const content = CommentsContentSchema.parse(commentForm.content.value);
		commentForm.reset();

		const newComment = { content, topicId, parentId, authorId: author.id };
		startTransition(() => {
			optimisticCommentsDispatch({
				action: 'add',
				newComment: { ...newComment, author },
			});
		});

		await serverAddCommentAction(newComment, topicSlug);
	};

	/*Update COMENTAR*/
	const handleUpdateComment = async (id: string, formData: FormData) => {
		const newContent = CommentsContentSchema.parse(formData.get('content'));
		setEditingId(null);
		startTransition(() => {
			optimisticCommentsDispatch({ action: 'edit', id, newContent });
		});

		await serverUpdateCommentAction(id, newContent);
	};

	/*DELETE COMENTAR*/
	const handleDeleteComment = async (id: string) => {
		startTransition(() => {
			optimisticCommentsDispatch({
				action: 'delete',
				deleteCommentId: id,
			});
		});

		await serverDeleteCommentAction(id);
	};

	useEffect(() => {
		if (editingId) {
			inputRef.current.focus();
		}
	}, [editingId]);

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

							{/* Edit Buttons */}

							{(isEditor || comment.authorId === author?.id) && (
								<div>
									<button
										type="button"
										onClick={() =>
											setEditingId((value) => (value ? null : comment.id))
										}
									>
										{editingId === comment.id ? '❌' : '🖋️'}
									</button>

									<button
										type="button"
										onClick={() => handleDeleteComment(comment.id)}
									>
										🗑️
									</button>
								</div>
							)}

							{/* END Edit Buttons */}
						</div>
						<div className="comment__body">
							{editingId === comment.id ? (
								/* EDITING FORM */
								<form
									action={(FormData) =>
										handleUpdateComment(comment.id, FormData)
									}
									className="comment__edit-form"
								>
									<textarea
										name="content"
										defaultValue={comment.content}
										ref={inputRef}
										className="comment__edit-textarea"
									/>
									<div className="comment__edit-buttons">
										<button type="submit">Save</button>
									</div>
								</form>
							) : (
								<p className="comment__text">{comment.content}</p>
							)}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

function optimisticReducer(
	comments: CommentWithAuthor[],
	message:
		| {
				action: 'add';
				newComment: {
					content: string;
					topicId: string;
					parentId: string | null;
					authorId: string;
					author: Author;
				};
		  }
		| { action: 'delete'; deleteCommentId: string }
		| { action: 'edit'; id: string; newContent: string },
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
		case 'delete':
			return comments.filter(({ id }) => id !== message.deleteCommentId);
		case 'edit':
			return comments.map((comment) =>
				comment.id === message.id
					? { ...comment, content: message.newContent }
					: comment,
			);
	}
}
