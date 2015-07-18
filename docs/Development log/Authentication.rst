****************************
Authentication
****************************

Method used for authenticating users
====================================

The app is currently using unsecure cookies to keep logged in users state. 

This is because it doesnt seem currently possible to use Tornado's secure cookie functionality (there appears to be no way to set the cookie_secret value see: https://discuss.mopidy.com/t/authentication-in-tornado-application/816)

currently I am setting a cookie called userAuthenticated to true when a user logs in (still need to get username and password from db or a text file)

Ideas
=====
Store the usernames \ passwords in a text file on the pi so dont need to use a db

On sucessful login, have the code create a cookie called <username>_cookie (where username is the name of the user) and set the value of this cookie to the password
when the user logs in. 
Cross check the value in this cookie with the password for this user in the txt file for each request
