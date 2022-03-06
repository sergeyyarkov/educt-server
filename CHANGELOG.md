# Changelog

## Unreleased

- API deployment with Docker and Nginx web server.

## [1.2.1] - 2022-03-06

## Added

- Saving latest notifications about new messages
- Saving recent conversation messages based on constant (now 100)
- Simple chat implementation between users
- Added `about` and `last_login` columns for user
- Updating info api route of authorized user

### Fix

- Refactored routes import
- Fixed updating user info
- Cleaning up session store before starting websocket server

## [1.1.0] - 2022-01-31

### Added

- Cloud storate support (AWS S3)
- Websocket server with redis session storage (online counter)
- Videos controller in api (video viewing rights)
- Categories updating operations
- Statistics controller in api (online count, lessonc count, courses count)
- Materials count for each lessons
- Users pagination
- Batch actions with students (detaching from course)

### Fix

- Creating materials for lesson
- Contacts updating

## [1.0.0] - 2021-11-25

### Added

- Base CRUD operations on models
- Displaying a background by API for each course
- Authentication with API tokens
- Email updating with verification
- Updating the password of an authenticated user
- Downloading materials from each lesson
- Implemented simple role-based route access control
- Course likes system
- Access to lesson materials
- Lesson ordering
