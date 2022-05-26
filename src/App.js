
import './App.css';
import io from "socket.io-client";
import logo from "./assets/chat.png"
import { useEffect, useRef, useState } from "react";
import CreateUser from './components/CreateUser';
import OnlineUsers from './components/OnlineUsers';
import MessagesControl from './components/MessagesControl';
import Public from './components/Public';


const socket = io(`http://localhost:5000`);

function App() {

  const [step, setStep] = useState(0);
  const [username,setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [avatar, setAvatar] = useState("");
  const [media, setMedia] = useState(null);
  const [users, setUsers] = useState({});

  const [offline, setOffline] = useState({});
  const [message, setMessage] = useState("");
  const [groupMessage, setGroupMessage] = useState({});
  const receiverRef = useRef(null);

  const sortNames = (username1,username2) => {
    return [username1,username2].sort().join("-");
  };

  const onCreateUser = () => {
    console.log(username);

    socket.emit("new_user", username);
    const a = Math.ceil(Math.random() * 8) + '.png';
    setAvatar(a);

    setStep(prevStep => prevStep + 1);
  }

  const onUserSelect = (username) => {
    setReceiver(username);
    receiverRef.current = username; 
    setStep(prevStep => prevStep + 1);
  }

  const onPublicSelect = () => {
    setReceiver("public");
    receiverRef.current = "public"; 
    setStep(prevStep => prevStep + 2);
  }

  const onChatClose = () =>{
    setStep(1);
    receiverRef.current=null;
  }

  const gotoBottom = () =>{
    const el = document.querySelector(".message-area ul");
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  }

  const sendMessage = (e) => {
    e.preventDefault();

    const data = {
      sender : username,
      receiver,
      message,
      media,
      avatar,
      view: false,
    };

    //here we are sending messages
    socket.emit("send_message",data);
    
    //Main Model: Generate a unique key for each pair of sender-receiver
    //eg: sender: Koushan, receiver:Avirup => key: "Avirup-Koushan" (Sorted in alphabetical order and joined with a hiphen)
    if(receiver!=="public")//Else unusual storage of data
    {
    const key = sortNames(username, receiver);
    const tempGroupMessage = {...groupMessage};

    if(key in tempGroupMessage)
    {
      tempGroupMessage[key] = [...tempGroupMessage[key], {...data, view: true}];
    }
    else{
      tempGroupMessage[key] = [{...data, view:true}];
    }

    setGroupMessage({ ...tempGroupMessage });

    

     console.log(groupMessage);

     console.log(message);
  }    
  if(media !== null){
    setMedia(null);
  }

  setMessage(""); 
  };

  useEffect(()=>{
    socket.on("all_users", (users) => {
      console.log({users});
      setUsers(users);
    });

    socket.on("offline_users", (newoff) => {
      //console.log({users});
      setOffline(newoff);
    });


    socket.on("load_messages", (oldMessages) => {
      console.log(oldMessages);
      setGroupMessage(oldMessages);
    })

    socket.on("new_message", (data)=>{
      console.log(data);

       console.log({rec: receiverRef.current,data});

      if(data.receiver === "public")
      {
        setGroupMessage((prevGroupMessage) => {
          const messages = {...prevGroupMessage};
          const key = "public";
  
          if(receiverRef.current === "public"){
            data.view = true;
          }
  
  
          if(key in messages){
            messages[key] = [...messages[key], data];
          }
          else{
            messages[key] = [data];
          }
  
          return {...messages};
        })
      }
      else{

      setGroupMessage((prevGroupMessage) => {
        const messages = {...prevGroupMessage};
        const key = sortNames(data.sender,data.receiver);

        if(receiverRef.current === data.sender){
          data.view = true;
        }


        if(key in messages){
          messages[key] = [...messages[key], data];
        }
        else{
          messages[key] = [data];
        }

        return {...messages};
      })}
    })
  }, []);


  useEffect(()=>{
    //for updating view count of selected user(receiver)
    updateViewMessage();
  },[receiver]);

  const updateViewMessage = ()=>{
    let key;
    if(receiver==="public"){
    key="public"}
    else{
    key = sortNames(username,receiver);
    }
    if(key in groupMessage){
      const messages = groupMessage[key].map(msg => !msg.view ? {...msg, view:true} : msg);

      groupMessage[key] = [...messages];

      setGroupMessage({...groupMessage});
    }
  }

  useEffect(() => {
    let key;
    if(receiver=="public")
    key="public"
    else
    key = sortNames(username,receiver);
    if(key in groupMessage){
      if(groupMessage[key].length > 0){
        gotoBottom();
      }
    }
  }, [groupMessage]);

  //console.log(groupMessage);

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Chatter-logo" />
        <div className="app-name">Chatter</div>
      </header>

      <div className="chat-system">
        <div className="chat-box">
          {
            /* step1 ask user name and password*/
            step === 0 ? (
              <CreateUser onCreateUser = {onCreateUser}
              value={username}
              onChange={(e) => setUsername(e.target.value)}/>) : null}
          {/* step2 shoe all available users*/
            step === 1 ? (
              <OnlineUsers onUserSelect = {onUserSelect}
              onPublicSelect = {onPublicSelect}
              users = {users}
              offline = {offline}
              username = {username}
              avatar = {avatar}
              />
            ) : null
          }
          {/* step3 select user and switch to chat window*/
            step === 2 ? (
              <MessagesControl
              value = {message}
              onChange =  {(e)=>setMessage(e.target.value)}
              sendMessage = {sendMessage}
              groupMessage = {groupMessage}
              sortNames = {sortNames}
              username = {username}
              receiver = {receiver}
              setMedia = {setMedia}
              onChatClose={onChatClose}
              media = {media}
              avatar = {avatar}
              />
            ) : null
          }
          {/* step3 select user and switch to chat window*/
            step === 3 ? (
              <Public
              value = {message}
              onChange =  {(e)=>setMessage(e.target.value)}
              sendMessage = {sendMessage}
              groupMessage = {groupMessage}
              sortNames = {sortNames}
              username = {username}
              receiver = {receiver}
              setMedia = {setMedia}
              onChatClose={onChatClose}
              media = {media}
              avatar = {avatar}
              />
            ) : null
          }
        </div>

      </div>
    </div>
  );
}

export default App;


//54:14
//1:06:00
//2:14:56