# Stuff I don't understand
 * ##  :neckbeard: Go
   * ~Context~
     - ~Why~
     - ~How do you add info to the context?~
     - ~When should contexts be created?~
     - ~https://github.com/auth0/go-jwt-middleware 
       - ~Using it -> negroni~
       - ~Where the heck is the "User" bit stored in context coming from~
       - ~https://stackoverflow.com/questions/39779243/go-restful-jwt-authentication~
         - ~Is the jwt middleware adding it to the user key automatically?!~
         - ~How do I read it?~
 * ##  :neckbeard: Auth0
   * Auth0/Oauth2 authentication flow
   * ~Tokens~
     - ~Can I use one to resolve the other?~
     - ~Why don't I get both `id_token` and `token` tokens when logging in?~
   * ~Authentication~
   * Identification
     - How do I restrict the requests that these users can make to their accounts only?
     - Currently the client stores a user's JWT and the name bit of their OpenID profile
       - Is the Email they use for Google unique enough to use as a key?
       - Can I resolve a user's information from the JWT they supply to the API?
         - What would the flow for checking that look like?
         - Giving the {authdomain}/userinfo the access token looks like it will return a normalized user profile
           - https://mweya-labs.eu.auth0.com/?access_token={token}
             - 2 requests per second with 10 requests in each burst is really not enough
               - https://auth0.com/docs/policies/rate-limits
               - Server side cache?
               - Time to switch away from Implicit Grant?
                 - Client is not a secure place for a private key
           - ~Just need the middleware to pass the token to a function~
           - ~Or add to the middleware and return a profile with the response writer and the location of the request?~
       - ~Should I be sending the JWT over to the API for Auth?~
   * Scopes
     - How should I be using them?
     - Does each user get a set of scopes assigned to them when they log in?
     - Can scopes be made more granular? 
       - Can scopes be changed or assigned by the API?
   * ~How did I miss this?~
     - ~https://github.com/auth0/react-native-auth0~
       - ~Kinda considering trying to ditch the AuthSession browser for a fetch method instead, how would I emulate the user's consent flow without raising a huge red flag?~
       - ~This module's documentation doesn't seem to be done yet, should I really be considering switching over to it?~
       - ~https://community.auth0.com/t/implementing-auth0-in-react-native-expo-app/17406/14 Seems to suggest that this might not work with Expo 33~
         - ~I mean yes I'm on Expo 36 but still~
   * ~What is the audience parameter and how should it be sent to the API~
     - ~**MIGHT BE USING THE WRONG TOKEN, WE WANT ACCESS NOT ID**~
     - ~https://auth0.com/docs/api-auth/tutorials/client-credentials Seems to suggest that I should be handling the auth browser's functions myself so that I can have access to the data that is about to be posted instead of leaving all of that up to expo, however that also sounds like a pretty bad idea.~
     - ~Should the API automatically resolve acceptable audiences?~
       - ~https://auth0.com/docs/quickstart/spa/react/02-calling-an-api#specify-the-api-audience Seems to suggest that the audience should be stored in an .env file~
       - ~https://github.com/Ninja243/Labs/blob/master/server/.env Looks like it's already defined, the client might just not be giving the right audience?~
       - ~The aud I get back is the same as the client ID?~
       - ~Ok, this just doesn't work https://manage.auth0.com/dashboard/eu/mweya-labs/apis/5e0f33cea4414107f2bd7929/test~
       - ~Script created that tests the API using creds from auth0. Invalid Audience. https://github.com/Ninja243/Labs/blob/master/Test%20scripts/AudienceAPITest.py~


 * ##  :bamboo: NoSQL DBs
   * RAM usage
     - Is it higher? Which solutions are better when? 
       - I've always just thought that they're interchangable

 * ##  :imp: React/JSX
   * Loading screens via async/await
     - Do I just not understand async?

 * ##  :imp: React/Redux
   * readyState has an initial state of false, however when checked on boot it's 'undefined'

 * ##  :books: Legal
   * Is writing my own policies a good idea?
   * Is there a service I can use to look through my policies and make sure they're ok that doesn't cost regular lawyer prices?
   * Have I done enough for GDPR compliance?
   * Do I need to register my Ad Engine somewhere?
   * Everything posted to the app will be done so under a Creative Commons license. Is this enough to stop DMCA complaints?
   * Do I need to be worried about the DMCA?
