# Learn Flow

LMS Web Application — Complete Product & UI/UX Prompt

Build a modern, clean, responsive Learning Management System (LMS) web application based on the reference design/image that I will attach.

Use the attached reference design as the primary visual direction for layout, spacing, colors, typography, cards, navigation, buttons, forms and overall visual style.

use the same reference design blindly. Adapt its design language into a professional LMS interface.

1. Project Overview

Create a simple but complete LMS where:

Admin manages the LMS.

Students consume courses and YouTube-based video lessons.

Course videos are embedded from YouTube.

There are only 2 user roles:

Admin

Student

Keep the system simple. Do not add unnecessary enterprise features.

The application should feel like a real production-ready LMS, not a demo or static website.

2. User Roles

Admin

Admin can:

Login securely.

Access Admin Dashboard.

Create courses.

Edit courses.

Delete courses.

Publish/unpublish courses.

Add course thumbnail.

Add course description.

Add course category.

Add course level.

Add course duration.

Add instructors/author information if needed.

Add YouTube video lessons.

Edit lesson titles and descriptions.

Arrange lesson order.

Create course sections/modules.

Manage students.

View student enrollments.

View student course progress.

View basic LMS statistics.

Manage categories.

Manage profile/settings.

Logout.

Student

Student can:

Register.

Login.

Logout.

View Student Dashboard.

Browse available courses.

Search courses.

Filter courses by category/level.

View course details.

Enroll in courses.

Watch YouTube video lessons.

See course sections/modules.

Mark lessons as completed.

Continue from where they stopped.

Track course progress.

View completed courses.

View enrolled courses.

Update profile.

Change password.

Logout.

3. Authentication

Create a complete authentication flow.

Pages:

Login

Fields:

Email

Password

Remember me

Login button

Forgot password

Register link

Student Registration

Fields:

Full name

Email

Password

Confirm password

Only students can register publicly.

Admin accounts should be managed from the system/database and should NOT have a public admin registration page.

Include:

Form validation

Error messages

Loading states

Success messages

Logout functionality

Protected routes

Students must not be able to access Admin Dashboard.

Admins must not see Student Dashboard functionality unless intentionally viewing the student experience.

4. Admin Dashboard

Create a professional admin dashboard.

Sidebar

Include:

Dashboard

Courses

Categories

Students

Enrollments

Progress

Settings

Logout

Dashboard Overview

Show summary cards:

Total Students

Total Courses

Published Courses

Total Enrollments

Also show:

Recent Enrollments

Table:

Student

Course

Enrollment Date

Progress

Status

Popular Courses

Show courses with:

Thumbnail

Course title

Number of students

Completion/progress information

Keep charts simple and useful. Do not overload the dashboard with unnecessary analytics.

5. Course Management

Admin should have a dedicated Courses page.

Display courses in a clean table/card layout.

Each course should show:

Thumbnail

Course title

Category

Level

Lessons

Students

Status

Created date

Actions

Actions:

View

Edit

Delete

Publish/Unpublish

Include:

Add Course

Fields:

Course title

Short description

Full description

Thumbnail

Category

Level

Duration

Instructor/Author

Course status

Status:

Draft

Published

6. Course Structure

Each course can contain multiple sections/modules.

Example:

Course:
"Digital Marketing Masterclass"

Section 1:
"Introduction"

Lessons:

Introduction to Digital Marketing

Understanding Your Audience

Digital Marketing Channels

Section 2:
"SEO Basics"

Lessons:

What is SEO?

Keyword Research

On-Page SEO

Admin should be able to:

Add section

Rename section

Delete section

Reorder section

Add lesson

Edit lesson

Delete lesson

Reorder lessons

Use a simple drag-and-drop interface if practical.

7. YouTube Video Lessons

The main learning content will come from YouTube.

Admin should only need to enter a YouTube video URL.

Example:

https://www.youtube.com/watch?v=VIDEO_ID

The system should automatically extract the YouTube video ID and generate an embedded YouTube player.

Lesson fields:

Lesson title

YouTube URL

Description

Duration (optional)

Lesson order

Free preview toggle (optional)

Published status

Do NOT download or host YouTube videos.

Use YouTube's official embed/player functionality.

The video should play inside the LMS without redirecting the student away from the LMS.

8. Student Dashboard

Create a clean student-focused dashboard.

Sidebar

Dashboard

