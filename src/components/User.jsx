import React, { useState } from "react";
import { doTasks, sendTask, stopDoingTasks } from "../queries";

const User = ({ user }) => {
  const [toHach, setToHach] = useState("");
  const [typeTask, setTypeTask] = useState("");
  const [body, setBody] = useState("");
  const [isDoing, setIsDoing] = useState(false);
  const onSubmit = () => {
    sendTask("123", body, user.hach, toHach, typeTask).then((data) => {
      console.log(data);
      setBody("");
      setTypeTask("");
      setToHach("");
    });
  };
  return (
    <div
      style={{
        marginTop: "10px",
      }}
    >
      <div>
        <div
          style={{
            background: "lightblue",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <div>{user.username}</div>
          <div>{user.hach}</div>
          <div>{user.coins}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
            background: "lightblue",
            padding: "30px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <label>кому</label>
          <input onChange={e => setToHach(e.target.value)} type="text" />
          <label>тип задачи</label>
          <input onChange={e => setTypeTask(e.target.value)} type="text" />
          <label>тело</label>
          <input onChange={e => setBody(e.target.value)} type="text" />
          <button onClick={onSubmit} className="myButton">отправить</button>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {isDoing ? (
          <button onClick={() => {
            setIsDoing(false)
            stopDoingTasks()
          }} className="myButton">Перестать</button>
        ) : (
          <button onClick={() => {
            setIsDoing(true)
            doTasks()
          }} className="myButton">Выполнять задачи</button>
        )}
      </div>
    </div>
  );
};

export default User;
