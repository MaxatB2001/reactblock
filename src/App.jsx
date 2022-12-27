import { useEffect, useState } from 'react'
import './App.css'
import { get_data } from './queries';
import User from './components/User';
import Chains from './components/Chains';
import Messages from './components/Messages';

function App() {
  const [user, setUser] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    get_data().then(data => setUser(data)).catch(e => console.log(e));
  }, [])

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent: 'space-evenly', marginTop: '30px', width: '100%'}}>
      <button onClick={() => setCurrentPage(0)} className='myButton'>Отправить</button>
      <button onClick={() => setCurrentPage(1)} className='myButton'>Просмотреть блоки</button>
      <button onClick={() => setCurrentPage(2)} className='myButton'>Просмотреть сообщения</button>
      </div>
      {currentPage == 0 && <User user={user}/>}
      {currentPage == 1 && <Chains/>}
      {currentPage == 2 && <Messages/>}
    </div>
  )
}

export default App