My Courses

Browse Courses

Completed Courses

Profile

Logout

Dashboard

Show:

Welcome Section

"Welcome back, [Student Name]"

Statistics

Enrolled Courses

Courses Completed

Courses In Progress

Overall Learning Progress

Continue Learning

Show courses that the student has started.

Each course card should show:

Thumbnail

Course title

Progress percentage

Progress bar

Current lesson

Continue Learning button

My Courses

Show enrolled courses.

9. Course Listing Page

Students can browse all published courses.

Include:

Search bar

Category filter

Level filter

Course cards

Course card:

Thumbnail

Course title

Short description

Category

Level

Number of lessons

Duration

Enroll/View Course button

Use pagination or load-more if there are many courses.

10. Course Details Page

Create a professional course details page.

Include:

Course Header

Course thumbnail

Course title

Description

Category

Level

Duration

Number of lessons

Instructor/author

Enroll button

Course Curriculum

Display:

Section 1

Lesson 1

Lesson 2

Lesson 3

Section 2

Lesson 1

Lesson 2

Show lesson count and total course information.

For enrolled students, show:

Course progress

Completed lessons

Continue Learning button

11. Learning / Video Player Page

This is one of the most important screens.

Layout:

Main Area

Large YouTube video player.

Below the player:

Lesson title

Lesson description

Previous Lesson

Mark as Complete

Next Lesson

Right Sidebar

Course curriculum:

Section 1

✓ Completed Lesson

▶ Current Lesson

Lesson 3

Section 2

Lesson 4

Lesson 5

The current lesson should be visually highlighted.

When the student clicks Mark as Complete:

Save lesson completion in database.

Update course progress.

Update dashboard progress.

Automatically show the next lesson if appropriate.

If the student leaves the course and returns later, open the last/current lesson they were watching.

12. Progress Tracking

Track progress at lesson level.

For example:

Course has 10 lessons.

Student completes 4 lessons.

Progress:

40%

Store:

Student ID

Course ID

Lesson ID

Completion status

Completion date

Last accessed lesson

Last accessed date

Course progress should automatically calculate from completed lessons.

Example:

Completed lessons / Total lessons × 100

Show progress as:

0%

25%

50%

75%

100%

When all lessons are completed:

Course status = Completed.

13. Enrollment System

Keep enrollment simple.

Student clicks:

Enroll Now

System creates an enrollment record.

Enrollment should contain:

Student

Course

Enrollment date

Progress

Status

Status:

In Progress

Completed

No payment system is required.

No subscription system is required.

No complicated membership system is required.

14. Student Profile

Student can update:

Full name

Profile picture

Email

Password

Show basic account information.

15. Admin Student Management

Admin can view all students.

Table:

Name

Email

Registration date

Enrolled courses

Completed courses

Status

Actions

Admin can:

View student

View enrolled courses

View course progress

Disable/enable student account if practical

16. Categories

Admin can:

Add category

Edit category

Delete category

Examples:

Web Development

Digital Marketing

Graphic Design

Business

Freelancing

SEO

Do not hardcode categories. They should be database-driven.

17. Search

Implement course search.

Student should be able to search by:

Course title

Description

Category

Search should update results without making the interface complicated.

18. Notifications / Feedback

Keep notifications simple.

Use toast notifications for:

Course created successfully

Course updated

Course deleted

Enrollment successful

Lesson completed

Profile updated

Login errors

Validation errors

Do not build a complicated notification center.

19. Database Architecture

Use a proper relational database structure.

Suggested entities:

users

id

name

email

password/auth reference

role

avatar

created_at

updated_at

Role:

admin

student

categories

id

name

description

created_at

courses

id

title

slug

short_description

description

thumbnail

category_id

level

duration

instructor

status

created_at

updated_at

sections

id

course_id

title

order

created_at

lessons

id

section_id

title

description

youtube_url

youtube_video_id

duration

order

status

created_at

enrollments

id

student_id

course_id

status

enrolled_at

completed_at

lesson_progress

id

student_id

course_id

lesson_id

completed

completed_at

last_accessed_at

Make sure proper foreign keys and relationships are used.

Avoid duplicate records.

20. UI/UX Requirements

Follow the attached reference design.

The interface should be:

Modern

Clean

Minimal

Professional

Easy to understand

Responsive

Fast

Accessible

Support:

Desktop

Tablet

Mobile

