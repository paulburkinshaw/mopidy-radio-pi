****************************
Authentication
****************************

Method used for authenticating users
====================================

The app is currently using unsecure cookies to keep logged in users state. 
This is because it doesnt seem currently possible to use Tornado's secure cookie functionality (there appears to be no way to set the cookie_secret value see: https://discuss.mopidy.com/t/authentication-in-tornado-application/816)