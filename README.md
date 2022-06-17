# NotePost-Social-Network
John Abbott College's Full Stack Developer (FSD-03) Web Development-II Social Network Project

Our task is to create a Social Network Website using the tools and technologies that we learned about in the current class Web Development II and the Full Stack Developer program, such as React, NodeJS, Bootstrap, MySQL Driver, Validation, Security among others.
Setup Amazon S3 server for storing images
Setup Amazon DB for handle our MySql instance
Use Heroku for hosting our project

It will be needed at least the following routes:
/
/login
/register
/:username
/:username/about
/:username/friends
/post/:id
/post/new     /post/:id/edit (my own posts only)
/admin
/admin/stats

The main page (/) will be the landing page. If you are not logged in, you’ll be invited to login (/login). If it is your first visit and want to become a member you’ll need to register first (/register). In those cases you’ll be redirected to the mentioned pages. 

If you are logged in, you’ll Read all the posts and comments of you and your friends.You can see your profile (/:username). You can modify your profile (/:username/about).

You can Read the list of your friends (/:username/friends).

You can Create a new post at the top of the same page or comment on a post that is already there, made by you or your friends. You can Update / Delete your posts and you can Create a comment to a post that already exists (/post/:id).

The admin user can Delete the posts of any user (/admin), if any doesn’t follow the site policies. Also, can see the site statistics (/admin/stats).
