// TODO
// Split this behemoth into packages
//   - DB package
//   - Routing package
//   - DataStore package
//	    - Togglable cache keeping some structs in RAM
//   - Legal package
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"math"

	"github.com/gorilla/mux"

	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
type User struct {
	ID             string    `json:"id"`
	FirstName      string    `json:"firstname"`
	LastName       string    `json:"lastname"`
	Affiliation    string    `json:"affiliation"`
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

// Functions for debugging go here.

// Adds my information to the system for testing
func addMweya() {
	var myLabs []string
	mweya := User{
		"mweya", "Mweya", "Ruider", "Namibia University of Science and Technology", myLabs, time.Now(),
	}
	_, err := users.InsertOne(context.TODO(), mweya)
	if err != nil {
		log.Fatal(err)
	}
}

// Adds a test advert to they system for testing
func addTestAd() {
	ad := Ad{
		"helloworld", "Looking for an developer?", "Hire the developer of this app!", "https://mweya.duckdns.org/lowrez", "", 0, math.MaxInt64, "Mweya Ruider", "https://mweya.duckdns.org/cv",
	}
	_, err := ads.InsertOne(context.TODO(), ad)
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
	var user User
	
}

// TODO insert the privacy policy into the DB
func insertInitialPrivacyPolicy() {
	policy := LegalPolicy{
		"Privacy Policy", time.Now(), `
		This privacy policy was generated on the 2nd of January 2020 and the original document can be accessed at the link below, however, this
		policy has been modified to represent the product (Labs) better. For most intents and purposes, this modifided version is the official
		privacy policy and is subject to change.
		https://www.gdprprivacypolicy.net/live.php?token=xwrVvp8hLUStHhnjIyMjTqKfHrtbBf0z
		
		
		
		Privacy Policy for Labs
		
		At Labs, accessible from jl.mweya.duckdns.org, one of our main priorities is the privacy of our visitors. 
		This Privacy Policy document contains types of information that is collected and recorded by Labs and how we 
		(the Labs development team) use it.
		
		If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us
		over email (mweyaruider@gmail.com) or Telegram (t.me/Mweya). Other contact methods like phone calls are discouraged
		as response times may be longer, however requests for information will be upheld to the best of our ability.
		
		
		
		General Data Protection Regulation (GDPR)
		
		We are a Data Controller of your information. Labs' legal basis for collecting and using the personal information described
		in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect the information:
		
			Labs needs to perform a contract with you
			You have given Labs permission to do so
			Processing your personal information is in Labs legitimate interests
			Labs needs to comply with the law
		
		Labs will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. 
		We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, 
		and enforce our policies.
		
		If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed 
		about what Personal Information we hold about you and if you want it to be removed from our systems, please contact us. 
		Our Privacy Policy was generated with the help of the GDPR Privacy Policy Generator and the App Privacy Policy Generator.
		
		In certain circumstances, you have the following data protection rights:
		
			The right to access, update or to delete the information we have on you.
			The right of rectification.
			The right to object.
			The right of restriction.
			The right to data portability
			The right to withdraw consent
			
		
		
		Log Files
		
		Your interaction with Labs results in the creation of log files. This is standard practice and is done by the hosting companies
		responsible for hosting this service as well as some functions of Labs. Although some consideration has gone into minimizing
		the amount of information logged, log files are very important to the operation of Labs and store information that can help
		our team fix bugs and broken features. The information collected by log files can include internet protocol (IP) addresses, 
		browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
		These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends,
		administering the site, tracking users' movement on the website, and gathering demographic information, as well as measuring the
		popularity of resources on this website.
		
		
		
		Cookies and Web Beacons
		
		Like most other websites, Labs uses 'cookies'. These cookies are used to store information including visitors' preferences, and 
		the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by 
		customizing our web page content based on visitors' browser type and/or other information. Labs is built using third party tools
		like React Native and GoLang which might use cookies for communication and other system functions. 
		
		
		
		Privacy Policies
		
		The advertising system used in Labs has been built from scratch and does not use third party advertising services, however, when
		ads are clicked on, you may be redirected to the advertiser's site which may employ technologies like cookies, JavaScript or 
		Web Beacons. When this happens, they automatically receive your IP address. These technologies are usually used to measure
		the effectiveness of advertising campaigns and/or to personalize the advertising content that you see on websites you visit.
		
		Note that Labs has no access to or control over these cookies that are used by third-party advertisers.
		
		You can choose to disable cookies through your individual browser options. To know more detailed information about cookie 
		management with specific web browsers, it can be found at the browsers' respective websites or at the following link:
		http://www.whatarecookies.com/
		
		
		
		Children's Information
		
		Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians 
		to observe, participate in, and/or monitor and guide their online activity. Labs does not knowingly collect any Personal 
		Identifiable Information from children under the age of 13. If you think that your child provided this kind of information 
		on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove 
		such information from our records.
		
		
		
		Online Privacy Policy Only
		
		Our Privacy Policy (created at GDPRPrivacyPolicy.net) applies only to our online activities and is valid for visitors to 
		our website with regards to the information that they shared and/or collect in Labs. This policy is not applicable to any 
		information collected offline or via channels other than this website. Our GDPR Privacy Policy was generated from the GDPR 
		Privacy Policy Generator.
		
		
		
		Consent
		
		By using our website, you hereby consent to our Privacy Policy and agree to its terms.
		`,
	}

	_, err := legal.InsertOne(context.TODO(), policy)
	if err != nil {
		log.Writer().Write([]byte(err.Error()))
	}
}

// TODO
// Returns the privacy policy in JSON
func getPrivacyPolicy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	var policy LegalPolicy
	filter := bson.D{{Key: "type", Value: "Privacy Policy"}}
	err := legal.FindOne(context.TODO(), filter).Decode(&policy)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	b, err := json.Marshal(policy)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(b)
	return
}

