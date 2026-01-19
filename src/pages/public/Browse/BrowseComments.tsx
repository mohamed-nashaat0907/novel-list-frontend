import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../axios/axios.config";
import { type CommentUser } from "../../../data/interfaces";
import Rating from "../../../components/ui/Rating";
interface IComment {
    _id: string;
    userId: CommentUser;
    comment: string;
    rate: number;
    createdAt: string;
}

interface BrowseCommentsProps {
    bookId: string;
}

const BrowseComments = ({ bookId }: BrowseCommentsProps) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["comments", bookId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/comments/${bookId}`);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 دقائق
    });

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p>Failed to load comments</p>;

    const comments: IComment[] = data?.comments ?? [];

    if (comments.length === 0) return <p className="text-gray-500">لا توجد تعليقات حتى الآن</p>;

    return (
        <div className="mt-4 border-t pt-4">
            <h3 className="font-bold mb-2">التعليقات:</h3>
            <div className="flex flex-col gap-3">
                {comments.map(({ _id, userId, comment, rate, createdAt }) => (
                    <div key={_id} className="border p-3 rounded-md bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{userId.name}</span>
                            <span className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mb-1">{comment}</p>
                        <Rating value={rate} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowseComments;
