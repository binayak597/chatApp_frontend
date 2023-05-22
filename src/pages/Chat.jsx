import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../context/UserContext';
import { uniqBy } from 'lodash';
import { getAllUsers, getMessages, logoutUser } from '../utils/handleApi';
import Logo from '../components/Logo';
import Contact from '../components/Contact';
import { convertFileToBase64 } from '../helper/convert';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newTextMessage, setNewTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessage = useRef();
  const { userName, id, setId, setUserName } = useContext(UserContext);
  useEffect(() => {
    connectToWebSocket();
  }, [selectedUserId]);

  function connectToWebSocket() {
    // const ws = new WebSocket('ws://localhost:8000'); //connection of a client to webSocketServer created in serverfile
    const ws = new WebSocket('ws://https://chatapp-backend-7895.onrender.com');
    setWs(ws);
    ws.addEventListener('message', handleMessage); //  message event gets triggered when webSocketServer sends a message to the active client
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log("disconnected. trying to reconnect.......");
        connectToWebSocket();
      }, 1000);
    }); // close event gets triggered when client will disconnect form the webSocketServer 
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log(messageData, ev);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      // console.log(messageData.sender, selectedUserId);
      if(messageData.sender === selectedUserId){
        setMessages(prev => ([...prev, { ...messageData }]));
      }
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};

    peopleArray.map(({ userName, userId }) => {
      people[userId] = userName; // to store unique connected clients to show on the app.
    });
    setOnlinePeople(people);
  }

  function selectedUser(userId) {
    setSelectedUserId(userId);
  }

  function handleChange(event) {
    const { value } = event.target;
    setNewTextMessage(value);
  }

  function sendMessage(ev, file = null) {
    if (ev) {
      ev.preventDefault();
    }
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newTextMessage,
      file,
    })); 
    if (file) {
      getMessages(selectedUserId)
        .then(res => {
          setMessages(res.data);
        });
     } else {
      setNewTextMessage("");
      setMessages(prev => ([...prev, {
        text: newTextMessage,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now()
      }]));

    }

  }

  async function sendFile(ev) {
    const file = await convertFileToBase64(ev.target.files[0]);
    sendMessage(null, {
      name: ev.target.files[0].name,
      data: file
    });

  }

  function logout() {
    logoutUser().then(() => {
      setWs(null);
      setId(null);
      setUserName(null);
    })
  }

  useEffect(() => {
    const div = divUnderMessage.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]); //add the auto scrolling effect to each message when a new message will store inside message array.


  useEffect(() => {
    if (selectedUserId) {
      getMessages(selectedUserId)
        .then(res => {
          setMessages(res.data);
        });
     
    }
  }, [selectedUserId]);

  useEffect(() => {
    getAllUsers().then((res) => {
      const offlineUserArr = res.data
        .filter(person => person._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));

      const offlineUser = {};
      offlineUserArr.forEach(offPeople => {
        offlineUser[offPeople._id] = offPeople;
      });
      setOfflinePeople(offlineUser);
    });
  }, [onlinePeople]);

  const onlinePeopleExludeOwn = { ...onlinePeople };
  delete onlinePeopleExludeOwn[id]; //deleting the id of own from the list of active clients

  const messageWithOutDupes = uniqBy(messages, '_id');

  return (
    <div className='flex h-screen'>
      <div className='bg-white w-1/3 flex flex-col'>
        <div className='flex-grow'>
          <Logo />
          {Object.keys(onlinePeopleExludeOwn).map(userId => (
            <Contact
              key={userId}
              id={userId}
              onClick={() => selectedUser(userId)}
              online={true}
              username={onlinePeopleExludeOwn[userId]}
              selected={userId === selectedUserId}
            />
          ))}
          {Object.keys(offlinePeople).map(userId => (
            <Contact
              key={userId}
              id={userId}
              onClick={() => selectedUser(userId)}
              online={false}
              username={offlinePeople[userId].userName}
              selected={userId === selectedUserId}
            />
          ))}

        </div>
        <div className='flex text-center items-center justify-center gap-8 mb-2'>
          <span className='flex items-center gap-1 text-gray-700'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            {userName}
          </span>
          <button className='bg-blue-100 text-gray-500 px-4 py-2 border border-gray-300 rounded-md ' onClick={logout}>Logout</button>
        </div>
      </div>
      <div className='flex flex-col bg-blue-100 w-2/3 p-2'>
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex items-center justify-center h-full'>
              <div className='text-gray-400'>&larr; select a user from the sidebar</div>
            </div>
          )}
          {selectedUserId && (
            <div className='relative h-full'>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-3'>
                {messageWithOutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? "text-right" : "text-left")}>
                    <div className={"text-left inline-block p-2 my-2 rounded-lg " + (message.sender === id ? "bg-blue-500 text-white" : "bg-white text-gray-500")}>
                      {/* sender: {message.sender} <br />
                      my id: {id} <br /> */}
                      {message.text}
                      {message.file && (
                        <div>
                        <a target="_blank" className="flex items-center gap-1 border-b" href={axios.defaults.baseURL + "/uploads/" + message.file}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
                          </svg>
                          {message.file}
                        </a>
                        </div>

                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessage}></div>
              </div>
            </div>


          )}
        </div>
        {selectedUserId && (

          <form className='flex gap-2' onSubmit={sendMessage} >
            <input
              className='bg-white p-2 flex-grow items-center w-full px-3 py-2 border border-slate-200 rounded-md 
              placeholder-slate-400 focus:outline-none
              focus:border-blue-300 focus:ring-1 focus:ring-blue-300' 
              type="text"
              value={newTextMessage}
              placeholder='type your message here'
              onChange={handleChange}
            />
            <label className='bg-gray-300 text-gray-500 p-2 cursor-pointer rounded-md'>
              <input
                type="file"
                className='hidden'
                onChange={sendFile}

              />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" />
              </svg>
            </label>
            <button type="submit" className='bg-blue-500 text-white p-2 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
        {/* {!!selectedUserId && (
//           <div className='flex gap-2 text-white'>
//           <input className='bg-white p-2 flex-grow rounded-sm' type="text" placeholder='type your message here' />
//           <button className='bg-blue-500 p-2 rounded-sm'>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
//             </svg>
//           </button>
//         </div>
//         )} */}

      </div>
           </div>

  );
}

export default Chat

