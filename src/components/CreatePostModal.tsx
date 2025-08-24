import React from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: {
    tag: string;
    content: string;
    image?: string;
  }) => void;
  defaultTag?: string;
}

const communityOptions = [
  'General Pregnancy',
  'Trimester 1 Support',
  'Trimester 2 Support', 
  'Trimester 3 Support',
  'Postpartum Support',
  'Baby Nutrition',
  'Baby Sleep',
  'Product Recommendations',
  'Mental Health & Wellness'
];

export function CreatePostModal({ isOpen, onClose, onSubmit, defaultTag }: CreatePostModalProps) {
  const [selectedTag, setSelectedTag] = React.useState(defaultTag || '');
  const [content, setContent] = React.useState('');
  const [image, setImage] = React.useState<string | undefined>();

  const handleSubmit = () => {
    if (!selectedTag || !content.trim()) {
      return;
    }

    onSubmit({
      tag: selectedTag,
      content: content.trim(),
      image
    });

    // Reset form
    setSelectedTag(defaultTag || '');
    setContent('');
    setImage(undefined);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white/70 backdrop-blur-md border-0 shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-center text-gray-800">Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Community Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Select Community</label>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full bg-white/60 border-gray-200 focus:border-pink-300 focus:ring-pink-200">
                <SelectValue placeholder="Choose a community..." />
              </SelectTrigger>
              <SelectContent className="bg-white/80 backdrop-blur-md">
                {communityOptions.map((option) => (
                  <SelectItem key={option} value={option} className="hover:bg-pink-50">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Share your thoughts</label>
            <Textarea
              placeholder="Share your thoughts, questions, or tips..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none bg-white/60 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Attach Photo (Optional)</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Choose Photo</span>
              </label>
              {image && (
                <div className="relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => setImage(undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 bg-white/60 border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedTag || !content.trim()}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white shadow-sm disabled:opacity-50"
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}