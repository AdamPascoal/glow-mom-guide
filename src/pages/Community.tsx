import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, Search, Plus, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePostModal } from '@/components/CreatePostModal';
import { useToast } from '@/hooks/use-toast';

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

const mockPosts: Post[] = [
  {
    id: '1',
    tag: 'Trimester 2 Support',
    content: 'Feeling overwhelmed by the sheer volume of baby gear out there! Any recommendations for must-have items that truly made a difference for you? Trying to keep it minimalist but practical. 🙏',
    likes: 85,
    comments: 12,
    isLiked: false,
    username: 'Nurturing Nest',
    avatar: '/placeholder.svg',
    timestamp: '2h',
  },
  {
    id: '2',
    tag: 'New Moms Connect',
    content: 'Just hit 28 weeks! So excited and a little nervous. Sharing a photo of my growing bump. What\'s one piece of advice you\'d give to your 28-week pregnant self?',
    image: '/placeholder.svg',
    likes: 85,
    comments: 12,
    isLiked: false,
    username: 'Mama Bear Club',
    avatar: '/placeholder.svg',
    timestamp: '4h',
  },
  {
    id: '3',
    tag: 'First Trimester Tips',
    content: 'Morning sickness hitting hard this week. Found that ginger tea and small frequent meals really help. What are your go-to remedies? 💚',
    likes: 42,
    comments: 8,
    isLiked: true,
    username: 'Jessica L.',
    avatar: '/placeholder.svg',
    timestamp: '6h',
  },
  {
    id: '4',
    tag: 'Trimester 2 Support',
    content: 'Anyone else experiencing round ligament pain? It\'s been pretty intense lately. My doctor says it\'s normal but wondering what helps you manage it.',
    likes: 67,
    comments: 15,
    isLiked: false,
    username: 'Sarah M.',
    avatar: '/placeholder.svg',
    timestamp: '8h',
  },
  {
    id: '5',
    tag: 'Trimester 2 Support',
    content: 'Finally feeling those first kicks! 🥰 It\'s such an amazing feeling. For those who haven\'t felt them yet, don\'t worry - every pregnancy is different!',
    likes: 124,
    comments: 23,
    isLiked: true,
    username: 'Emma Rose',
    avatar: '/placeholder.svg',
    timestamp: '12h',
  },
];

const communityDescriptions = {
  'General Pregnancy': 'A place for all pregnancy-related discussions and general support.',
  'Trimester 1 Support': 'Support and advice for first trimester experiences.',
  'Trimester 2 Support': 'Community for second trimester journey and milestones.',
  'Trimester 3 Support': 'Final stretch support and preparation for birth.',
  'Postpartum Support': 'Support for new mothers after delivery.',
  'Baby Nutrition': 'Discussions about feeding and nutrition for babies.',
  'Baby Sleep': 'Tips and support for baby sleep challenges.',
  'Product Recommendations': 'Share and discover the best pregnancy and baby products.',
  'Mental Health & Wellness': 'Mental health support and wellness during pregnancy.',
  'New Moms Connect': 'Connect with other new mothers and share experiences.',
  'First Trimester Tips': 'Practical tips for navigating the first trimester.',
};

const Community = () => {
  const { communityName } = useParams<{ communityName: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Convert URL slug back to community name
  const getCommunityDisplayName = (slug: string | undefined): string => {
    if (!slug) return '';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const currentCommunity = getCommunityDisplayName(communityName);
  
  // Filter posts for this community
  const communityPosts = posts.filter(post => post.tag === currentCommunity);
  
  // Filter posts based on search query
  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleCreatePost = (postData: { tag: string; content: string; image?: string }) => {
    const newPost: Post = {
      id: Date.now().toString(),
      tag: postData.tag,
      content: postData.content,
      image: postData.image,
      likes: 0,
      comments: 0,
      isLiked: false,
      username: 'You',
      avatar: '/placeholder.svg',
      timestamp: 'now',
    };

    setPosts([newPost, ...posts]);
    toast({
      title: "Post created! 🎉",
      description: `Your post has been shared with ${currentCommunity}.`,
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Back button and Community Info */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="p-2 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-foreground mb-2">
                {currentCommunity}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{communityPosts.length} posts</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>

          {/* Community Description */}
          <div className="mb-4 text-center">
            <p className="text-sm text-muted-foreground">
              {communityDescriptions[currentCommunity as keyof typeof communityDescriptions] || 'Community discussion space.'}
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-gray-100 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="space-y-4 mt-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `No posts match "${searchQuery}" in ${currentCommunity}`
                  : `Be the first to post in ${currentCommunity}!`
                }
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
                {/* Community Badge */}
                <div className="mb-3">
                  <Badge 
                    variant="secondary" 
                    className="text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200 px-3 py-1.5 text-sm font-medium rounded-full"
                  >
                    {post.tag}
                  </Badge>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-medium text-sm">
                    {post.username.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{post.username}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-sm">{post.timestamp}</span>
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
                <div className="flex items-center gap-6 text-gray-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        post.isLiked ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span className="text-sm">{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments}</span>
                  </button>

                  <button className="hover:text-blue-500 transition-colors">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Floating Create Post Button */}
      <Button
        size="icon"
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-pink-500 hover:bg-pink-600"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        defaultTag={currentCommunity}
      />
    </div>
  );
};

export default Community;