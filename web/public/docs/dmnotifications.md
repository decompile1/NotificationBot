`NotificationBot` gives you the ability to send notifications right into your DMs. This functionality enables the bot to automatically send news, video uploads, twitch streams, and community updates through the help of RSS. Make sure that `direct messages` is enabled for this to work!
<br />
<br />

![DM notification example](/notificationbot.png?fullwidth=true)

<iframe src="https://www.youtube.com/embed/DtWhSFajVlw" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Add the bot to your server by going to [/add](/add).
2. Go to the dashboard by going to [/dashboard](/dashboard).
3. Click on **DM notification**.
4. Enter your desired customization and click save

### ✏️ Custom embed
You can customize your notification embed to your likin

### 🖼️ Source
<mark>
    Provide a direct link to where you want your notification is coming from. Something like: https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA`
</mark>
<br />

## Message Placeholders
You can have a custom message for your notifications. For example: **New upload from MrBeast <@920487197046607872> <td><t:1715878720:R></td>**.

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
            <td>Decompile1</td>
            <td>Username</td>
        </tr>
        <tr>
            <td><code>user.avatar</code></td>
            <td>https://cdn.discordapp.com/...</td>
            <td>Avatar URL</td>
        </tr>
    </tbody>
</table>

# Voiceover
<audio controls src="/en_us_001.mp3">