// Regular endpoints here

// Handles requests for specific users.
func getUser(w http.ResponseWriter, r *http.Request) {
	sendError := false
	var errorMessage []string
	// Stop CORS from complaining on newer systems
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// Tell the browsers what kind of content to expect
	w.Header().Set("Content-Type", "application/json")
	// Get the ID from the url the client requested a resource from
	vars := mux.Vars(r)
	ID := vars["userName"]

	// Create a filter to be used to search for the user
	filter := bson.D{{Key: "id", Value: ID}}
	// Create a variable for the user we will be returning
	var user User
	err := users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(`{}`))
			return
		}
		sendError = true
		errorMessage = append(errorMessage, string(err.Error()))

	}

	// Convert the user to a json document before decoding it into raw bytes
	b, err := json.Marshal(user)
	if err != nil {
		sendError = true
		errorMessage = append(errorMessage, string(err.Error()))
	}

	// If anything has gone wrong, send an error back to the client.
	// Otherwise send them the information requested in the JSON format.
	if sendError {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + strings.Join(errorMessage, "\n") + "'}"))
	} else {
		w.WriteHeader(http.StatusOK)
		if b != nil {
			w.Write(b)
		} else {
			w.Write([]byte(`{}`))
		}
	}
}

// TODO
// Checks if a username is available or not for the signup screen of the app or Auth0.
// Returns a boolean via JSON
func testUsername() {

}

