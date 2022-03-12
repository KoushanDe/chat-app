
export default function OnlineUsers(props) {
  const { onUserSelect,onPublicSelect, users, offline, username ,avatar} = props;
  return (
  
    <div>
      <div>
      <header className="user-header">
      <img src={require(`../users/${avatar}`)} />
        <div className="app-name">{username}</div>
      </header>
      </div>
      <div className='online-users-header'>
        <div style={{ margin: "0 10px" }}>Online Users</div>
      </div>

      <ul className='users-list'>
        
        {users && Object.keys(users).map(user => (
          <>
            {
              user !== username ? (
              <li key={user} onClick={() => onUserSelect( user )}>
                <span style={{ textTransform: "capitalize" }}>{user}</span>
                
              </li>) : null
            }
          </>
        ))}

      </ul>
      <div className='online-users-header'>
        <div style={{ margin: "0 10px" }}>Offline Users</div>
      </div>

      <ul className='users-list'>
        
        {offline && Object.keys(offline).map(user => (
          <>
            {
              user !== username ? (
              <li key={user} onClick={() => onUserSelect( user )}>
                <span style={{ textTransform: "capitalize" }}>{user}</span>
               
              </li>) : null
            }
          </>
        ))}

      </ul>
      <div className='online-users-header' style={{margin: "20px 0px 0px"}}>
        <div style={{ margin: "0 10px" }}>Public Room</div>
      </div>

      <ul className='users-list'>
        <li key={"public"} onClick={() => onPublicSelect()}>
        <span style={{ textTransform: "capitalize" }}>{"Public Chat"}</span>
                
        </li>
        </ul>
    </div>
  );
};