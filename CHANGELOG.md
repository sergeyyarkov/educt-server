# Changelog

## Unreleased

- API deployment with Docker and Nginx web server.

## [1.1.1] -

## Added

- About description for user and `last_login` column date

### Fix

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
