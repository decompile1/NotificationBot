- Instant notifications from socials such as **YouTube, Twitch, Bluesky and Reddit**, and we will add more!
- Every server can have **up to 30 different channels (adds up from all the socials) and users for free**.
- Notifications are sent **in real-time** just right after the creator uploading.
- And **free custom messages** for every notification you set up!
<br />

<iframe src="https://www.youtube.com/embed/DtWhSFajVlw" height="513" frameborder="0" allow="autoplay">
</iframe>

## Setup
1. Add the bot to your server by going to [/add](/add).
2. Go to the dashboard by going to [/dashboard](/dashboard?to=notifications).
3. Select your server
4. Navigate to the **Notifications** tab.
5. Click **Create new Notification**, select a platform and enter a channel url or username.
7. Click **Submit** and start customizing it however you want
<br/>
<br/>

<mark>
NotificationBot updates a creator's username automatically when they change it!
</mark>

<br/>
<br/>

![Channel url example](/doc-assets/notificationchannelurls.webp)

### ✏️ Custom message & embed
You can create a notification message with a **fully customizable message and embed for free**
<br />
<br />

**Note:** Image previews might be broken on the dashboard.

### 🏓 Pings
The ping role is the role that will be used for your notification, for pinging purposes
examples:
- `@everyone` will ping every member in the server.
- `@here` will ping every *currently online* member in the server.
- `@random-role` will ping everyone with the `@random-role` role.
<br />
<br />

**Note:** If NotificationBot does not have the `Mention Everyone` permission inside a channel, it will not be able to notify any server members.

### 📫 Filter
Filters allow you to select additional types or filter notifications for Bluesky:
- `Send Reposts` will also notify when the user reposts
- `Send Replies` will also notify when the user replies to a post.
- `Send Quotes` will also notify when the user quotes a post.
- `Must Contain Image` will only notify when the post contains an image.
<br />
<br />

For all other platforms, you can use a `regex` to blacklist posts!
Example regexes:
- `^\[live\]` will not post anything starting with `[live]`.
- `insult|badword` will not post anything that includes either `insult` or `badword`.
- `^(?!support$).+$` will only post that are `support`. (useful for reddit flairs)
<br />
<br />

