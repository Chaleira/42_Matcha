# 42_Matcha
A dating website using express and typecomposer


Falta:
- Manual queries
- Create 500 profiles for evaluatiton
- Mobile friendly
- Ban Commonly used English words on password
- Email link to confirm registration
- Email link to reset password 
- Users must be able to see who has viewed their profile.
- Users must also be able to see who has “liked” them.
- User fame rating
- See if the user is online
- Notifications

TODO:
- Create the manual queries with pg and raw sql (see gpt chat)
- Redo some parts of the backend for better organization and scaling (see gpt chat)
- Setup a remote postgresDB (see gpt chat)
- Handle migrations for smooth database development (see gpt chat)

NEW DATABASE SCHEMA:
users
├── id
├── username
├── email
├── first_name
├── last_name
├── password
├── created_at

profiles
├── user_id (FK)
├── bio
├── tags
├── location
├── gender
├── sexual_preference
├── pictures
├── fame_score
├── created_at

likes
├── liker_id
├── liked_id
├── created_at

matches
├── user1_id
├── user2_id
├── created_at

messages
├── sender_id (FK)
├── receiver_id (FK)
├── text
├── created_at

blocks
├── blocker_id
├── blocked_id
├── created_at

notifications
├── user_id
├── type (match, like, visit, message, unlike)
├── seen
├── created_at