Use consistent:

Typography

Border radius

Buttons

Cards

Spacing

Icons

Form styles

Tables

Navigation

Do not overcrowd screens.

Use clear visual hierarchy.

21. Responsive Design

Desktop:

Fixed/sidebar navigation

Spacious dashboard

Multi-column course cards

Tablet:

Responsive sidebar

Adjust card grid

Mobile:

Collapsible navigation

Single-column course cards

Mobile-friendly video player

Easy-to-use curriculum

Sticky or accessible learning controls

The LMS must remain fully usable on mobile.

22. Empty States

Create professional empty states.

Examples:

"No courses available yet."

"You haven't enrolled in any courses."

"No students found."

"No lessons added yet."

Include useful CTA buttons where appropriate.

23. Loading States

Add loading skeletons/spinners for:

Dashboard

Course listing

Course details

Student list

Course management

Video/lesson data

Avoid showing blank screens while data loads.

24. Error Handling

Handle:

Invalid login

Invalid YouTube URL

Missing course information

Failed database requests

Unauthorized access

Missing course/lesson

Deleted course

Network errors

Show clear user-friendly messages.

Do not expose technical errors to users.

25. Security

Implement proper:

Authentication

Authorization

Protected routes

Role-based access

Database security

Input validation

A student must never be able to access admin-only operations through the frontend.

Do not rely only on frontend role checks. Apply authorization at the backend/database level as well.

26. Admin Settings

Keep settings simple.

Include:

Admin profile

Name

Email

Password change

LMS basic information if useful

Logout

Do not create unnecessary advanced settings.

27. Technical Requirements

Build this as a real full-stack application.

Use:

Modern React-based frontend

TypeScript

Proper component architecture

Supabase or another suitable backend/database supported by Lovable

Authentication

Relational database

Secure database policies

Responsive CSS

Reusable UI components

Keep the code clean and maintainable.

Do not create one huge component.

Separate:

Layout

Pages

Components

Forms

Dashboard components

Course components

API/database logic

Authentication logic

28. Important Functional Rules

Only Admin and Student roles exist.

Only Admin can create/manage courses.

Students can publicly register.

Students can only see published courses.

YouTube videos must be embedded, not downloaded.

Student progress must be saved in the database.

Students should continue from their last lesson.

Course progress must update automatically.

Admin can see student progress.

Admin can publish/unpublish courses.

Unpublished courses must not be visible to normal students.

Students cannot access admin functionality.

Do not add payment functionality.

Do not add unnecessary features.

Keep the LMS simple, fast and easy to manage.

29. Demo / Seed Data

Create realistic sample data so the UI can be tested immediately.

Create:

1 admin account

Several student accounts

5 sample courses

Multiple sections per course

Multiple YouTube lessons per course

Sample enrollments

Sample lesson progress

Clearly separate demo data from production-ready functionality.

30. Final UI Screens

Make sure the application includes at minimum:

Public

Login

Student Registration

Student

Student Dashboard

Browse Courses

Course Details

Learning/Video Player

My Courses

Completed Courses

Profile

Admin

Admin Dashboard

Courses

Add Course

Edit Course

Course Curriculum/Builder

Categories

Students

Student Details

Enrollments

Progress

Settings

31. Design Priority

Priority order:

Functionality

Clean UX

Responsive design

Visual quality

Performance

Do not sacrifice functionality for visual effects.

Avoid excessive animations, gradients, complicated charts, unnecessary popups or decorative elements.

The final product should look like a professional modern LMS SaaS application, while remaining simple enough for a non-technical admin to manage.

32. Before Building

First analyze the attached reference design carefully.

Identify:

Color palette

Typography

Layout

Sidebar style

Header

Cards

Buttons

Tables

Forms

Spacing

Border radius

Icon style

Then create the LMS using the same overall visual language.

Do not ask me to manually create database tables or write code.

Set up the complete application structure, database schema, authentication, role permissions, pages and core functionality inside the project.

After implementation, verify all major user flows:

Admin → Login → Create Course → Add Sections → Add YouTube Lessons → Publish Course

Student → Register → Login → Browse Course → Enroll → Watch Lesson → Mark Complete → Progress Updates → Continue Learning → Complete Course

Fix any broken flows, UI issues, responsive issues or database relationship problems before considering the project complete.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2d040136-4746-4568-8774-755fb8cc4c5f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
