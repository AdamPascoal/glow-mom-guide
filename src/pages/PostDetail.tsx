import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

interface Post {
  id: string;
  tag: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  username: string;
  avatar: string;
  timestamp: string;
}

const mockPost: Post = {
  id: '1',
  tag: 'Trimester 2 Support',
  content: 'Just felt the first real flutter! 😊 So surreal and beautiful. Any other mamas experience this early on? Share your stories!',
  likes: 85,
  comments: 12,
  isLiked: false,
  username: 'MommaBearSarah',
  avatar: '/placeholder.svg',
  timestamp: '2 hours ago',
};

const mockComments: Comment[] = [
  {
    id: '1',
    username: 'WiseMamaJoy',
    content: 'Oh, absolutely! It\'s such a magical feeling. Mine felt like tiny bubbles at first. Enjoy every moment!',
    timestamp: '1 hour ago',
    likes: 19,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        username: 'NewMamaLiz',
        content: 'Mine was more like a popcorn pop! So exciting. Congrats, Sarah!',
        timestamp: '30m',
        likes: 10,
        isLiked: false,
        replies: []
      }
    ]
  },
  {
    id: '2',
    username: 'DadToBeMark',
    content: 'My wife just started feeling this too! We\'re so thrilled. Any tips for partners on how to feel more connected?',
    timestamp: '45 minutes ago',
    likes: 10,
    isLiked: false,
    replies: []
  },
  {
    id: '3',
    username: 'FutureMomGrace',
    content: 'Can\'t wait to feel this myself! So beautiful to hear your experiences. 💕',
    timestamp: '30 minutes ago',
    likes: 10,
    isLiked: false,
    replies: []
  }
];

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post>(mockPost);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleCommentLike = (commentId: string) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateComments(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(updateComments(comments));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      username: 'You',
      content: newComment,
      timestamp: 'now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
    
    toast({
      title: "Comment posted! 💬",
      description: "Your comment has been added to the discussion.",
    });
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      username: 'You',
      content: replyText,
      timestamp: 'now',
      likes: 0,
      isLiked: false,
      replies: []
    };

    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      });
    };

    setComments(updateComments(comments));
    setReplyText('');
    setReplyingTo(null);
    
    toast({
      title: "Reply posted! 💬",
      description: "Your reply has been added.",
    });
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12 mt-3' : 'mb-4'}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs flex-shrink-0">
          {comment.username.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="font-medium text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => {
                const userSlug = comment.username.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                navigate(`/user/${userSlug}`);
              }}
            >
              {comment.username}
            </span>
            <span className="text-gray-500 text-xs">{comment.timestamp}</span>
            <Button variant="ghost" size="sm" className="p-1 ml-auto">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-800 text-sm leading-relaxed mb-2">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleCommentLike(comment.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-gray-500 hover:text-blue-500 transition-colors font-medium"
            >
              Reply
            </button>
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3">
              <Textarea
                placeholder={`Reply to ${comment.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="text-sm mb-2"
                rows={2}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Post</h1>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Card className="p-4 mb-6">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-medium text-sm">
              {post.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <span 
                    className="font-medium text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() => {
                      const userSlug = post.username.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      navigate(`/user/${userSlug}`);
                    }}
                  >
                    {post.username}
                  </span>
                  <p className="text-gray-500 text-xs">{post.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed text-sm">
              {post.content}
            </p>
            
            {post.image && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt="Post attachment"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-6 text-gray-500 pt-3 border-t border-gray-100">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${
                  post.isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span className="text-sm">{post.likes}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.comments}</span>
            </button>

            <button className="hover:text-blue-500 transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Comment Input */}
        <Card className="p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs flex-shrink-0">
              Y
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-sm mb-3 border-none shadow-none p-0 focus-visible:ring-0 resize-none min-h-[20px]"
                rows={1}
              />
              <Button 
                size="sm" 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Comment
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments */}
        <div className="space-y-1">
          {comments.map(comment => renderComment(comment))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;