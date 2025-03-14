import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';

const InboxComponent = ({ 
  messages = [], 
  onViewPet, 
  onMarkAsRead, 
  loading 
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'sent'
  
  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'sent') return msg.isSent;
    return true;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded text-sm ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1 rounded text-sm ${filter === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sent
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading messages...</p>
      ) : sortedMessages.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No messages found</p>
      ) : (
        <div className="overflow-y-auto max-h-96">
          {sortedMessages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-3 p-3 border rounded hover:bg-gray-50 ${!message.isRead && !message.isSent ? 'border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {message.isSent ? 'To: ' : 'From: '}
                      {message.contactName || (message.isSent ? message.toUser : message.fromUser).toString().slice(0, 8) + '...'}
                    </span>
                    {!message.isRead && !message.isSent && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Pet ID: {message.petId}
                  </p>
                  <p className="text-sm my-2">{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(new Date(Number(message.timestamp) / 1000000).toISOString())}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewPet(message.petId)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    View Pet
                  </button>
                  {!message.isRead && !message.isSent && (
                    <button
                      onClick={() => onMarkAsRead(message.id)}
                      className="text-green-500 hover:text-green-700 text-sm"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxComponent;
