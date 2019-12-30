package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Global variable to store the global DB client to be used to perform transactions
var dbclient *mongo.Client

// Global handle variable that points to the users collection in the database
var users = dbclient.Database("Labs").Collection("users")

// Global handle variable that points to the labs collection in the database
var labs = dbclient.Database("Labs").Collection("labs")

// Global handle variable that points to the ads collection in the database
var ads = dbclient.Database("Labs").Collection("ads")

// Structs describing the kind of data that this application will store. A "Lab"
// is a single page of code, a user is an account.

// A lab contains an ID for identification as well as a name (very similar to a title)
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

// An ad contains an ID for identification as well as a title, subtitle and a link to
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
	ModalVideoURL  string `json:"ModalVideoURL"`
	Views          int    `json:"views"`
	ViewsPaidFor   int    `json:"views"`
	Owner          string `json:"owner"`
	Action         string `json:"action"`
}

// This describes a basic user on this system, storing information about the user's
// particulars and their activity on the system.
type User struct {
	ID             string    `json:"id"`
	FirstName      string    `json:"firstname"`
	LastName       string    `json:"lastname"`
	Affiliation    string    `json:"affiliation"`
	LabsCreated    []string  `json:"labs created"`
	AccountCreated time.Time `json:"account created"`
}

// Functions governing the behaviour of the system go here, from responding to
// requests that cannot be satisfied to the creation of users.
func getUser(w http.ResponseWriter, r *http.Request) {
	sendError := false
	// Stop CORS from complaining on newer systems
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// Tell the browsers what kind of content to expect
	w.Header().Set("Content-Type", "application/json")
	// Get the ID from the url the client requested a resource from
	vars := mux.Vars(r)
	ID := vars["userName"]

	// Create a filter to be used to search for the user
	// ID is uppercase so it does not conflict with the id assigned to the document
	// by MongoDB
	filter := bson.D{{"ID", ID}}
	// Create a variable for the user we will be returning
	var user User
	err := users.FindOne(context.TODO(), filter).Decode(&user)
	if err != nil {
		sendError = true
	}

	// Convert the user to a json document before decoding it into raw bytes
	b, err := json.Marshal(user)
	if err != nil {
		sendError = true
	}

	// If anything has gone wrong, send an error back to the client.
	// Otherwise send them the information requested.
	if sendError {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`500 - Internal Server Error`))
	} else {
		w.WriteHeader(http.StatusOK)
		if b != nil {
			w.Write(b)
		} else {
			w.Write([]byte(`{}`))
		}
	}

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

	// Webserver and routing
	r := mux.NewRouter()

	// API v1
	api_v1 := r.PathPrefix("/api/v1").Subrouter()
	//api_v1.HandleFunc("/lab/{labName}", postLab).Methods(http.MethodPost)
	//api_v1.HandleFunc("/lab/{labName}", getLab).Methods(http.MethodGet)
	//api_v1.HandleFunc("/lab/{labName}", putLab).Methods(http.MethodPut)
	//api_v1.HandleFunc("/lab/{labName}", deleteLab).Methods(http.MethodDelete)
	//api_v1.HandleFunc("/user/{userName}", post).Methods(http.MethodPost)
	api_v1.HandleFunc("/user/{userName}", getUser).Methods(http.MethodGet)
	//api_v1.HandleFunc("/user/{userName}", put).Methods(http.MethodPut)
	//api_v1.HandleFunc("/user/{userName}", delete).Methods(http.MethodDelete)
	api_v1.HandleFunc("", notFound)

	r.Use(mux.CORSMethodMiddleware(r))
	log.Fatal(http.ListenAndServe(":8080", r))

	// TODO graceful shutdown support here
	// Block conn
	// End DB conn
	//err = client.Disconnect(context.TODO())
	// TODO serve React app when / is called
}
