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

// Structs describing the kind of data that this application will store. A "Lab"
// is a single page of code, a user is an account.

// Lab contains an ID for identification as well as a name (very similar to a title)
// as well as code to display and metadata pertaining to it.
type Lab struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Code     string    `json:"code"`
	Views    int       `json:"views"`
	Author   string    `json:"author"`
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
	LabsCreated    []string  `json:"labs created"`
	AccountCreated time.Time `json:"account created"`
}

// Functions for debugging go here.
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

// func testUsername

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

func notFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(`{"status": "404 - not found", "explanation": "The resource you asked for does not seem to exist on this server. If you didn't mess with the application or API, then this might be a bug I'd appreciate hearing about. Feel free to contact me at mweyaruider@gmail.com to report it."}`))
}

// This is the main function that runs when the application is started.
func main() {

	// MongoDB
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	dbclient, err := mongo.Connect(context.TODO(), clientOptions)
	ping := dbclient.Ping(context.TODO(), nil)

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

	// Debug
	//addMweya()

	// Webserver and routing
	r := mux.NewRouter()

	// API v1
	apiV1 := r.PathPrefix("/api/v1").Subrouter()
	//api_v1.HandleFunc("/lab/{labName}", postLab).Methods(http.MethodPost)
	//api_v1.HandleFunc("/lab/{labName}", getLab).Methods(http.MethodGet)
	//api_v1.HandleFunc("/lab/{labName}", putLab).Methods(http.MethodPut)
	//api_v1.HandleFunc("/lab/{labName}", deleteLab).Methods(http.MethodDelete)
	apiV1.HandleFunc("/user/{userName}", modUser).Methods(http.MethodPost)
	apiV1.HandleFunc("/user/{userName}", getUser).Methods(http.MethodGet)
	apiV1.HandleFunc("/user/{userName}", deleteUser).Methods(http.MethodDelete)
	apiV1.HandleFunc("/user/{userName}", addUser).Methods(http.MethodPut)
	//api_v1.HandleFunc("/user/{userName}", delete).Methods(http.MethodDelete)

	//apiV1.HandleFunc("/ad", getAdvert).Methods(http.MethodGet)
	//apiV1.HandleFunc("/sales/testAd/{adID}", testAd).Methods(http.MethodGet)
	//apiV1.HandleFunc("/sales/")
	apiV1.HandleFunc("", notFound)

	r.Use(mux.CORSMethodMiddleware(r))
	log.Fatal(http.ListenAndServe(":8080", r))

	// TODO graceful shutdown support here
	// Block conn
	// End DB conn
	//err = client.Disconnect(context.TODO())
	// TODO serve React app when / is called
}
