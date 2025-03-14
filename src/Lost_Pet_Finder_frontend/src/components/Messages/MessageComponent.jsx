import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';

const MessageComponent = ({ 
  loggedInUser, 
  petId, 
  petOwner, 
  onClose, 
  onSendMessage, 
  messages = [] 
}) => {
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSendMessage(messageContent);
      setMessageContent('');
    } catch (err) {
      setError(`Failed to send message: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Messages</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Message List */}
      <div className="max-h-64 overflow-y-auto mb-4 border rounded p-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No messages yet</p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-2 rounded max-w-xs ${
                  message.fromUser === petOwner 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(new Date(Number(message.timestamp) / 1000000).toISOString())}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading || !loggedInUser}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !messageContent.trim() || !loggedInUser}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {!loggedInUser && (
        <p className="text-yellow-600 text-sm mt-2">Please log in to send messages</p>
      )}
    </div>
  );
};

export default MessageComponent;
