// TODO
// Split this behemoth into packages
//   - DB package
//   - Routing package
//   - DataStore package
//	    - Togglable cache keeping some structs in RAM
//   - Legal package
//   - Logging package
//      - Write actual logfiles
package main

//"github.com/gorilla/context" <-  too old
import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/codegangsta/negroni"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"http"
)

//"path/filepath"

// Global variable to store the global DB client to be used to perform transactions
var dbclient mongo.Client

// Global handle variable that points to the users collection in the database
var users mongo.Collection

// Global handle variable that points to the labs collection in the database
var labs mongo.Collection

// Global handle variable that points to the ads collection in the database
var ads mongo.Collection

// Global handle variable that points to the legal collection in the database
var legal mongo.Collection

// Structs describing the kind of data that this application will store. A "Lab"
// is a single page of code, a user is an account.

// Lab contains an ID for identification as well as a name (very similar to a title)
// as well as code to display and metadata pertaining to it.
type Lab struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Code     string    `json:"code"`
	Views    int       `json:"views"`
	Uploaded time.Time `json:"uploaded"`
	Rating   float64   `json:"rating"`
	Language string    `json:"language"`
}

// Ad contains an ID for identification as well as a title, subtitle and a link to
// both an image and a video. The idea is that when the image is clicked on, a video can
// play, advertising the product. If the video is then clicked on, we are reasonably sure
// that the user is interested in the product so the user can then migrate away to the
// "action" link the advertiser has payed for. This is NOT meant to be an intrusive
// experience and can be removed with minimal effort.
type Ad struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	Subtitle       string `json:"subtitle"`
	BannerImageURL string `json:"bannerURL"`
	ModalVideoURL  string `json:"modalVideoURL"`
	Views          int64  `json:"views"`
	ViewsPaidFor   int64  `json:"viewsBought"`
	Owner          string `json:"owner"`
	Action         string `json:"action"`
}

// User describes a basic user on this system, storing information about the user's
// particulars and their activity on the system.
//
// The following values might not be needed for the final product, so for legality's
// sake I'll leave them out.
//	FirstName      string    `json:"firstname"`
//	LastName       string    `json:"lastname"`
//	Affiliation    string    `json:"affiliation"`
// The ID here can be the first bit of the email address received
// from the Google OAuth2 flow.
type User struct {
	ID             string    `json:"id"`
	LabsCreated    []string  `json:"labs"`
	AccountCreated time.Time `json:"datecreated"`
}

// LegalPolicy describes a generic type of legal policy governing the terms of use of
// this system, and contains information about the policy's creation date.
type LegalPolicy struct {
	PolicyType   string    `json:"type"`
	LastModified time.Time `json:"modified"`
	Policy       string    `json:"content"`
}

// TODO
// Cache is a struct that will be used to store recently accessed user data to reduce
// the number of network requests sent
type Cache struct {
	Users []User `json:"users"`
	Ads   []Ad   `json:"ads"`
	Labs  []Lab  `json:"labs"`
}

// Auth0 structs I don't quite understand yet go here

// Response is a struct that defines a message gotten from a JSON document
type Response struct {
	Message string `json:"message"`
}

// Jwks is a struct containing an array of JSONWebKeys (defined below)
type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

// JSONWebKeys is a struct that contains the web keys in the token
type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

// Functions for debugging go here.

// TODO logging

//

// Adds my information to the system for testing
func addMweya() {
	var myLabs []string
	mweya := User{
		"mweya-test", myLabs, time.Now(),
	}
	_, err := users.InsertOne(context.Background(), mweya)
	if err != nil {
		log.Fatal(err)
	}
}

// Adds a test advert to they system for testing
func addTestAd() {
	ad := Ad{
		"helloworld", "Looking for a developer?", "Hire the developer of this app!", "https://mweya.duckdns.org/lowrez", "", 0, math.MaxInt64, "Mweya Ruider", "https://mweya.duckdns.org/cv",
	}
	_, err := ads.InsertOne(context.Background(), ad)
	if err != nil {
		log.Fatal(err)
	}
}

// Functions governing the behaviour of the system go here, from responding to
// requests that cannot be satisfied to the creation of users.

// GDPR Compliance
// https://gdpr.eu/checklist/

// TODO
// Returns all the data a user has given to the system (user struct and their labs) in
// JSON
func requestData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Get user struct
	//var user User
	// Check scope
	// Return user struct

}

