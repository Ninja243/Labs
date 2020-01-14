import { combineReducers } from 'redux';

// Login funcs

// Random string generator for nonce
function randomString(length) {
    var result = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return result;
}
// Auth0 constants
const auth0ClientId = 'KLciWpxigi9TW81egFgImpCx5bEFTNgq';
const auth0Domain = 'https://mweya-labs.eu.auth0.com';
// Converts an object to a query string.
function toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

// REDUX

export const authIn = profile => (
    {
        type: 'LOG_IN',
        payload: profile
    }
);

export const authOut = profile => (
    {
        type: 'LOG_OUT',
        payload: profile
    }
);

const authReducer = (state = INITIAL_STATE, action) => {
    const {
        current, possible
    } = state;
    switch (action.type) {
        case 'LOG_IN':
            async function login() {
                // Retrieve the redirect URL, add this to the callback URL list
                // of your Auth0 application.
                const redirectUrl = "https://auth.expo.io/@mweya/labsclient";//= AuthSession.getRedirectUrl();
                console.log(`Redirect URL: ${redirectUrl}`);

                // Structure the auth parameters and URL
                const queryParams = toQueryString({
                    client_id: auth0ClientId,
                    redirect_uri: redirectUrl,
                    response_type: 'id_token', // id_token will return a JWT token
                    scope: 'openid profile name email', // retrieve the user's profile
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

                const { name, given_name, family_name, nickname, email } = decoded;
                //this.setState({ name });
                var profile = {
                    name: name,
                    given_name: given_name,
                    family_name: family_name,
                    nickname: nickname,
                    email: email,
                };
                current.push(profile);
                const newState = { current, possible };
                return newState;
            };
            login();

        default:
            return state;

        case 'LOG_OUT':

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



export default combineReducers({

    auth: authReducer
});

//friends: friendReducer,







/*const friendReducer = (state = INITIAL_STATE, action) => {
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
};*/