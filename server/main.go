// TODO
// Split this behemoth into packages
//   - DB package
//   - Routing package
//   - DataStore package
//	    - Togglable cache keeping some structs in RAM
//   - Legal package
//   - Logging package
//      - Write actual logfiles
// Search functionality
//   - Maybe just a find() call on the collection, followed by an iteration through that'
//   - What if it literally just lists all labs in a certain course?
//     - A Labs would need to be related to courses, which would need to be related to offerings that certain unis have
//       - e.g. NUST -> Comp Sci. -> WDF -> Labs about WDF
//       - Would require working out the messy web that is NUST's interconnected courses
//         - Could drop the Comp Sci. level?
//           - e.g. NUST -> WDF -> Labs about WDF
//             - Would still require a list of courses
//             - CRUD for courses :(
// Identification
//   - Check requests to make sure it's from clients
//     - User Agents
// User management
//   - ban hammer,
//   - warnings
//   - emails?
// Graceful shutdown
//   - Block conn
//   - End DB conn
//      - err = client.Disconnect(nil)
// React App
//   - Expo?
//   - /try redirects to web client?
// First run detection
// 	 - On first run add priv policy to DB
package main

//"github.com/gorilla/context" <-  too old
//

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"math/rand"
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

// Global handle variable that points to the legal collection in the database
var adarchive mongo.Collection

// Number of adverts in the database, this number refreshes every time the application
// is restarted.
var totalads int64

// Structs describing the kind of data that this application will store. A "Lab"
// is a single page of code, a user is an account.

// Institution represents an instance of tertiary education, be it a university,
// a college or a technical highschool. An institution can have both users and
// labs attributed to it. These attributions can be done by adding the ID of the
// user or the labs to this object.
// TODO think about how these institutions should be verified when added
type Institution struct {
	ID    string   `json:"id"`
	Name  string   `json:"name"`
	Users []string `json:"users"`
	Labs  []string `json:"labs"`
}

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
	Author   string    `json:"author"`
}

