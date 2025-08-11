import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, Search, Plus, Users, Bell } from 'lucide-react';
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



  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Top Header Bar with Logo and Icons */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Company Logo and Right Icons */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">BumpDaily</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>




          

        </div>
      </div>

      {/* Scrollable Content Area with Top Padding */}
      <div className="pt-16 bg-background">
        {/* Scrollable Community Info Section */}
        <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {currentCommunity}
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{communityPosts.length} posts</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-pink-200 hover:bg-pink-300 text-pink-700 border-pink-300 px-4 py-2"
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>

        {/* Posts Feed */}
        <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="space-y-4">
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
              <Card 
                key={post.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {/* Header Section with Avatar and User Info */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-medium text-sm flex-shrink-0">
                    {post.username.charAt(0)}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm font-medium">{post.username}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">{post.timestamp}</span>
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
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-pink-400/70 hover:bg-pink-400/80 backdrop-blur-md border border-pink-300/20 text-white"
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
    </div>
  );
};

export default Community;