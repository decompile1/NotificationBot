NotificationBot has a feature rich welcoming system that automatically sends out goodbye and welcome messages
<br />
<br />

![welcome example](/doc-assets/welcome.png?fullwidth=true)

## Setup
1. Add NotificationBot to your server by going to [/add](/add) on the website.
2. Head to the dashboard by going to [/dashboard](/dashboard?to=notifications).
3. Select your server from your profile.
4. Navigate to the **Welcomer** tab.
5. Click **welcome**
7. Click **Enable** and start customizing it however you want

### ✏️ Custom message & embed
You can create a welcoming message with a **fully customizable message and embed for free**

### 🖼️ Image card
<mark>
    If you are adding an image, you must provide a direct link to the image (use open image in new tab), 
    not the link to a website itself containing the image.
</mark>
<br />

You can create a nice welcome image by **customizing the background for free**.

![welcome image](/doc-assets/welcome.png?fullwidth=true)

Custom background image must be `1024x256px` (width, height) and be`.png` as of now.<br />
Note that `cdn.discordapp.com` no longer works due to [attachment authentication](https://support.discord.com/hc/en-us/community/posts/360061593771-Privacy-for-CDN-attachements), you can upload images to [postimg.cc](https://postimg.cc/) and copy the image url.
<br />
<br />

**Background templates:**
- [gameroom](/backgrounds/gameroom.jpg)
- [grass](/backgrounds/grass.jpg)
- [retro](/backgrounds/retro.jpg)

### 🧨 Auto delete
Automatically delete the welcome message after a certain amount of time. Set to 0 seconds to disable this functionality.

### 🏓 Pings
Ghost ping members in up to 5 channels when they join, the ghost pings will be instantly deleted.

### 👀 Roles
Assign up to 5 roles to new members.

### ♻️ Restore roles & nick after rejoin
You can re-assign all roles and past nickname when a member left and rejoins your server.

### 💬 Direct Message
If you want to send a direct message to new members, NotificationBot also allows you to do so with a custom message/embed.

### 🎉 Reactions
You can make NotificationBot react with up to 2 emojis to the bot's welcome message or to the members's first message.

**Note:** The emojis must be from the same server.

### 👋 Click to say hi
Bring Discord's "Wave to say hi!" feature to NotificationBot's custom messages, just with a random greet instead of a random sticker!
<br />
<br />
![wave to say hi! example](/doc-assets/welcome.png)


**Supported customizations are:**
- Button color (`grey`, `blurple`, `green`, `red`)
- Button emoji (must be from your server)
- Toggle ping

## Message Placeholders
Placeholders allow you to use variables that change from message to message. For example to display the username of the joining user on your server, enclosed `user.username` in curly brackets: `{user.username}`.

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user.mention</code></td>
            <td><@920487197046607872></td>
            <td>User mention</td>
        </tr>
        <tr>
            <td><code>user.id</code></td>
            <td>920487197046607872</td>
            <td>User id</td>
        </tr>
        <tr>
            <td><code>user.tag</code></td>
            <td>@decompile1</td>
            <td>User tag</td>
        </tr>
        <tr>
            <td><code>user.name</code></td>
            <td>decompile1</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>user.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>guild.name</code></td>
            <td>Random Development</td>
            <td>Server name</td>
        </tr>
        <tr>
            <td><code>guild.id</code></td>
            <td>1332096827872514058</td>
            <td>Server id</td>
        </tr>
        <tr>
            <td><code>guild.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Icon URL</td>
        </tr>
        <tr>
            <td><code>guild.rules</code></td>
            <td><#1334692086926147628></td>
            <td>Rules channel</td>
        </tr>
        <tr>
            <td><code>guild.memberCount</code></td>
            <td>20</td>
            <td>Member count</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="181">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>inviter.mention</code></td>
            <td><@920487197046607872></td>
            <td>User mention</td>
        </tr>
        <tr>
            <td><code>inviter.id</code></td>
            <td>920487197046607872</td>
            <td>User id</td>
        </tr>
        <tr>
            <td><code>inviter.tag</code></td>
            <td>@decompile1</td>
            <td>User tag</td>
        </tr>
        <tr>
            <td><code>inviter.name</code></td>
            <td>decompile1</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>inviter.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
        <tr>
            <td><code>inviter.code</code></td>
            <td>D6hgMWXk</td>
            <td>Invite code</td>
        </tr>
        <tr>
            <td><code>inviter.count</code></td>
            <td>20</td>
            <td>Count of invited users</td>
        </tr>
    </tbody>
</table>