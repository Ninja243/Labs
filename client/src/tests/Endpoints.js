

export function privScopedEndpointTest() {
    const profile = this.props.profile;
    var x;
    if (profile.length != 0) {
        x = profile[0].length - 1;

    } else {
        console.log("Profile", profile)
    }
    const hdrs = {
        'authorization': 'Bearer ' + profile[0][x],

    };
    //console.log(hdrs)
    // aud: "https://mweya-labs.eu.auth0.com/api/v2/"
    fetch("https://jl.x-mweya.duckdns.org/api/private-scoped", {
        method: "GET",
        headers: hdrs

    })
        .then((response) => response.text())
        .then((quote) => {
            if (quote != "Hello from a private endpoint! You need to be authenticated to see this.") {
                //console.log(quote);
            }
            this.setState({
                psEndpointTest: quote
            })
        })
        .done();
}

// What the fuck
export function getEndpointText() {
    // Throttle this to once every 5 seconds
    var q = this.state.pEndpointTest;
    var lc = Date.now();
    var delta = (lc - this.state.lastSilentCheck);
    //console.log(delta);
    if (delta > 3 * 1000) {

        //console.log("Checking");
        if ((q.localeCompare("Token is expired") == 1) || q.localeCompare("Not set") == 1) {
            //console.log("Silent login");
            this.silentLogin();
            if ((q.localeCompare("Token is expired") == 1) || q.localeCompare("Not set") == 1) {
                //console.log("logging out");
                this.logout();
            }
            //q = this.getEndpointText();

        }
        this.setState({
            lastSilentCheck: lc
        })

    }
    return q;
}

export function privEndpointTest() {
    const profile = this.props.profile;
    var x = null;
    if (profile.length != 0) {
        x = profile[0].length - 1;

    } else {
        console.log("Profile", profile)
    }
    const hdrs = {
        'authorization': 'Bearer ' + profile[0][x],

    };
    //console.log(hdrs)
    // aud: "https://mweya-labs.eu.auth0.com/api/v2/"
    fetch("https://jl.x-mweya.duckdns.org/api/private", {
        method: "GET",
        headers: hdrs

    })
        .then((response) => response.text())
        .then((quote) => {
            if (quote != "{\"message\":\"Hello from a private endpoint! You need to be authenticated to see this.\"}") {
                console.log(quote);
            }
            this.setState({
                pEndpointTest: "Error => " + quote
            })
        })
        .done();
}