# Chat Widget Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Backend
```bash
# Activate virtual environment
source .venv/bin/activate

# Start Langflow backend
python -m langflow run
```

The backend will start on `http://localhost:7860`

### Step 2: Start the Frontend
```bash
# In a new terminal, navigate to frontend
cd src/frontend

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000` (or another port if 3000 is busy)

### Step 3: Test the Widget
1. Open your browser to the frontend URL
2. Look for a floating chat button in the bottom-right corner
3. Click the button to open the chat widget
4. Type a message and press Enter or click Send
5. Watch the AI respond!

## 🎯 Quick Test Commands

### Test Backend Endpoints
```bash
# Create a new session
curl -X POST http://localhost:7860/api/v1/chat/session

# Send a message (replace SESSION_ID with the one from above)
curl -X POST http://localhost:7860/api/v1/chat/widget \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Langflow?", "session_id": "SESSION_ID"}'

# Get chat history
curl http://localhost:7860/api/v1/chat/history/SESSION_ID
```

## 🔧 Troubleshooting

### Backend Won't Start
- **Issue**: `ModuleNotFoundError`
- **Solution**: Make sure you activated the virtual environment
  ```bash
  source .venv/bin/activate
  ```

### OpenAI API Error
- **Issue**: "OpenAI API key not configured"
- **Solution**: Check your `.env` file has the API key
  ```bash
  cat .env | grep OPENAI_API_KEY
  ```

### Widget Not Appearing
- **Issue**: Chat button doesn't show
- **Solution**: 
  1. Check browser console for errors (F12)
  2. Verify frontend build completed successfully
  3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Messages Not Sending
- **Issue**: Messages don't get responses
- **Solution**:
  1. Check backend is running
  2. Check browser Network tab for failed requests
  3. Verify OpenAI API key is valid
  4. Check backend logs for errors

## 📱 Using the Widget

### Opening the Chat
- Click the floating button with the message icon in the bottom-right corner

### Sending Messages
- Type your message in the input field
- Press **Enter** or click the **Send** button
- Wait for the AI response (you'll see animated dots while loading)

### Closing the Chat
- Click the **X** button in the top-right corner of the chat window

### Session Persistence
- Your chat session is automatically saved
- Refresh the page and your chat history will load automatically
- To start a new conversation, clear your browser's localStorage:
  ```javascript
  // In browser console
  localStorage.removeItem('chat_session_id')
  ```

## 🎨 Widget Features

✅ **Persistent Sessions** - Your conversations are saved
✅ **Chat History** - Previous messages load automatically
✅ **Real-time Responses** - See AI responses as they come
✅ **Loading States** - Visual feedback while waiting
✅ **Keyboard Shortcuts** - Press Enter to send
✅ **Responsive Design** - Works on all screen sizes
✅ **Dark Mode Support** - Matches your app theme
✅ **Error Handling** - Graceful error messages

## 📊 What's Happening Behind the Scenes

1. **Session Creation**: When you first open the widget, it creates a unique session ID
2. **Message Storage**: Every message (yours and AI's) is saved to the database
3. **AI Processing**: Your message is sent to OpenAI's GPT-4 model
4. **Response Delivery**: The AI response is saved and displayed in real-time
5. **History Loading**: When you return, your previous messages are loaded from the database

## 🔐 Security Notes

- The OpenAI API key is stored securely in environment variables
- Session IDs are UUIDs for security
- All database operations use proper transaction management
- Consider adding authentication for production use

## 📈 Next Steps

Once you've verified the widget works:

1. **Customize the UI** - Modify `ChatWidget.tsx` to match your brand
2. **Add Features** - See `CHAT_WIDGET_IMPLEMENTATION.md` for enhancement ideas
3. **Deploy** - Follow the deployment checklist in `IMPLEMENTATION_CHECKLIST.md`
4. **Monitor** - Set up logging and analytics to track usage

## 💡 Tips

- **Clear Chat**: Remove `chat_session_id` from localStorage to start fresh
- **Test Different Messages**: Try various questions to see how the AI responds
- **Check Logs**: Backend logs show detailed information about each request
- **Inspect Network**: Use browser DevTools to see API calls in action

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the backend terminal for server errors
3. Verify all dependencies are installed
4. Ensure the `.env` file has the correct API key
5. Try restarting both frontend and backend servers

## 🎉 You're All Set!

The chat widget is now running and ready to use. Enjoy chatting with your AI assistant!

---

**Quick Reference:**
- Backend: `http://localhost:7860`
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:7860/docs`
- Widget Location: Bottom-right corner of every page
