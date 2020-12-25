# social-net-api
Social net API written in Node.js using Nest.

# features
- CRUD on Posts, Likes, Comments
- Ability to register / login, authenticate using JWT
- Clean architecture

# how to run

1. Install Node.js and npm or yarn
2. Clone the repository
3. Define JWT_EXPIRATION and JWT_PRIVATE_KEY environment variables either by hand or using .env file
4. Do one of the following:
  - Run the dev build using "yarn dev" or "npm run dev"
  - Run the production build using "yarn build && yarn start" or "npm run build && npm run start"
