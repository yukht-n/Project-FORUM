import type { User as UserType } from 'better-auth';
import Image from 'next/image';

type Props = UserType;

export default function User({ name, image }: Props) {
	return (
        <div className="user-info">
            <span className="user-info__name">{name}</span>
            {image && (
                <Image
                    className="user-info__avatar"
                    src={image}
                    alt={name}
                    width={32} // 
                    height={32}
                />
            )}
        </div>
    );
}
