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


# Frontend
- Commonly used English words should not be accepted as passwords.
- Users must be able to see who has viewed their profile.
- Users must also be able to see who has “liked” them.
- The list of suggested profiles must be sortable by age, location, “fame rating”, and common tags.
- Fame rating on profile
- Users must clearly see if the profile they are viewing has “liked” them or if they are already “connected”. They must also have the option to “unlike” or disconnect from that profile.
- Users must receive real-time notifications6 for the following events:
	• When they receive a “like”.
	• When their profile has been viewed.
	• When they receive a message.
	• When a user they “liked” also “likes” them back.
	• When a connected user “unlikes” them.

# Backend
- They should also have the option to request a password reset email if they forget their password.
- Users should not be able to like if they have no profile picture #(backend part done)#

# Frontend/Backend
- Users must be able to update their email address.
- Matches must be intelligently determined3 based on:
	◦ Proximity to the user’s geographical location.
	◦ The highest number of shared tags.
	◦ The highest “fame rating”.
- Users must be able to filter the list based on age, location, “fame rating”, and common tags.
- Users must be able to perform an advanced search by selecting one or more criteria, such as:
	• A specific age range.
	• A “fame rating” range.
	• A location.
	• One or multiple interest tags.
	Similar to the suggested list, the search results must be sortable and filterable by age,
	location, “fame rating”, and interest tags.




- See the cors error when realoding own profile
- implement notification readability