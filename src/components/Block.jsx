import React from "react";

const Block = ({ block }) => {
  console.log(block.data_json);
  return (
    <div>
      <div>id блока {block.id}</div>
      {block.data_json.map((data) => (
        <div
          style={{ borderRadius: "10px", background: "lightblue", padding: '20px', marginTop: '10px' }}
          key={data.hash}
        >
          {Object.keys(data.data_json).map((key, index) => (
            <div key={index}>
              {key}:
              {
                typeof data.data_json.message == "string" && data.data_json.messsage
                ? data.data_json[key]
                : data.data_json[key]
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Block;