// Modifies a user on the system
func modUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	var updatedUser User
	err := json.NewDecoder(r.Body).Decode(&updatedUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	// Make sure that no needed fields have been omitted
	if updatedUser.ID == "" || updatedUser.FirstName == "" || updatedUser.LastName == "" || updatedUser.Affiliation == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("{'error':'Bad Request. Make sure none of your fields have been left empty.'}"))
		return
	}

	// Get old user data from DB
	var oldUser User
	err = nil
	filter := bson.D{{Key: "id", Value: updatedUser.ID}}
	err = users.FindOne(context.TODO(), filter).Decode(&oldUser)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("{'error':'User not found'}"))
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}

	// Keep the date joined from the old account
	updatedUser.AccountCreated = oldUser.AccountCreated

	//TODO
	// Keep the labs created from the old account
	updatedUser.LabsCreated = oldUser.LabsCreated

	// Overwrite the data stored with that username with the data from the json
	// doc supplied.
	err = nil
	b, err := bson.Marshal(updatedUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	_, err = users.UpdateOne(context.TODO(), filter, b)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{'status': 'OK'"))
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
	if user.ID == "" || user.FirstName == "" || user.LastName == "" || user.Affiliation == "" {
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
	err = users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			// Good news, we can add them!
			user.AccountCreated = time.Now()
			err = nil
			_, err = users.InsertOne(context.TODO(), user)
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

// Removes a user from the system
func deleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	// Use the mux vars for this one
	// https://stackoverflow.com/questions/299628/is-an-entity-body-allowed-for-an-http-delete-request
	vars := mux.Vars(r)
	ID := vars["userName"]

	// Remove user with that username
	filter := bson.D{{Key: "id", Value: ID}}
	_, err := users.DeleteOne(context.TODO(), filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{'error':'" + err.Error() + "'}"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "OK"}`))
	return
}

// Runs when a resource has not been found (no other url matched)
func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(`{"status": "404 - not found", "explanation": "The resource you asked for does not seem to exist on this server. If you didn't mess with the application or API, then this might be a bug I'd appreciate hearing about. Feel free to contact me at mweyaruider@gmail.com to report it."}`))
	return
}

// This is the main function that runs when the application is started.
func main() {

	// MongoDB initialization
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	dbclient, err := mongo.Connect(context.TODO(), clientOptions)
	ping := dbclient.Ping(context.TODO(), nil)

	// Print errors to screen
	if err != nil {
		log.Writer().Write([]byte(err.Error()))
	}
	if ping != nil {
		log.Writer().Write([]byte(ping.Error()))
	}

	// Instantiate the collection vars
	users = *dbclient.Database("Labs").Collection("users")
	labs = *dbclient.Database("Labs").Collection("labs")
	ads = *dbclient.Database("Labs").Collection("ads")
	legal = *dbclient.Database("Labs").Collection("legal")

	// Debug
	//addMweya()

	// Webserver and routing
	r := mux.NewRouter()

	// API v1
	apiV1 := r.PathPrefix("/api/v1").Subrouter()

	// Lab endpoints
	//api_v1.HandleFunc("/lab/{labName}", postLab).Methods(http.MethodPost)
	//api_v1.HandleFunc("/lab/{labName}", getLab).Methods(http.MethodGet)
	//api_v1.HandleFunc("/lab/{labName}", putLab).Methods(http.MethodPut)
	//api_v1.HandleFunc("/lab/{labName}", deleteLab).Methods(http.MethodDelete)

	// User endpoints
	apiV1.HandleFunc("/user/{userName}", modUser).Methods(http.MethodPost)
	apiV1.HandleFunc("/user/{userName}", getUser).Methods(http.MethodGet)
	apiV1.HandleFunc("/user/{userName}", deleteUser).Methods(http.MethodDelete)
	apiV1.HandleFunc("/user/{userName}", addUser).Methods(http.MethodPut)

	// Advert endpoints
	//apiV1.HandleFunc("/ad", getAdvert).Methods(http.MethodGet)
	//apiV1.HandleFunc("/sales/testAd/{adID}", testAd).Methods(http.MethodGet)
	//apiV1.HandleFunc("/sales/")

	// Legal endpoints
	apiV1.HandleFunc("/legal/privacy", getPrivacyPolicy).Methods(http.MethodGet)
	apiV1.HandleFunc("/legal/datarequest", requestData).Methods(http.MethodGet)

	// TODO
	// SEO endpoints (robot.txt and more)

	// Error handlers
	apiV1.HandleFunc("", notFound)

	r.Use(mux.CORSMethodMiddleware(r))
	log.Fatal(http.ListenAndServe(":8080", r))

	// TODO
	// graceful shutdown support here
	//  - Block conn
	//  - End DB conn
	//     - err = client.Disconnect(context.TODO())
	// TODO
	// serve React app when / is called
}

// TODO
// Auth0 integration
