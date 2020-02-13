## README

### Application links

- client: https://chatroom-client-bwyao.herokuapp.com/
- server: https://chatroom-server-bwyao.herokuapp.com/

### Database

- mongodb (preferably atlas)

### Collections

- `messages: { sender: String, text: String, time: Date }`
- `users: { fingerprintId: String, username: String, lastActiveTime: Date }`
- `nouns: { word: String }`
- `verbs: { word: String }`
- `adjs: { word: String }`

### Word database used

- https://wordnet.princeton.edu/download/current-version

### Environment variables

- `PORT=8080`
- `DB_CONNECTION_STRING=mongodb+srv://{username}:{password}@{url}/{database}`

### Installation

- `git clone` this repository
- `npm install`
- create a `.env` file in the root directory and fill in environment variables
- `npm run start`
- navigate to `localhost:8080` to view
