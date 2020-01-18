# Stuff I don't understand
 * ## Auth0
   * Auth0/Oauth2 authentication flow
   * ~Authentication~
   * Identification
     - How do I restrict the requests that these users can make to their accounts only?
     - Currently the client stores a user's JWT and the name bit of their OpenID profile
       - Is the Email they use for Google unique enough to use as a key?
       - Can I resolve a user's information from the JWT they supply to the API?
       - Should I be sending the JWT over to the API for Auth?
   * Scopes
     - How should I be using them?
     - Does each user get a set of scopes assigned to them when they log in?
     - Can scopes be made more granular? 
       - Can scopes be changed or assigned by the API?
   * How did I miss this?
     - https://github.com/auth0/react-native-auth0
       - Kinda considering trying to ditch the AuthSession browser for a fetch method instead, how would I emulate the user's consent flow without raising a huge red flag?
       - This module's documentation doesn't seem to be done yet, should I really be considering switching over to it?
       - https://community.auth0.com/t/implementing-auth0-in-react-native-expo-app/17406/14 Seems to suggest that this might not work with Expo 33
         - I mean yes I'm on Expo 36 but still
   * What is the audience parameter and how should it be sent to the API
     - https://auth0.com/docs/api-auth/tutorials/client-credentials Seems to suggest that I should be handling the auth browser's functions myself so that I can have access to the data that is about to be posted instead of leaving all of that up to expo, however that also sounds like a pretty bad idea.
     - Should the API automatically resolve acceptable audiences?
       - https://auth0.com/docs/quickstart/spa/react/02-calling-an-api#specify-the-api-audience Seems to suggest that the audience should be stored in an .env file


 * ## NoSQL DBs
   * RAM usage
     - Is it higher? Which solutions are better when? 
       - I've always just thought that they're interchangable

 * ## React/JSX
   * Loading screens via async/await
     - Do I just not understand async?

 * ## React/Redux
   * readyState has an initial state of false, however when checked on boot it's 'undefined'

# Stuff I should change before moving to prod
 * ## MongoDB
   * Set up persistant storage using a volume so reboots don't get rid of everything
 * ## Go
   * Set up first run detection so that the privacy policy and other legal documents aren't forced into the DB whenever the API starts
 * ## Docker
   * Load balancing
 * ## React
   * Regen keys