// Inserts the privacy policy into the DB, run this once when setting up
func insertInitialPrivacyPolicy() {
	dat, err := ioutil.ReadFile("static/privacy.txt")
	if err != nil {
		log.Print(err.Error())
		return
	}
	policy := LegalPolicy{
		"Privacy Policy", time.Now(), string(dat),
	}

	_, err = legal.InsertOne(context.Background(), policy)
	if err != nil {
		log.Writer().Write([]byte(err.Error()))
	}
}

// Inserts the terms of service into the DB, run this once when setting up
func insertInitialToS() {
	dat, err := ioutil.ReadFile("static/terms.txt")
	if err != nil {
		log.Print(err.Error())
		return
	}
	policy := LegalPolicy{
		"Terms of Service", time.Now(), string(dat),
	}

	_, err = legal.InsertOne(context.Background(), policy)
	if err != nil {
		log.Writer().Write([]byte(err.Error()))
	}
}

// Auth0 test functions
// helloPublic is to be used on public endpoints that do not require authen
func helloPublic(w http.ResponseWriter, r *http.Request) {
	message := "Hello from a public endpoint! You don't need to be authenticated to see this."
	responseJSON(message, w, http.StatusOK)
}

// Test function for a private endpoint that requires an authenticated client to be used
func helloPrivate(w http.ResponseWriter, r *http.Request) {
	message := "Hello from a private endpoint! You need to be authenticated to see this."
	responseJSON(message, w, http.StatusOK)
}

// TODO
func echoToken(w http.ResponseWriter, r *http.Request) {
	//val := context.Get(r, "user")
	//t (jwt.Token) = r.Context().Value("user")
	val, _ := r.Context().Value("user").(*jwt.Token)
	message := val.Raw
	// OK so I now have the auth token
	//  - How do I swap it for the user token?
	//  - https://mweya-labs.eu.auth0.com/userinfo?access_token={token}
	responseJSON(message, w, http.StatusOK)

}

// TODO
func (User) resolveUser(token jwt.Token) {
	// Send token to Auth0
	response, err := http.GET("https://mweya-labs.eu.auth0.com")
	if err != nil {
		log.Println(err)
	} else {
		// Read response from Auth0
		defer response.Body.Close()
		contents, err := ioutil.ReadAll(response.Body)
		if err != nil {
			log.Println(err)
		}
		// Make new instance of User struct
		// Populate struct with info from Auth0
		// Return struct
	}
}

// Test function for a private endpoint that requires the read:messages scope to be used
func helloPrivateScoped(w http.ResponseWriter, r *http.Request) {
	authHeaderParts := strings.Split(r.Header.Get("Authorization"), " ")
	token := authHeaderParts[1]

	hasScope := checkScope("read:messages", token)

	if !hasScope {
		message := "Insufficient scope."
		responseJSON(message, w, http.StatusForbidden)
		return
	}
	message := "Hello from a private endpoint! You need to be authenticated to see this."
	responseJSON(message, w, http.StatusOK)
}

// DEPRECATED
// Returns a text representation of the privacy policy
func getPrivacyPolicy(w http.ResponseWriter, r *http.Request) {
	filter := bson.D{{"policytype", "Privacy Policy"}}
	var policy LegalPolicy
	err := legal.FindOne(nil, filter).Decode(&policy) //nil
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	//responseJSON(b, w, http.StatusOK)
	w.Header().Set("Content-Type", "text/text")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(policy.Policy))
	return
}

// Returns a JSON representation of the Terms of Service
func getTermsJSON(w http.ResponseWriter, r *http.Request) {
	filter := bson.D{{"policytype", "Terms of Service"}}
	var policy LegalPolicy
	err := legal.FindOne(nil, filter).Decode(&policy)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	b, err := json.Marshal(policy)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
	return
}

// Returns a JSON representation of the privacy policy
func getPrivacyPolicyJSON(w http.ResponseWriter, r *http.Request) {
	filter := bson.D{{"policytype", "Privacy Policy"}}
	var policy LegalPolicy
	err := legal.FindOne(nil, filter).Decode(&policy)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	b, err := json.Marshal(policy)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
	return
}

// Returns the homepage advertising the application
func homePage(w http.ResponseWriter, r *http.Request) {
	dat, err := ioutil.ReadFile("static/index.html")
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html")
	w.Write(dat)
	return
}

