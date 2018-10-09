# express-auth

Email / Password authentication done in the least fuss way possible.

Uses PassportJS to handle email/password log in & hashes/salts the password as its saved to MongoDB.

Importantly, this will continue to keep the user logged in. This means across tabs & when the server restarts.

Uses NuxtJS (Helper Framework for VueJS) to handle the front-end.

## How to run
- `npm i nodemon -g` (If you don't already have it)
- `npm i`
- `npm run dev`
