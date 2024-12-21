import { Bot, Context, session } from "grammy";
import { escape } from "html-escaper";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";
import { generator } from "./generator";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;



async function askLength(conversation: MyConversation, ctx: MyContext) { // handler "custom length"
    await ctx.reply("Write length of the password");
    const { message } = await conversation.wait();
    if(message?.text != undefined && isNaN(parseInt(message.text)) == false){
        const password = escape(await generator(parseInt(message.text)))
        return ctx.reply(`Your password: <code>${password}</code>`, {parse_mode: "HTML"})
    }
    else{
        return await ctx.reply("Received not a number! Try again")
    }
  }

const bot = new Bot<MyContext>(""); // <-- put your bot token between the "" (https://t.me/BotFather)

bot.use(session({ initial: () => ({}) }));

bot.use(conversations())
bot.use(createConversation(askLength))

const commands = [
    "generate_password_with_15length",
    "generate_password_with_30length",
    "generate_password_with_customlength"

]

bot.command("start", (ctx) => {
    let cmds:string = ""
    commands.forEach((command) => {
        cmds += `/${command}\n`
    })
    ctx.reply(`Hello, use the commands:\n${cmds}`)
})

bot.command(commands[0], async (ctx) => { // length of the password 15
    const password = escape(await generator(15))
    return ctx.api.sendMessage(ctx.chat.id, `Your password: <code>${password} </code>`, {parse_mode: "HTML"})
})
bot.command(commands[1], async (ctx) => { // length of the password 30
    const password = escape(await generator(30))
    return ctx.api.sendMessage(ctx.chat.id, `Your password: <code>${password} </code>`, {parse_mode: "HTML"})
    
})
bot.command(commands[2], async (ctx) => { // custom length of the password
    return await ctx.conversation.enter("askLength")
})

bot.on("message", (ctx) => ctx.reply("/start"));

bot.start();
