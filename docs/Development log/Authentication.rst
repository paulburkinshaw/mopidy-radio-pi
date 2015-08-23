****************************
Authentication
****************************

Method used for authenticating users
====================================

The app is currently using unsecure cookies to keep authenticated user state across the app 

This is because it is currently not possible to use Tornado's secure cookie functionality (there appears to be no way to set the cookie_secret value see: https://discuss.mopidy.com/t/authentication-in-tornado-application/816)

Currently we do the following when a user attempts to login:

	- Get a list of usernames and passwords from a .csv file and load them into a dict (done globally)
	- Override the get_current_user() method in the BaseHandler 
		- get the logged in user from the logincookie_user cookie - self.get_cookie("logincookie_user")
		- get_current_user sets self.current_user and returns its value 
	- Check if the username entered by the user matches a username key in the dict
		- if it does check the password entered by the user matches the value of the dict item
		- if it doesnt match any key in the dict or if the password doesnt match display an 'invalid username or password message'
	- Set 2 cookies: logincookie_user, logincookie_password with the following values respectively
		- [username entered by the user], [password entered by the user]
	- Redirect the user to the index page

In each RequestHandler we do the following before rendering the page
	
	- Check a value is present in self.current_user
		- if not then redirect to login page
		- if a value does exist then check the value in self.current_user matches a key in the above users dict
			- if it does then check if the passord in logincookie_password matches the value for the above key
				- if no key exists for this value or the password doesnt match redirect to the login page
	- If all the above are true render the page


