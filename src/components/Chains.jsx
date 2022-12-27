import React, { useEffect, useState } from 'react'
import { getChains } from '../queries'
import Block from './Block';

const Chains = () => {
  const [chains, setChains] = useState([])
  useEffect(() => {
    getChains().then(data => setChains(data)).catch(e => console.log(e))
  }, [])
  return (
    <div>
      {chains.map(c => <div key={c.id}>{
        <Block block={c}/>
      }</div>)}
    </div>
  )
}

export default Chains