// Adds a new user to the system.
func addUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	urlID := vars["userName"]
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error': '" + err.Error() + "'}"))
		return
	}

	// Test to make sure all fields are populated
	if user.ID == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("{'error':'Bad request. Don't leave anything blank'"))
		return
	}

	// Test to see if the user exists or not
	ID := user.ID
	if ID != urlID {
		// Wot
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("{'error':'Bad Request. Your actions might be reported'}"))
		return
	}
	filter := bson.D{{Key: "id", Value: ID}}
	err = users.FindOne(nil, filter).Decode(&user)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			// Good news, we can add them!
			user.AccountCreated = time.Now()
			err = nil
			_, err = users.InsertOne(nil, user)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("{'error': '" + err.Error() + "'}"))
			}
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error': '" + err.Error() + "'}"))
		return
	}
	w.WriteHeader(http.StatusConflict)
	w.Write([]byte("{'error':'User already exists'"))
	return
}

// Returns the robots.txt file that should stop all compliant bots and crawlers from indexing certain endpoints.
func robots(w http.ResponseWriter, r *http.Request) {
	// Get outta here ya filthy bots
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/text")
	w.WriteHeader(http.StatusOK)
	// Not reading from the file, this is small enough to keep in memory and that's probably quicker
	w.Write([]byte(`User-agent: *
Disallow: /api/
Disallow: /user/
Disallow: /lab/
Disallow: /tmp/
Disallow: /superSecretSiteDontHack/`))
}

