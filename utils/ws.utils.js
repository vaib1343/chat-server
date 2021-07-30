const Message = require("../models/message.model");
const { v4 } = require("uuid");

const retreiveAndSendMessage = async (ws, count) => {
  const messages = await Message.find({}, { email: 1, message: 1 })
    .sort({ date: -1 })
    .limit(count)
    .lean();
  ws.send(JSON.stringify({ intent: "old-message", data: messages }));
};

const broadcastMessage = (message, ws) => {
  console.log("mesage", message, ws.connectionID);
  const newmessage = new Message({
    email: ws.connectionID,
    message: message.message,
    date: Date.now(),
  });
  newmessage.save();

  // boradcasted to all client
  clients.map((client) =>
    client.send(
      JSON.stringify({ ...message, user: ws.connectionID, intent: "chat" })
    )
  );
};

var clients = [];

module.exports = { broadcastMessage, clients, retreiveAndSendMessage };
