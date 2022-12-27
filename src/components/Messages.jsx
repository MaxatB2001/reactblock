import React, { useState, useEffect } from "react";
import { getMessages, getChains, decryptMessage } from "../queries";

const Messages = () => {
  const [blocks, setBlocks] = useState([]);
  const [messages, setMessages] = useState([]);
  console.log(messages)
  useEffect(() => {
    getChains()
      .then((data) => {
        data.map((b) => {
          getMessages(
            b,
            "3ed66c1860729f0665b95a7ab962f443bc568159cb3407bd4bd3271152ffdc47"
          )
            .then((mess) => {
              if (mess[0]) {
                mess[0].messages.map(m => {
                  let message = {from_hach : m.from_hach}
                  if (typeof m.message == "string") {
                    message.message = m.message
                    setMessages(prev => [...prev, message])
                  } else {
                    if (m.message) {
                      decryptMessage(m.message).then(r => {
                        if (typeof r == "string") {
                          message.message = r
                          setMessages(prev => [...prev, message])
                        }
                      }).catch(e => console.log(e))
                    }
                  }
                })
              }
              
            })
            .catch((e) => console.log(e))
        }
        )
      }
      ).catch(e => console.log(e))
      .catch((e) => console.log(e));
  }, []);
  if (messages.length == 0) return null
  return (
    <div>
      {messages.map((m, index) => (
        <div key={index} style={{
          borderRadius: "10px", background: "lightblue", padding: '20px', marginTop: '10px'
        }}>
          <div>{m.from_hach}</div>
          <div>{m.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
