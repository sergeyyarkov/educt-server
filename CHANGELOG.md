# Changelog

## [1.4.2] - 2022-12-06

## Added

- Uploading video from url source (YouTube, Vimeo, .mp4, etc..)
- Added student and teacher to seeders

## Fix

- Removing lesson files from drive when deleting course, category or user.
- Fixed lesson display ordering when seeding database
- Refactored bouncer actions

## [1.3.2] - 2022-06-06

## Added

- Updated npm dependencies
- [Added](https://github.com/sergeyyarkov/educt-server/commit/294a4f584dd39d295372802305004365fb01fdb2) `MAILER` env variable

## Fix

- Fixed schema validator on saving lesson order
- Fixed lesson [duration updating](https://github.com/sergeyyarkov/educt-server/commit/ffdebc4f927abe3b63c62c84268f40f9e6663895#diff-86d18314585862595621b4e90f675b79ac74e7a0a47b2797556902eeff75e14a)
- Updated cors config
- Deleted `api` from path url

## [1.3.1] - 2022-04-10

## Added

- Docker files for building container

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
