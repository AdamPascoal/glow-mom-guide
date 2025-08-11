import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Search, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreatePostModal } from './CreatePostModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
];

const tags = [
  'General Pregnancy',
  'Trimester 1 Support', 
  'Trimester 2 Support',
  'Trimester 3 Support',
  'Postpartum Support',
  'Baby Nutrition',
  'Baby Sleep',
  'Product Recommendations',
  'Mental Health & Wellness',
  'New Moms Connect',
  'First Trimester Tips'
];

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Convert community name to URL-friendly slug
  const getCommunitySlug = (communityName: string): string => {
    return communityName.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '');
  };

  // Navigate to community page
  const navigateToCommunity = (communityName: string) => {
    const slug = getCommunitySlug(communityName);
    navigate(`/community/${slug}`);
  };

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
      description: "Your post has been shared with the community.",
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesTag = !selectedTag || post.tag === selectedTag;
    const matchesSearch = !searchQuery || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Check if search query matches any community name for navigation
  const matchingCommunity = tags.find(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Header with Logo and Icons */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">BumpDaily</h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setSearchQuery(searchQuery ? '' : 'search')}
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search - Hidden by default, shown when search icon is clicked */}
          {searchQuery && (
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search posts, people, communities..."
                value={searchQuery === 'search' ? '' : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-muted/50"
                autoFocus
              />
              {/* Community Search Suggestion */}
              {matchingCommunity && searchQuery.length > 0 && searchQuery !== 'search' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-20">
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => navigateToCommunity(matchingCommunity)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Go to <strong>{matchingCommunity}</strong> community</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tag Filter */}
      <div className="max-w-2xl mx-auto px-4 py-3 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Badge
            variant={selectedTag === null ? "default" : "secondary"}
            className="whitespace-nowrap cursor-pointer px-4 py-2"
            onClick={() => setSelectedTag(null)}
          >
            All Posts
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="whitespace-nowrap cursor-pointer px-4 py-2 hover:bg-primary/80 transition-colors"
              onClick={() => navigateToCommunity(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        <div className="space-y-4 mt-3">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {/* Header Section with Avatar, Community Name, and User Info */}
              <div className="flex items-start gap-3 mb-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-medium text-sm flex-shrink-0">
                  {post.username.charAt(0)}
                </div>
                
                {/* Community Name and User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span 
                      className="font-semibold text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
                      onClick={() => navigateToCommunity(post.tag)}
                    >
                      {post.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">{post.username}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-xs">{post.timestamp}</span>
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
          ))}
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
        defaultTag={selectedTag || undefined}
      />
    </div>
  );
};

export default CommunityFeed;