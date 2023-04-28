import { ChatEngine, ChatFeed, ChatList } from 'react-chat-engine';
import './msg.css';
// import ChatList from './components/ChatList';

const projectID = '2ddf57c8-852d-4a09-a337-14fb01d1458a';

const App = () => {
  const userName = localStorage.getItem('username');
  const password = localStorage.getItem('password');

//   localStorage.removeItem('username');
//   localStorage.removeItem('password');

  return (

    <ChatEngine
      height="90vh"
      projectID={projectID}
      userName={userName}
      userSecret={password}
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      renderChatList={(chatAppState) => <ChatList {...chatAppState} />}
    //   renderChatList = {(chatAppState) => {}}
      onNewMessage={() => {
        console.log('trigger new message');
        return new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play();
      }}
    />
  );
};

// infinite scroll, logout, more customizations...

export default App;
