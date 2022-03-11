import sendIcon from "../assets/send.png"
import attachment from '../assets/send_image.png';
import cancel from "../assets/cancel.png"
import image from "../assets/image.png"

export default function Public(props) {

  const { 
    sendMessage, 
    value, 
    onChange, 
    groupMessage, 
    sortNames, 
    username, 
    receiver, 
    setMedia, 
    onChatClose,
    media
  } = props;

  const messages = groupMessage ? groupMessage["public"] : [];

  return (
    <div>
      <div className='online-users-header'>
        <div style={{ margin: "0 10px" , cursor:"pointer"}}>{receiver}</div>
        <div style = {{margin:"0 10px"}}>
          <img onClick={onChatClose} width = "10px" src={cancel} alt="close"/>
        </div>
      </div>
      <div className='message-area'>
        <ul>
          <>
            {
              messages && messages.length > 0 ? messages.map((msg, index) => (
                <li style={{
                  flexDirection : username!==msg.sender ? "row" : "row-reverse",
                }} key={index}>

                  {
                  msg.message !== "" || msg.media ? (<div className='user-pic'>
                    <img src={require(`../users/${msg.avatar}`)} />
                  </div>) : null
                  }
                  
                  <div>
                    {
                      msg.media && msg.media.image ? 
                      (  
                      <div className="image-container">
                        <img src = {msg.media.content} width="250" alt=""/>
                        </div>) : null}
                    {msg.message !== "" ? (<div className='message-text'>{msg.message}</div> ): null}
                  </div>

                </li>)) : null
            }
          </>
        </ul>
      </div>
      <div>
        {
          media !== null ? (<div className="attachment-display">
          <img src={image} alt={""}/>
          <span className="attachment-name">{media.name}</span>
          <span className="remove-attachment" onClick={() => {
            setMedia(null);
          }}>×</span>
        </div>) : null
        }
      <form onSubmit={sendMessage} className='message-control'>
        <textarea value={value} onChange={onChange} placeholder='Type your message...' />
        <div className='file-input-container'>
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            console.log(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              //console.log(reader.result);
              setMedia({
                image: true,
                content: reader.result,
                name: file.name,
              });
            };
            reader.onerror = function (error) {
              console.log(error);
            };
          }} id='hidden-file' />
          <label htmlFor="hidden-file">
            <img width={28} src={attachment} alt="" />
          </label>
        </div>
        <button>
          <img src={sendIcon} />
          <span style={{ display: "inline-block" }}>
            Send
          </span>
        </button>
      </form>
      </div>
      
    </div>
  )
}

/**/

//  TODO: Press enter to send messages
//  implement login/register screen
//  store passwords for users
//  implement public chat
//  public chat should display each message sender name
//  optional: implement date/time for each messaage
