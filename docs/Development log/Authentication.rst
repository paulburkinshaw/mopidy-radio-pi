****************************
Authentication
****************************

Method used for authenticating users
====================================

The app is currently using unsecure cookies to keep authenticated user state across the app 

This is because it is currently not possible to use Tornado's secure cookie functionality (there appears to be no way to set the cookie_secret value see: https://discuss.mopidy.com/t/authentication-in-tornado-application/816)

Currently we do the following when a user attempts to login:

	- Get a list of usernames and passwords from a .csv file and load them into a dict
	- Check if the username entered by the user matches a username key in the dict
		- if it does check the password entered by the user matches the value of the dict item
		- if it doesnt match any key in the dict or if the password doesnt match display an 'invalid username or password message'
	- Set 3 cookies: logincookie_user, logincookie_password, userAuthenticated with the following values respectively
		- [username entered by the user], [password entered by the user], [true]
	- Redirect the user to the index page

In each RequestHandler we do the following before rendering the page
	
	- Get a list of usernames and passwords from a .csv file and load them into a dict
	- Check if the userAuthenticated cookie is set to true 
		- if it is not then redirect to login page
	- Check a cookie exists called logincookie_user 
		- if not then redirect to login page
		- if it does exist then check the value in the cookie matches a key in the above users dict
			- if it does then check if the passord in logincookie_password matches the value for the above key
				- if no key exists for this value or the password doesnt match redirect to the login page
	- If all the above are true render the page

Ideas
=====
