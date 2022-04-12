const socket = io.connect();

const HANDLEBARS_PRODUCTS_URL = "/public/hbs/products.hbs";
const HANDLEBARS_CHATS_URL = "/public/hbs/chats.hbs";

function sendMessage(event, message) {
  socket.emit(event, message);
}

async function renderHandlebars(templateUrl, data) {
  const handlebarsTemplateFetch = await fetch(templateUrl);
  const handlebarsTemplate = await handlebarsTemplateFetch.text();
  const compiledTemplate = Handlebars.compile(handlebarsTemplate);
  return compiledTemplate(data);
}

async function getProductsHTML(productos) {
  const hayProductos = productos.length > 0;
  return renderHandlebars(HANDLEBARS_PRODUCTS_URL, { hayProductos, productos });
}

function formatDate(rawDate) {
  const addZero = (number) => (number < 10 ? `0${number}` : number);
  const date = new Date(rawDate);
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${addZero(day)}/${addZero(month)}/${year} ${addZero(hours)}:${addZero(
    minutes
  )}:${addZero(seconds)}`;
}

async function getChatsHTML(chats) {
  const messages = chats.map((chat) => {
    return {
      mail: chat.mail,
      message: chat.message,
      date: formatDate(chat.date),
    };
  });
  return renderHandlebars(HANDLEBARS_CHATS_URL, { messages });
}

function sendUserChatMessage() {
  const mail = document.getElementById("chat_user_email").value;
  const userMessageInput = document.getElementById("chat_user_message");
  const message = userMessageInput.value;
  sendMessage("chats", { mail, message });
  userMessageInput.value = "";
}

socket.on("products", async (products) => {
  const productsHTML = await getProductsHTML(products);
  document.getElementById("websocket_products").innerHTML = productsHTML;
});

socket.on("chats", async (chats) => {
  const chatsHTML = await getChatsHTML(chats);
  const chatMessages = document.getElementById("chat_messages");
  chatMessages.innerHTML += chatsHTML;
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
