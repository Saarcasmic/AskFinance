import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Send, User, MoreHorizontal } from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: '1',
    author: 'Sarah Jenkins',
    handle: '@sarahj_fin',
    avatarColor: '#FF6B6B',
    content: 'Is it better to pay off a 4.5% mortgage early or invest in an index fund averaging 7%? Feeling conflicted about debt vs growth.',
    timestamp: '2h ago',
    likes: 24,
    dislikes: 1,
    comments: [
      { id: 'c1', author: 'Mark T.', text: 'Mathematically, investing wins. But peace of mind has value too.', timestamp: '1h ago' },
      { id: 'c2', author: 'Alice Chen', text: 'I split the difference. Extra $200 to mortgage, rest to VTI.', timestamp: '45m ago' }
    ],
    userReaction: null
  },
  {
    id: '2',
    author: 'David Kim',
    handle: '@dkim_invest',
    avatarColor: '#4ECDC4',
    content: 'Just maxed out my Roth IRA for the year! 🚀 Does anyone have recommendations for high-yield savings accounts for my emergency fund?',
    timestamp: '4h ago',
    likes: 89,
    dislikes: 0,
    comments: [
       { id: 'c3', author: 'FinBot', text: 'Check local credit unions, they often beat the big banks.', timestamp: '3h ago' }
    ],
    userReaction: 'like'
  },
  {
    id: '3',
    author: 'Alex Rivera',
    handle: '@arivera',
    avatarColor: '#FFE66D',
    content: 'Thoughts on the latest Fed rate hike? How are you adjusting your bond allocation?',
    timestamp: '5h ago',
    likes: 12,
    dislikes: 3,
    comments: [],
    userReaction: null
  }
];

const PhoneMockupFeed = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleReaction = (postId, type) => {
    setPosts(currentPosts => currentPosts.map(post => {
      if (post.id !== postId) return post;

      const isSameReaction = post.userReaction === type;
      let newLikes = post.likes;
      let newDislikes = post.dislikes;

      // Remove previous reaction if exists
      if (post.userReaction === 'like') newLikes--;
      if (post.userReaction === 'dislike') newDislikes--;

      // Add new reaction if it wasn't a toggle-off
      if (!isSameReaction) {
        if (type === 'like') newLikes++;
        if (type === 'dislike') newDislikes++;
      }

      return {
        ...post,
        likes: newLikes,
        dislikes: newDislikes,
        userReaction: isSameReaction ? null : type
      };
    }));
  };

  const toggleComments = (postId) => {
    setExpandedPostId(current => current === postId ? null : postId);
    setNewCommentText('');
  };

  const addComment = (postId) => {
    if (!newCommentText.trim()) return;

    setPosts(currentPosts => currentPosts.map(post => {
      if (post.id !== postId) return post;

      const newComment = {
        id: Date.now().toString(),
        author: 'You',
        text: newCommentText,
        timestamp: 'Just now'
      };

      return {
        ...post,
        comments: [...post.comments, newComment]
      };
    }));
    setNewCommentText('');
  };

  return (
    <div className="phone-screen-content">
      {/* Header */}
      <div className="feed-header">
        <span className="feed-title">AskFinance</span>
        <div className="feed-header-icons">
          <User size={18} />
        </div>
      </div>

      {/* Composer Stub */}
      <div className="feed-composer">
        <div className="composer-avatar" style={{ backgroundColor: '#6c5ce7' }}>Y</div>
        <div className="composer-input">Ask a finance question...</div>
      </div>

      {/* Feed */}
      <div className="feed-list">
        {posts.map(post => (
          <div key={post.id} className="feed-post">
            <div className="post-header">
              <div className="post-avatar" style={{ backgroundColor: post.avatarColor }}>
                {post.author.charAt(0)}
              </div>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-handle">{post.handle} • {post.timestamp}</span>
              </div>
              <MoreHorizontal size={16} className="post-options" />
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-actions">
              <button 
                className={`action-btn ${post.userReaction === 'like' ? 'active like' : ''}`}
                onClick={() => handleReaction(post.id, 'like')}
              >
                <ThumbsUp size={16} className={post.userReaction === 'like' ? 'fill-current' : ''} />
                <span>{post.likes}</span>
              </button>
              
              <button 
                className={`action-btn ${post.userReaction === 'dislike' ? 'active dislike' : ''}`}
                onClick={() => handleReaction(post.id, 'dislike')}
              >
                <ThumbsDown size={16} className={post.userReaction === 'dislike' ? 'fill-current' : ''} />
              </button>

              <button 
                className={`action-btn ${expandedPostId === post.id ? 'active' : ''}`}
                onClick={() => toggleComments(post.id)}
              >
                <MessageCircle size={16} />
                <span>{post.comments.length}</span>
              </button>
            </div>

            {/* Comments Section */}
            {expandedPostId === post.id && (
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <span className="comment-author">{comment.author}:</span>
                      <span className="comment-text">{comment.text}</span>
                    </div>
                  ))}
                  {post.comments.length === 0 && (
                    <div className="no-comments">No comments yet. Be the first!</div>
                  )}
                </div>
                
                <div className="comment-input-area">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addComment(post.id)}
                  />
                  <button 
                    className="send-btn"
                    onClick={() => addComment(post.id)}
                    disabled={!newCommentText.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneMockupFeed;

