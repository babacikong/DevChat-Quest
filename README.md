I'm assuming you already have aos



Step 1 : Run this command in root;
```
npm install discord.js ws @permaweb/aoconnect fs
```

Step 2 : Project Directory Structure
```
├── capture.js
├── index.js
├── process.lua
├── client.lua
├── chatroom.lua
├── router.lua
```

Step 3 : Configure index.js 

I suggest you to use VScode for this
You need to change

```
const token 'YOUR DISCORD BOT TOKEN ID'
const channelId 'YOUR DISCORD CHANNEL ID (e.g general-chat)'
await message({
    process: 'yourprocessID'
```

these parts
the other files are just fine

Step 4 : Run these commands on aos

```
.load router.lua
.load client.lua
.load chatroom.lua
.load process.lua
```

Step 5 : Register the Channel

```
ao.send({ Target = "xnkv_QpWqICyt8NpVMbfsUQciZ4wlm5DigLrfXRm8fY", Action = "Register", Name = ao.id })
```

Step 6 : Join the registered channel in the aos terminal

```
Join(ao.id) //ur created rooms
```

Step 7 : Open 2 new screens or 2 Terminals in my case

In one of them run ;

```
node index.js
```

and in the second one run ;

```
node capture.js
```

In total you need to have 3 screens. You can close them later.

Step 8 : Testing the Setup Sending a Message from DevChat

```
Say("Hello, this is a test message.", ao.id)
```

my Discord Channel : https://discord.gg/xV8QKGxEhA

Check if the bot send the message to your server.

The result should look like this;

<img width="226" alt="image" src="https://github.com/babacikong/DevChat-Quest/assets/157308881/2f001223-9678-4b8a-8498-e4949a3419e5">