// AddContext attempts to add the concept of sessions to the webserver so that tokens can be shared between
// functions and so that if a session is ended prematurely, the routine handling the session can close down
// too
func AddContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//log.Println(r.Method, "-", r.RequestURI)
		// TODO Keys are case insensitive in HTTP Headers
		// - https://tools.ietf.org/html/rfc8187
		token := r.Header["Authorization"][0]
		// Remove the Bearer bit
		token = token[7:]
		//log.Println(token)
		//Add data to context
		ctx := context.WithValue(r.Context(), "user", string(token))
		//log.Println(ctx.Value("user"))
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func main() {

	// MongoDB initialization
	// Localhost config
	//clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	// Mongo in docker
	clientOptions := options.Client().ApplyURI("mongodb://mongo:27017")
	dbclient, err := mongo.Connect(nil, clientOptions)
	ping := dbclient.Ping(nil, nil)

	// Print Mongo errors to screen
	if err != nil {
		log.Writer().Write([]byte(err.Error()))
		return
	}
	if ping != nil {
		log.Writer().Write([]byte(ping.Error()))
		return
	}

	// Instantiate the collection vars
	users = *dbclient.Database("Labs").Collection("users")
	labs = *dbclient.Database("Labs").Collection("labs")
	ads = *dbclient.Database("Labs").Collection("ads")
	legal = *dbclient.Database("Labs").Collection("legal")

	// Debug
	//addMweya()
	insertInitialPrivacyPolicy()
	insertInitialToS()

	// Template continues here

	// Read the .env file for config options
	err = nil
	err = godotenv.Load()
	if err != nil {
		log.Print("Error loading .env file")
	}

	// Define the middleware to be used to verify the audience and iss claims
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			// Verify 'aud' claim
			aud := os.Getenv("AUTH0_AUDIENCE")
			checkAud := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
			if !checkAud {
				return token, errors.New("invalid audience")
			}
			// Verify 'iss' claim
			iss := "https://" + os.Getenv("AUTH0_DOMAIN") + "/"
			checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
			if !checkIss {
				return token, errors.New("invalid issuer")
			}

			// Drop the token into the context for later
			//ctx := context.Context
			// That's not ok, we don't have the request to get the context from

			cert, err := getPemCert(token)
			if err != nil {
				panic(err.Error())
			}

			result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
			return result, nil
		},
		SigningMethod: jwt.SigningMethodRS256,
	})

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Authorization"},
	})

	r := mux.NewRouter()

	// Homepage, static, shows links to download the app or (TODO) a web client
	// and a link to the privacy policy
	r.Handle("/", http.HandlerFunc(homePage))

	// Privacy policy, static, available to all
	r.Handle("/legal/privacy", http.HandlerFunc(getPrivacyPolicyJSON)).Methods(http.MethodGet)
	r.Handle("/legal/terms", http.HandlerFunc(getTermsJSON)).Methods(http.MethodGet)

	// Account routes
	//acc := r.PathPrefix("/account").Subrouter()
	//acc.Path("/create").HandlerFunc().Methods(http.MethodPut)

	// Authentication routes
	//a := r.PathPrefix("/auth").Subrouter()
	//a.Path("/login").HandlerFunc(loginHandler).Methods(http.MethodGet)
	//a.Path("/logout").HandlerFunc(logoutHandler).Methods(http.MethodGet)
	//a.Path("/signup").HandlerFunc(signupHandler).Methods(http.MethodPost)

	// Lab routes
	// All users should be able to GET labs
	// All users should be able to PUT labs
	// Owner should be able to delete lab
	//	- All can call but check to see if user matches owner in method?
	// Owner should be able to modify lab
	//	- All can call but check to see if user matches owner in method?
	//l := r.PathPrefix("/lab").Subrouter()
	// For the splashpage of the app, returns most popular lab, most recent lab and a random lab
	//l.Path("/splash").HandlerFunc(getSplashLabs).Methods(http.MethodGet)
	//l.HandleFunc("/{labID}", getLab).Methods(http.MethodGet)
	//l.HandleFunc("/{labID}", createLab).Methods(http.MethodPut)
	//l.HandleFunc("/{labID}", deleteLab).Methods(http.MethodDelete)
	//l.HandleFunc("/{labID}", modLab).Methods(http.MethodPost)

	// User routes
	//u := r.PathPrefix("/user").Subrouter()
	//u.HandleFunc("/{userName}", getUser).Methods(http.MethodGet)
	//u.HandleFunc("/{userName}", createUser).Methods(http.MethodPut)
	//u.HandleFunc("/{userName}", deleteUser).Methods(http.MethodDelete)
	//u.HandleFunc("/{userName}", modUser).Methods(http.MethodPost)

	// Ad routes
	// All users should be able to GET ads
	// TODO sell and insert ads

	r.Handle("/api/private/echoToken", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(echoToken))))

	// Auth0 example routes

	// This route is always accessible
	r.Handle("/api/public", http.HandlerFunc(helloPublic))

	// This route is only accessible if the user has a valid access_token
	// We are chaining the jwtmiddleware middleware into the negroni handler function which will check
	// for a valid token.
	r.Handle("/api/private", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(helloPrivate))))

	// This route is only accessible if the user has a valid access_token with the read:messages scope
	// We are chaining the jwtmiddleware middleware into the negroni handler function which will check
	// for a valid token and scope.
	r.Handle("/api/private-scoped", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(helloPrivateScoped))))

	// SEO endpoints (robot.txt and more)
	r.Handle("/robots.txt", http.HandlerFunc(robots))

	// https://gocodecloud.com/blog/2016/11/15/simple-golang-http-request-context-example/
	serverWithContext := AddContext(r)
	//handler := c.Handler(r)
	handler := c.Handler(serverWithContext)
	http.Handle("/", r)
	fmt.Println("Listening on http://localhost:3010")
	http.ListenAndServe("0.0.0.0:3010", handler)

	// TODO
	// User management, ban hammer, warnings
	// TODO
	// graceful shutdown support here
	//  - Block conn
	//  - End DB conn
	//     - err = client.Disconnect(nil)
	// TODO
	// serve React app when / is called
	// TODO
	// First run detection
	// 	- On first run add priv policy to DB
}

// CustomClaims defines the claims an auth token has to actions it would like to be able to perform
// on the endpoint
type CustomClaims struct {
	Scope string `json:"scope"`
	jwt.StandardClaims
}

// Compares the requested scope with the scopes Auth0 claims this client is allowed to access
func checkScope(scope string, tokenString string) bool {
	token, _ := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		cert, err := getPemCert(token)
		if err != nil {
			return nil, err
		}
		result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
		return result, nil
	})

	claims, ok := token.Claims.(*CustomClaims)

	hasScope := false
	if ok && token.Valid {
		result := strings.Split(claims.Scope, " ")
		for i := range result {
			if result[i] == scope {
				hasScope = true
			}
		}
	}

	return hasScope
}

// Gets the PEM certificate from the auth token for comparison's sake
func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get("https://" + os.Getenv("AUTH0_DOMAIN") + "/.well-known/jwks.json")

	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	for k, _ := range jwks.Keys {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + jwks.Keys[k].X5c[0] + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		err := errors.New("unable to find appropriate key")
		return cert, err
	}

	return cert, nil
}

// Helper function for forming and sending JSON messages to the client
func responseJSON(message string, w http.ResponseWriter, statusCode int) {
	response := Response{message}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(jsonResponse)
}
