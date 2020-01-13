import { combineReducers } from 'redux';

export const addFriend = friendIndex => (
    {
        type: 'ADD_FRIEND',
        payload: friendIndex,
    }
);

export const logIn = profile => (
    {
        type: 'LOG_IN',
        payload: profile
    }
);

const logInReducer = (state = INITIAL_STATE, action) => { 
    switch (action.type) { 
        case 'LOG_IN':
            const {
                current, possible
            } = state;

            // Auth0 login here

            // Auth0 constants
            const auth0ClientId = 'KLciWpxigi9TW81egFgImpCx5bEFTNgq';
            const auth0Domain = 'https://mweya-labs.eu.auth0.com';

            // Random string generator for nonce
            function randomString(length) {
                var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._'
                result = ''

                while (length > 0) {
                    var bytes = new Uint8Array(16);
                    var random = window.crypto.getRandomValues(bytes);

                    random.forEach(function (c) {
                        if (length == 0) {
                            return;
                        }
                        if (c < charset.length) {
                            result += charset[c];
                            length--;
                        }
                    });
                }
                return result;
            }

            /**
             * Converts an object to a query string.
             */
            function toQueryString(params) {
                return '?' + Object.entries(params)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
            }

            login = async () => {
                // Retrieve the redirect URL, add this to the callback URL list
                // of your Auth0 application.
                const redirectUrl = "https://auth.expo.io/@mweya/labsclient";//= AuthSession.getRedirectUrl();
                console.log(`Redirect URL: ${redirectUrl}`);

                // Structure the auth parameters and URL
                const queryParams = toQueryString({
                    client_id: auth0ClientId,
                    redirect_uri: redirectUrl,
                    response_type: 'id_token', // id_token will return a JWT token
                    scope: 'openid profile name', // retrieve the user's profile
                    nonce: randomString(5)//'nonce', // ideally, this will be a random value
                });
                const authUrl = `${auth0Domain}/authorize` + queryParams;

                // Perform the authentication
                const response = await AuthSession.startAsync({ authUrl });
                console.log('Authentication response', response);

                if (response.type === 'success') {
                    this.handleResponse(response.params);
                }
            };

            handleResponse = (response) => {
                if (response.error) {
                    Alert('Authentication error', response.error_description || 'something went wrong');
                    return;
                }

                // Retrieve the JWT token and decode it
                const jwtToken = response.id_token;
                const decoded = jwtDecode(jwtToken);

                const { name } = decoded;
                this.setState({ name });
            };


        case 'LOG_OUT':
            const {
                current, possible
            } = state;
            logout = async () => {
                const deauthURL = "https://mweya-labs.eu.auth0.com/v2/logout?returnTo=";
                //AuthSession.dismiss();
                /*const response = await AuthSession.startAsync({deauthURL});
                console.log('Deauth response', response);
                if (response.type === 'success') {
                  this.handleResponse(response.params);
                }*/
                /*await Linking.openURL(
                  //config.logoutUrl +
                  deauthURL +
                    encodeURIComponent(
                      ""
                    ) 
                    +"&client_id="+
                    encodeURIComponent(auth0ClientId)// __DEV__ ? "exp://localhost:19000" : "app:/callback"
                );*/
                await fetch(deauthURL + encodeURIComponent("") + "&client_id=" + encodeURIComponent(auth0ClientId))
                    .then((response) => response.text())
                    .then((code) => {
                        console.log(code);
                        if (code === "OK") {
                            this.setState({ name: null });
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
};

const friendReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_FRIEND':
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            const {
                current,
                possible,
            } = state;

            // Pull friend out of friends.possible
            // Note that action.payload === friendIndex
            const addedFriend = possible.splice(action.payload, 1);

            // And put friend in friends.current
            current.push(addedFriend);

            // Finally, update our redux state
            const newState = { current, possible };
            return newState;
        default:
            return state;
    }
};

export default combineReducers({
    friends: friendReducer,
});