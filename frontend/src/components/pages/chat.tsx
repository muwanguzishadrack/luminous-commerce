import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  MessageCircle,
  Send,
  ShoppingCart,
  Megaphone,
  Tag,
  Ban,
  ChevronDown,
  Plus,
  X,
  Bold,
  Italic,
  Strikethrough,
  Smile,
  Paperclip,
  Image,
  FileText,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import whatsappBg from '@/assets/whatsapp-bg.png'

export function Chat() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messageInput, setMessageInput] = useState('')
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [campaignsOpen, setCampaignsOpen] = useState(false)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [customerTags, setCustomerTags] = useState(['VIP Customer'])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock chat counts for each tab
  const chatCounts = {
    requesting: 1,
    intervened: 1,
  }

  // Mock chat data

  const intervenedChats = [
    {
      id: 2,
      name: 'Mike Chen',
      phoneNumber: '+1 234 567 8902',
      lastMessage: 'Thank you for your assistance',
      timestamp: '1 hour ago',
      unreadCount: 0,
      status: 'Offline',
      lastActive: '1 hour ago',
      messages: [
        {
          id: 1,
          text: 'Hello, I have a question about my recent purchase',
          sender: 'user',
          timestamp: '1:00 PM',
        },
        {
          id: 2,
          text: "Hi Mike! I'd be happy to help you with that. What's your order number?",
          sender: 'agent',
          timestamp: '1:02 PM',
        },
        {
          id: 3,
          text: "It's ORD-12345",
          sender: 'user',
          timestamp: '1:03 PM',
        },
        {
          id: 4,
          text: 'Perfect! Let me look that up for you. I can see your order was placed yesterday for a wireless headset.',
          sender: 'agent',
          timestamp: '1:04 PM',
        },
        {
          id: 5,
          text: "Yes, that's correct. I'm wondering about the delivery status. I haven't received any tracking information yet.",
          sender: 'user',
          timestamp: '1:05 PM',
        },
        {
          id: 6,
          text: 'I understand your concern. Let me check the shipping details for you right now.',
          sender: 'agent',
          timestamp: '1:06 PM',
        },
        {
          id: 7,
          text: 'Great news! Your order has been processed and shipped this morning. You should receive a tracking email within the next hour.',
          sender: 'agent',
          timestamp: '1:08 PM',
        },
        {
          id: 8,
          text: 'The estimated delivery is tomorrow between 2-6 PM. Is someone available to receive the package?',
          sender: 'agent',
          timestamp: '1:09 PM',
        },
        {
          id: 9,
          text: "Perfect! Yes, I'll be home tomorrow afternoon. Will I need to sign for it?",
          sender: 'user',
          timestamp: '1:10 PM',
        },
        {
          id: 10,
          text: "Yes, a signature will be required since it's a high-value item. The tracking number is TR123456789US.",
          sender: 'agent',
          timestamp: '1:12 PM',
        },
        {
          id: 11,
          text: 'You can track it at our website or directly through the carrier. Is there anything else I can help you with?',
          sender: 'agent',
          timestamp: '1:13 PM',
        },
        {
          id: 12,
          text: "That's everything I needed to know. You've been very helpful!",
          sender: 'user',
          timestamp: '1:14 PM',
        },
        {
          id: 13,
          text: 'Thank you for your assistance',
          sender: 'user',
          timestamp: '1:15 PM',
        },
        {
          id: 14,
          text: "You're very welcome! Have a great day and enjoy your new headset when it arrives! 😊",
          sender: 'agent',
          timestamp: '1:16 PM',
        },
      ],
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
  }

  const handleChatClick = (chat: any) => {
    setSelectedChat(chat)
  }

  useEffect(() => {
    if (selectedChat) {
      // Small delay to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottom()
      }, 0)
    }
  }, [selectedChat])

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // Add message logic here
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      setCustomerTags([...customerTags, newTag.trim()])
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomerTags(customerTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-lg bg-card shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-border">
        {/* Active Chats Title Section */}
        <div
          className="border-b border-border px-6"
          style={{ paddingTop: '16px', paddingBottom: '17px' }}
        >
          <h3 className="text-base font-medium text-foreground">
            Active chats ({chatCounts.intervened})
          </h3>
        </div>

        {/* Search Section */}
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search name or mobile number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border-input pl-10 focus:border-input focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-0">
            {intervenedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="flex cursor-pointer items-center gap-3 border-b border-border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30 text-sm font-medium text-secondary-foreground">
                  {chat.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-foreground">{chat.name}</h4>
                      <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {selectedChat ? (
          /* Chat Interface */
          <div className="flex flex-1 gap-0">
            {/* Chat Window */}
            <div className="flex flex-1 flex-col">
              {/* Chat Header */}
              <div
                className="flex items-center border-b border-border px-6"
                style={{ paddingTop: '13px', paddingBottom: '12px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-sm font-medium text-secondary-foreground">
                    {selectedChat.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {selectedChat.name} ({selectedChat.phoneNumber})
                    </h3>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="chat-messages-container flex-1 space-y-4 overflow-y-auto p-4"
                style={{
                  backgroundImage: `url(${whatsappBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {selectedChat.messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                        message.sender === 'agent'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.sender === 'agent'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div
                className="p-4"
                style={{
                  backgroundImage: `url(${whatsappBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                  {/* Message Input - Top */}
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full border-0 bg-transparent p-0 focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  {/* Toolbar and Send Button - Bottom */}
                  <div className="flex items-center justify-between">
                    {/* Toolbar Features - Left Side */}
                    <div className="flex items-center gap-1">
                      {/* Text Formatting */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Strikethrough className="h-4 w-4" />
                      </Button>

                      <Separator orientation="vertical" className="mx-1 h-6" />

                      {/* Media & Attachments */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <Image className="h-4 w-4" />
                      </Button>

                      <Separator orientation="vertical" className="mx-1 h-6" />

                      {/* Business Actions */}
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Send Button - Right Side */}
                    <Button onClick={handleSendMessage} size="sm" className="gap-2 rounded-xl">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Sidebar */}
            <div className="w-80 border-l border-border bg-card shadow-sm">
              {/* Profile Header */}
              <div
                className="flex items-center border-b border-border px-6"
                style={{ paddingTop: '17px', paddingBottom: '16px' }}
              >
                <h3 className="text-base font-medium text-foreground">Customer Profile</h3>
              </div>

              {/* Status Section */}
              <div className="space-y-3 border-b border-border p-4">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="text-xs font-medium text-blue-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Last Message</span>
                  <span className="text-xs text-foreground">{selectedChat.lastActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Template Messages</span>
                  <span className="text-xs text-foreground">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Session Messages</span>
                  <span className="text-xs text-foreground">{selectedChat.messages.length}</span>
                </div>
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-0">
                {/* Orders Section */}
                <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        3
                      </Badge>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${ordersOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-b border-border p-4 pt-0">
                    <div className="space-y-0">
                      <div className="flex items-center justify-between border-b border-border py-3">
                        <div>
                          <div className="text-sm font-medium">Order #ORD-001</div>
                          <div className="text-xs text-muted-foreground">2 days ago</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$299.99</div>
                          <Badge variant="outline" className="text-xs">
                            Delivered
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b border-border py-3">
                        <div>
                          <div className="text-sm font-medium">Order #ORD-002</div>
                          <div className="text-xs text-muted-foreground">1 week ago</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$149.50</div>
                          <Badge variant="outline" className="text-xs">
                            Shipped
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="text-sm font-medium">Order #ORD-003</div>
                          <div className="text-xs text-muted-foreground">2 weeks ago</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">$89.99</div>
                          <Badge variant="outline" className="text-xs">
                            Processing
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Campaigns Section */}
                <Collapsible open={campaignsOpen} onOpenChange={setCampaignsOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        2
                      </Badge>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${campaignsOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-b border-border p-4 pt-0">
                    <div className="space-y-0">
                      <div className="flex items-center justify-between border-b border-border py-3">
                        <div>
                          <div className="text-sm font-medium">Summer Sale Campaign</div>
                          <div className="text-xs text-muted-foreground">Email • 3 days ago</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="text-sm font-medium">Welcome Series</div>
                          <div className="text-xs text-muted-foreground">SMS • 1 week ago</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Tags Section */}
                <Collapsible open={tagsOpen} onOpenChange={setTagsOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-border p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Tags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {customerTags.length}
                      </Badge>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${tagsOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-b border-border p-4 pt-0">
                    <div className="space-y-4 pt-3">
                      <div className="flex flex-wrap gap-2">
                        {customerTags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      {isAddingTag ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter tag name"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            className="h-8 rounded-xl text-xs"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleAddTag} className="h-8 rounded-xl px-2">
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsAddingTag(false)
                              setNewTag('')
                            }}
                            className="h-8 rounded-xl px-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAddingTag(true)}
                          className="h-8 gap-1 rounded-xl text-xs"
                        >
                          <Plus className="h-3 w-3" />
                          Add Tag
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Block Messages Button */}
              <div className="p-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Ban className="h-4 w-4" />
                  Block Incoming Messages
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Default State */
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">
                Select a chat to continue!
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