You can use [regexr.com](https://regexr.com/) or [ChatGPT](https://chatgpt.com/) to create JavaScript-like regexes.
You can use regex keywords to avoid a condition, in order to create a whitelist filter.
The flags used for string matching are `gi`, only the titles and reddit flairs are checked.

### Testing your notification
Test notifications let you see how your notification message will look like

- pings will be disabled
- streaming platforms such as Twitch, mock data is used to simulate a live stream.
- notification filters will still be ignored.

## Offline notifications
If the bot is offline when a video, stream or post is published, your notification will be queued and sent as soon as the bot comes back online. You can check the current status on [/status](/status).

## Notification speed
Notifications are typically sent within these time frames:
- **YouTube**: 4 to 8 seconds
- **Twitch**: 10 to 100 seconds
- **Bluesky**: 0.4 to 0.6 seconds (400ms to 600ms)
- **Reddit**: up to 20 minutes

## Platform limitations
- YouTube keeps the video private for a few seconds to minutes after uploading, so the notification might be delayed by a few seconds.
<br />
<br />

- Due to changes in Reddit's API pricing in 2023, we can't offer notification speeds any faster than 20 minutes.

## Message Placeholders
Placeholders allow you to use variables that change from message to message. For example to display information about a creator, you can enclose creator.name in curly brackets like `{creator.name}`.
<br />
<br />

<mark>
    YouTube placeholders
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>video.title</code></td>
            <td>$456,000 Squid Game In Real Life!</td>
            <td>Video title</td>
        </tr>
        <tr>
            <td><code>video.id</code></td>
            <td>0e3GPea1Tyg</td>
            <td>Video id</td>
        </tr>
        <tr>
            <td><code>video.link</code></td>
            <td>https://youtube.com/watch?v=0e3GPea1Tyg</td>
            <td>Video page</td>
        </tr>
        <tr>
            <td><code>video.thumbnail</code></td>
            <td>https://i4.ytimg.com/vi/0e3GPea1Tyg/hqdefault.jpg</td>
            <td>Video thumbnail</td>
        </tr>
        <tr>
            <td><code>video.uploaded.ago</code></td>
            <td><t:1637712000:R></td>
            <td>Time since upload</td>
        </tr>
        <tr>
            <td><code>video.uploaded.at</code></td>
            <td><t:1637712000:f></td>
            <td>Upload time & date</td>
        </tr>
        <tr>
            <td><code>creator.subs</code></td>
            <td>400M</td>
            <td>Subscriber count</td>
        </tr>
        <tr>
            <td><code>creator.videos</code></td>
            <td>750</td>
            <td>Amount of videos</td>
        </tr>
        <tr>
            <td><code>creator.views</code></td>
            <td>23b</td>
            <td>Total channel views</td>
        </tr>
    </tbody>
</table>
<br />

<mark>
    Twitch placeholders
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>stream.title</code></td>
            <td>Watch my videos while I'm away on holidays in Fiji</td>
            <td>Stream title</td>
        </tr>
        <tr>
            <td><code>stream.id</code></td>
            <td>45123288363</td>
            <td>Stream id</td>
        </tr>
        <tr>
            <td><code>stream.link</code></td>
            <td>https://twitch.tv/darkviperau</td>
            <td>Stream page</td>
        </tr>
        <tr>
            <td><code>stream.game</code></td>
            <td>Minecraft</td>
            <td>Game name</td>
        </tr>
        <tr>
            <td><code>stream.thumbnail</code></td>
            <td>https://.../...</td>
            <td>Stream thumbnail</td>
        </tr>
        <tr>
            <td><code>stream.live.since</code></td>
            <td><t:1715878720:R></td>
            <td>Time since live</td>
        </tr>
        <tr>
            <td><code>stream.live.start</code></td>
             <td><t:1715878720:f></td>
            <td>Live start time</td>
        </tr>
    </tbody>
</table>
<br />

<mark>
    Bluesky placeholders
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>post.id</code></td>
            <td>3lr667tbkdc2i</td>
            <td>Post id</td>
        </tr>
        <tr>
            <td><code>post.type</code>*</td>
            <td>post, repost, or reply</td>
            <td>Post type</td>
        </tr>
        <tr>
            <td><code>post.text</code>*</td>
            <td>me: may i have one vitamin</td>
            <td>Post text</td>
        </tr>
        <tr>
            <td><code>post.link</code></td>
            <td>https://bsky.app/profile/did:plc:mkkvzj3q3pegqam2n7yuxbwy/post/3lr667tbkdc2i</td>
            <td>Post page</td>
        </tr>
        <tr>
            <td><code>post.posted.ago</code></td>
            <td><t:1715878720:R></td>
            <td>Time since post</td>
        </tr>
        <tr>
            <td><code>post.posted.at</code></td>
            <td><t:1715878720:f></td>
            <td>Post time & date</td>
        </tr>
        <tr>
            <td><code>creator.handle</code></td>
            <td>random-user</td>
            <td>Creator handle</td>
        </tr>
        <tr>
            <td><code>creator.posts</code></td>
            <td>784</td>
            <td>Amount of posts</td>
        </tr>
        <tr>
            <td><code>creator.followers</code></td>
            <td>48</td>
            <td>Amount of followers</td>
        </tr>
    </tbody>
</table>
<br />

*If a post is a reply, and your custom message has `{post.type}` it will display `replied to`, instead of the default `replied`.

<br />
<br />

<mark>
    Reddit placeholders
</mark>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>post.id</code></td>
            <td>123qwe</td>
            <td>Post id</td>
        </tr>
        <tr>
            <td><code>post.title</code></td>
            <td>Random title</td>
            <td>Post title</td>
        </tr>
        <tr>
            <td><code>post.text</code></td>
            <td>random text here</td>
            <td>Post body</td>
        </tr>
        <tr>
            <td><code>post.thumbnail</code></td>
            <td>https://.../..</td>
            <td>Post thumbnail</td>
        </tr>
        <tr>
            <td><code>post.flair</code></td>
            <td>Support</td>
            <td>Post flair</td>
        </tr>
        <tr>
            <td><code>post.posted.ago</code></td>
            <td><t:1715878720:R></td>
            <td>Time since post</td>
        </tr>
        <tr>
            <td><code>post.posted.at</code></td>
            <td><t:1715878720:f></td>
            <td>Post time & date</td>
        </tr>
        <tr>
            <td><code>author.username</code></td>
            <td>decompile1</td>
            <td>Author username</td>
        </tr>
        <tr>
            <td><code>author.id</code></td>
            <td>123qwe3</td>
            <td>Author id</td>
        </tr>
        <tr>
            <td><code>author.link</code></td>
            <td>https://reddit.com/user/decompile1</td>
            <td>Author url</td>
        </tr>
        <tr>
            <td><code>subreddit.name</code></td>
            <td>r/NotificationBot</td>
            <td>Subreddit name</td>
        </tr>
        <tr>
            <td><code>subreddit.id</code></td>
            <td>123qwe</td>
            <td>Subreddit id</td>
        </tr>
        <tr>
            <td><code>subreddit.members</code></td>
            <td>825k</td>
            <td>Subreddit members</td>
        </tr>
    </tbody>
</table>
<br />

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>ping</code></td>
            <td><@&920487197046607872></td>
            <td>Notify members</td>
        </tr>
        <tr>
            <td><code>creator.name</code></td>
            <td>Linus Tech Tips</td>
            <td>Creator username</td>
        </tr>
        <tr>
            <td><code>creator.id</code></td>
            <td>UCXuqSBlHAE6Xw-yeJA0Tunw</td>
            <td>Creator user id</td>
        </tr>
        <tr>
            <td><code>creator.link</code></td>
            <td>https://youtube.com/@LinusTechTips</td>
            <td>Creator page</td>
        </tr>
        <tr>
            <td><code>creator.avatar</code></td>
            <td>https://.../...</td>
            <td>Creator avatar url</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th width="192">Placeholder</th>
            <th>Example</th>
            <th width="181">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>guild.name</code></td>
            <td>gaming</td>
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
            <td>800,000</td>
            <td>Member count</td>
        </tr>
    </tbody>
</table>