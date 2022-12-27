import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000";

export const decryptMessage = async (message) => {
  const body = {
    private_key: "123",
    encrypted_object: {
      action: message.action,
      curlid: message.curlid,
      random_key: message.random_key,
      random_number: message.random_number,
      secret_text: message.secret_text,
    },
  };
  try {
    const { data } = await axios.post("/test_enc", body);
    return data.message;
  } catch (e) {
    throw e
  }
};

export const get_data = async () => {
  try {
    const { data } = await axios.get("/getUserData");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getChains = async () => {
  try {
    const blocks = [];
    const { data } = await axios.get("/getAllChains");
    data.chains.block_active.forEach((elem) => {
      if (elem.data_json.length != 0)
        blocks.push({ id: elem.id, data_json: elem.data_json });
    });
    return blocks;
  } catch (error) {
    throw error;
  }
};
const search_value = (obj, hach) => {
  for (var i = 0; i < obj.length; i++) {
    if (obj[i]["user_hach"] == hach) {
      return i;
    }
  }
};

export const sendTask = async (pass, body, hach, to_hach, type_task) => {
  console.log(pass, body, hach, to_hach, type_task);
  if (type_task == "custom") {
    const encrypt_body = {
      password: pass,
      message: body,
    };

    var msg = {};
    await axios
      .post("/encryptMessage", encrypt_body)
      .then((response) => {
        msg = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    const request_body = {
      from_hach: hach,
      to_hach: to_hach,
      type_task: type_task,
      message: msg,
    };
    await axios
      .post("/sendMessage", request_body)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  } else if (type_task == "send_coins") {
    const request_body = {
      from_hach: hach,
      to_hach: to_hach,
      type_task: type_task,
      count_coins: body,
    };
    await axios
      .post("/send_coins", request_body)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

export const getMessages = async (block, selected_hach) => {
  const chat = [];
  let user_hach = "";
  let from_hach = "";
  let to_hach = "";
  await block.data_json.forEach((elem) => {
    if (
      elem.data_json.type_task == "custom" &&
      (elem.data_json.to_hach == selected_hach ||
        elem.data_json.from_hach == selected_hach)
    ) {
      if (elem.data_json.to_hach == selected_hach) {
        user_hach = elem.data_json.from_hach;
        from_hach = user_hach;
        to_hach = "me";
      }

      if (elem.data_json.from_hach == selected_hach) {
        user_hach = elem.data_json.to_hach;
        from_hach = "me";
        to_hach = user_hach;
      }

      let index = search_value(chat, user_hach);
      if (index == null) {
        chat.push({
          user_hach: user_hach,
          messages: [],
        });
        index = search_value(chat, user_hach);
      }
      chat[index]["messages"].push({
        from_hach: from_hach,
        to_hach: to_hach,
        message: elem.data_json.message,
      });
    }
  });
  return chat;
};

export const doTasks = async () => {
  axios.get("/startDoingTasks");
};

export const stopDoingTasks = async () => {
  axios.get("/stopDoingTasks");
};