// Ad contains an ID for identification as well as a title, subtitle and a link to
// both an image and a video. The idea is that when the image is clicked on, a video can
// play, advertising the product. If the video is then clicked on, we are reasonably sure
// that the user is interested in the product so the user can then migrate away to the
// "action" link the advertiser has payed for. This is NOT meant to be an intrusive
// experience and can be removed with minimal effort.
// Making the ID an integer makes pulling a random one of the database more efficient,
// assuming we know how many ads there are in the database.
type Ad struct {
	ID             int64  `json:"id"`
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

// Auth0Details describes the information we expect to recieve from Auth0 when resolving
// a user's details via a supplied auth token. Information not needed for the user struct
// can be dropped later.
type Auth0Details struct {
	Sub           string    `json:"sub"`
	GivenName     string    `json:"given_name"`
	Nickname      string    `json:"nickname"`
	FamilyName    string    `json:"family_name"`
	Name          string    `json:"name"`
	Picture       string    `json:"picture"`
	Locale        string    `json:"locale"`
	Email         string    `json:"email"`
	EmailVerified bool      `json:"email_verified"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// LegalPolicy describes a generic type of legal policy governing the terms of use of
// this system, and contains information about the policy's creation date.
type LegalPolicy struct {
	PolicyType   string    `json:"type"`
	LastModified time.Time `json:"modified"`
	Policy       string    `json:"content"`
}

// SearchResult describes the response to be given to the client when the client requests
// a search for a specific string. This result includes an array of user IDs and an array of
// lab IDs.
// TODO
type SearchResult struct {
	Users       []string `json:"users"`
	Labs        []string `json:"labs"`
	LazyMatches []string `json:""`
}

// Cache is a struct that will be used to store recently accessed user data to reduce
// the number of network requests sent
// TODO
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

// Adds an example lab to the system for testing
func addLab() {
	lab := Lab{
		"test-01", "Hello Test World", "print('hello world')", 0, time.Now(), 1, "Python3", "mweya-test",
	}
	_, err := labs.InsertOne(context.Background(), lab)
	if err != nil {
		log.Fatal(err)
	}
}

// Adds a test advert to they system for testing
func addTestAd() {
	ad := Ad{
		0, "Looking for a developer?", "Hire the developer of this app!", "https://mweya.duckdns.org/lowrez", "", 0, math.MaxInt64, "Mweya Ruider", "https://mweya.duckdns.org/cv",
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
	// No need to do work twice lol
	// TODO, labs uploaded should probably also be supplied in full
	r.Method = "GET"
	account(w, r)
	// TODO send data to email
	// - How2 keep password safe tho
	// - https://gist.github.com/jpillora/cb46d183eca0710d909a
	/*c, err := smtp.Dial("smtp.gmail.com:465")
	if err != nil {
		log.Print(err.Error())
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	err = c.Mail("mweyaruider@gmail.com")
	return*/
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

// Handles requests to search the system for users and labs
func search(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	// Only GETs are allowed here
	if r.Method == "GET" {
		// Get the search query from mux
		vars := mux.Vars(r)
		query := vars["searchQuery"]
		filter := bson.D{{Key: "id", Value: query}}

		// Create place to store result
		var result SearchResult

		// Temp vars to store structs while searching
		var tempUser User
		var tempLab Lab

		// Find matches for users
		var usersMatched []string
		err := users.FindOne(r.Context(), filter).Decode(&tempUser)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				// This is normal
			} else {
				responseJSON(err.Error(), w, http.StatusInternalServerError)
				return
			}
		}
		// Add most accurate match first
		usersMatched = append(usersMatched, tempUser.ID)
		// TODO lazy substring matches

		// Find matches for labs
		var labsMatched []string
		// Search for the name of the lab
		filter = bson.D{{Key: "name", Value: query}}
		err = labs.FindOne(r.Context(), filter).Decode(&tempLab)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				// This is normal
			} else {
				responseJSON(err.Error(), w, http.StatusInternalServerError)
				return
			}
		}
		// Most accurate match first
		labsMatched = append(labsMatched, tempLab.ID)
		// TODO lazy substring matches
		// Other matches
		// TODO
		var otherMatches []string

		// Move everything together
		result.Users = usersMatched
		result.Labs = labsMatched
		result.LazyMatches = otherMatches

		// Make JSON for client
		b, err := json.Marshall(result)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}

		// Return to client
		w.WriteHeader(http.StatusOK)
		w.Write(b)
		return
	}
	responseJSON("Bad request", w, http.StatusBadRequest)
	return
}

// Returns a random advert
func advert(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	// Get random advert
	// Links that will help with optimization later
	//
	// https://stackoverflow.com/questions/26456375/aggregation-in-golang-mgo-for-mongodb
	// https://stackoverflow.com/questions/2824157/random-record-from-mongodb
	// https://godoc.org/go.mongodb.org/mongo-driver/mongo

	// id != _id, id counts up from 0
	randomID := rand.Int63n(totalads)
	filter := bson.D{{Key: "id", Value: randomID}}
	var ad Ad
	err := ads.FindOne(r.Context(), filter).Decode(&ad)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// Marshal advert to JSON
	b, err := json.Marshal(ad)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// Serve random advert
	w.WriteHeader(http.StatusOK)
	w.Write(b)

	// Update view count of random advert
	ad.Views = ad.Views + 1

	// Check if view count > views paid for
	if ad.Views > ad.ViewsPaidFor {
		// Archive
		_, err := ads.DeleteOne(r.Context(), filter)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		totalads = totalads - 1
		return
	}
	// Write updated state of ad back to DB
	_, err = ads.ReplaceOne(r.Context(), filter, ad)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	return
}

// Returns information on a certain user in this system. Only GET is allowed.
func user(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	// Only GET is allowed
	if r.Method != "GET" {
		responseJSON("method not allowed", w, http.StatusMethodNotAllowed)
		return
	}
	// Get the username from the URL
	vars := mux.Vars(r)
	ID := vars["userName"]
	// Get the user from the DB
	var user User
	filter := bson.D{{Key: "id", Value: ID}}
	err := users.FindOne(r.Context(), filter).Decode(&user)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			responseJSON("user not found", w, http.StatusNotFound)
			return
		}
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	// Convert the user to JSON
	b, err := json.Marshal(user)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	// Send the JSON back to the client
	w.WriteHeader(http.StatusOK)
	w.Write(b)
	return
}

// Handles GET, POST and DELETE for Labs
func getLab(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Get the Lab ID from the URL
	vars := mux.Vars(r)
	ID := vars["labID"]
	//ID, err := strconv.ParseInt(idString, 10, 64)
	//if err != nil {
	//	responseJSON("the ID should be a number", w, http.StatusBadRequest)
	//	return
	//}

	if r.Method == "GET" {
		// Retrieve the Lab from the DB
		var lab Lab
		filter := bson.D{{Key: "id", Value: ID}}
		err := labs.FindOne(r.Context(), filter).Decode(&lab)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				responseJSON("lab not found", w, http.StatusNotFound)
				return
			}
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Marshal Lab into JSON
		b, err := json.Marshal(lab)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Update state of lab
		lab.Views = lab.Views + 1
		_, err = labs.ReplaceOne(r.Context(), filter, lab)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Return the lab to the client
		w.WriteHeader(http.StatusOK)
		w.Write(b)
		return
	}

	// User resolution not needed for GET
	var user User
	val, _ := r.Context().Value("user").(*jwt.Token)
	user, err := resolveUser(*val)
	if err != nil {
		responseJSON("bad request", w, http.StatusBadRequest)
		return
	}
	// The JSON request body includes the updated lab
	if r.Method == "POST" {
		// Retrieve the Lab from the DB
		var lab Lab
		filter := bson.D{{Key: "id", Value: ID}}
		err = labs.FindOne(r.Context(), filter).Decode(&lab)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				responseJSON("lab not found", w, http.StatusNotFound)
				return
			}
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Make sure this user owns the lab
		if user.ID != lab.Author {
			responseJSON("not acceptable, your actions might have been logged", w, http.StatusNotAcceptable)
			return
		}
		// Read the request body to get the updated state
		var update Lab
		err = json.NewDecoder(r.Body).Decode(&update)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Keep the old uploaded date
		update.Uploaded = lab.Uploaded
		// Write changes to DB
		_, err := labs.ReplaceOne(r.Context(), filter, update)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
	// Self explanatory really
	if r.Method == "DELETE" {
		var lab Lab
		filter := bson.D{{Key: "id", Value: ID}}
		err = labs.FindOne(r.Context(), filter).Decode(&lab)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				responseJSON("lab not found", w, http.StatusNotFound)
				return
			}
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Make sure this user owns the lab
		if user.ID != lab.Author {
			responseJSON("not acceptable, your actions might have been logged", w, http.StatusNotAcceptable)
			return
		}
		// Actually delete the lab
		_, err := labs.DeleteOne(r.Context(), filter)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
	// Some weird method seems to have been used
	responseJSON("method not allowed", w, http.StatusMethodNotAllowed)
	return
}

// Handles PUT for Labs
func putLab(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	val, _ := r.Context().Value("user").(*jwt.Token)
	user, err := resolveUser(*val)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusBadRequest)
		return
	}

	// Read request body
	var lab Lab
	err = json.NewDecoder(r.Body).Decode(&lab)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// Fill in/overwrite information
	//totallabs, err := labs.CountDocuments(nil, nil, nil)
	//if err != nil {
	//	log.Print(err)
	//}
	lab.Author = user.ID
	lab.Uploaded = time.Now()
	lab.ID = lab.Author + "-" + lab.Name
	lab.Views = 0

	if lab.Name == "" || lab.Code == "" || lab.Language == "" {
		responseJSON("Can't find the name, code or language", w, http.StatusBadRequest)
		return
	}

	// Insert into DB
	_, err = labs.InsertOne(r.Context(), lab)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// Update the user's profile
	// TODO Glitchy, consider rewriting to ask mongo to find all labs that have
	// the right author ID attributed to them
	user.LabsCreated = append(user.LabsCreated, lab.ID)

	// Replace the user file in DB
	filter := bson.D{{Key: "id", Value: user.ID}}
	// Converting user to BSON for MongoDB
	b, err := bson.Marshal(user)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	// Inserting the user into the DB
	_, err = users.ReplaceOne(r.Context(), filter, b)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusInternalServerError)
	}

	// OK
	w.WriteHeader(http.StatusOK)
	return
}

// Handles interactions with the account endpoint, including CRUD operations for a user
// struct
func account(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Attempt to get the user's access JWT from the context
	val, _ := r.Context().Value("user").(*jwt.Token)
	user, err := resolveUser(*val)
	if err != nil {
		responseJSON(err.Error(), w, http.StatusBadRequest)
		return
	}

	if r.Method == "GET" {
		// Get a user's profile from the DB
		filter := bson.D{{Key: "id", Value: user.ID}}
		err := users.FindOne(r.Context(), filter).Decode(&user)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				responseJSON("user not found", w, http.StatusNotFound)
				return
			}
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Found it! Marshalling it to JSON
		b, err := json.Marshal(user)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Sending JSON back to the client
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(b)
		return
	}

	if r.Method == "POST" {
		// Update a user's profile
		// - Nothing to update atm, really
		filter := bson.D{{Key: "id", Value: user.ID}}
		// Keep the account creation date in a separate var for later
		acd := user.AccountCreated
		err := users.FindOne(r.Context(), filter).Decode(&user)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				responseJSON(err.Error(), w, http.StatusNotFound)
				return
			}
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// We must have found it! Attempting to update the user struct
		err = json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("{'error':'" + err.Error() + "'}"))
			return
		}
		// Updating worked, restoring the account creation date
		user.AccountCreated = acd
		// Time to write the changes to the DB
		// Converting user to BSON for MongoDB
		b, err := bson.Marshal(user)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Write to Mongo
		_, err = users.ReplaceOne(r.Context(), filter, b)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
		}
		// It worked!
		w.WriteHeader(http.StatusOK)
		return
	}

	// Add a new user to the system
	if r.Method == "PUT" {
		// Check to see if the user exists already
		filter := bson.D{{Key: "id", Value: user.ID}}
		// This should fail
		err := users.FindOne(r.Context(), filter).Decode(&user)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				// Good news, we can add them!
				user.AccountCreated = time.Now()
				err = nil
				_, err = users.InsertOne(r.Context(), user)
				if err != nil {
					responseJSON(err.Error(), w, http.StatusInternalServerError)
				}
				return
			}
		}
		// Must have found a user with the same username
		responseJSON("user already exists", w, http.StatusConflict)
		return
	}

	if r.Method == "DELETE" {
		// Remove a user from this system
		filter := bson.D{{Key: "id", Value: user.ID}}
		_, err := users.DeleteOne(r.Context(), filter)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		// Remove all the user's labs from the system
		filter = bson.D{{Key: "author", Value: user.ID}}
		_, err = labs.DeleteMany(r.Context(), filter)
		if err != nil {
			responseJSON(err.Error(), w, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == "OPTIONS" {
		// Tell the client what it can do
		w.Header().Set("Allow", "GET, POST, PUT, DELETE, OPTIONS")
		w.WriteHeader(http.StatusOK)
		return
	}

	// Some weird method was sent
	w.WriteHeader(http.StatusInternalServerError)
	return
}

// resolveUser takes a JWT access token and uses it to gretrieve a normalized profile from auth0
// to populate a new User struct used for identification.
func resolveUser(token jwt.Token) (User, error) {

	// Send token to Auth0
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://mweya-labs.eu.auth0.com/userinfo", nil)
	req.Header.Add("Authorization", "Bearer "+token.Raw)
	req.Header.Add("Host", "mweya-labs.eu.auth0.com")

	if err != nil {
		log.Println(err)
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
	}
	var user User

	var auth0response Auth0Details

	// Read response from Auth0
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&auth0response)
	if err != nil {
		log.Println(err)
	}

	if err != nil {
		log.Println(err)
	}

	// Nicknames might not be unique and can be changed, therefore email is used instead
	strparts := strings.Split(auth0response.Email, "@")
	user.ID = strparts[0]

	// Return struct and error state
	return user, nil
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

// Returns a JSON representation of the Terms of Service
func getTermsJSON(w http.ResponseWriter, r *http.Request) {
	filter := bson.D{{Key: "policytype", Value: "Terms of Service"}}
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
	filter := bson.D{{Key: "policytype", Value: "Privacy Policy"}}
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
// This should probably be kept in RAM later.
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

// Serves the Android app file stored in the static/bin/ directory, returning a JSON message if something fails.
// This does not tell the browser how big the file is and just pushes the data to the client's browser which might be quicker,
// but could also be annoying.
func getAndroidApp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/vnd.android.package-archive")
	dat, err := ioutil.ReadFile("static/bin/labs.apk")
	if err != nil {
		log.Print(err.Error())
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(dat)
	return
}

// Serves the iOS app file stored in the static/bin/ directory, returning a JSON message if something fails.
// This does not tell the browser how big the file is and just pushes the data to the client's browser which might be quicker,
// but could also be annoying.
func getIOSApp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/octet-stream")
	dat, err := ioutil.ReadFile("static/bin/labs.ipa")
	if err != nil {
		log.Print(err.Error())
		responseJSON(err.Error(), w, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(dat)
	return
}

// AddContext attempts to add the concept of sessions to the webserver so that tokens can be shared between
// functions and so that if a session is ended prematurely, the routine handling the session can close down
// too
func AddContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//log.Println(r.Method, "-", r.RequestURI)
		// New users have no authorization header
		if len(r.Header["Authorization"]) > 0 {
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
		} else {
			next.ServeHTTP(w, r)
		}
	})
}

// The main function starts here
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
	adarchive = *dbclient.Database("Labs").Collection("adarchive")

	// Count the amount of ads
	totalads, err = ads.CountDocuments(nil, nil, nil)
	if err != nil {
		log.Print(err)
	}

	// Debug
	//addLab()
	//addMweya()
	//insertInitialPrivacyPolicy()
	//insertInitialToS()

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
	r.Handle("/", http.HandlerFunc(homePage))

	// App download links, available to all
	r.Handle("/download/android", http.HandlerFunc(getAndroidApp)).Methods(http.MethodGet)
	r.Handle("/download/ios", http.HandlerFunc(getIOSApp)).Methods(http.MethodGet)

	// Privacy policy, static, available to all
	r.Handle("/legal/privacy", http.HandlerFunc(getPrivacyPolicyJSON)).Methods(http.MethodGet)
	r.Handle("/legal/terms", http.HandlerFunc(getTermsJSON)).Methods(http.MethodGet)

	// Lab routes
	// GET, POST, DELETE labs
	r.Handle("/lab/{labID}", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(getLab))))

	// PUT labs
	r.Handle("/publish", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(putLab))))

	// Search for users and labs
	// https://docs.mongodb.com/manual/text-search/
	// This endpoint handles requests to search the system for users and labs
	r.Handle("/search/{searchQuery}", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(search))))

	// Ad routes
	// All users should be able to GET ads
	r.Handle("/advert", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(advert))))

	// This route handles all the CRUD related activites a user might want to use to use on their
	// personal account.
	r.Handle("/account", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(account))))

	// This route serves information on all the users in this system. You need to be logged in to
	// use this.
	r.Handle("/user/{userName}", negroni.New(
		negroni.HandlerFunc(jwtMiddleware.HandlerWithNext),
		negroni.Wrap(http.HandlerFunc(user))))

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

	for k := range jwks.Keys {
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
