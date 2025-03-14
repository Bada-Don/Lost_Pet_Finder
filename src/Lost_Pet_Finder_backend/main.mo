import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";
import Blob "mo:base/Blob";

actor {
  // Define User type
  public type User = {
    username: Text;
    passwordHash: Text; // In a production app, store only hashed passwords
    email: Text;
  };

  // Define the Pet type with owner field
  public type Pet = {
    id: Text;
    name: Text;
    petType: Text;
    breed: Text;
    color: Text;
    height: Text;
    location: Text;
    category: Text; // "Lost" or "Found"
    date: Text;
    area: Text;
    imageData: ?[Blob]; // Optional array of image blobs
    owner: Principal; // Add owner field to track who created the pet
  };

  // Use stable variables to persist state
  stable var petEntries : [(Text, Pet)] = [];
  stable var userEntries : [(Text, User)] = [];
  stable var nextId : Nat = 1;

  // Create a new HashMap and initialize it with the stable entries
  var petStore = HashMap.HashMap<Text, Pet>(
    10,  // Initial capacity
    Text.equal,
    Text.hash
  );

  // User store to manage user accounts
  var userStore = HashMap.HashMap<Text, User>(
    10,  // Initial capacity
    Text.equal,
    Text.hash
  );

  // System functions to manage stable storage
  system func preupgrade() {
    petEntries := Iter.toArray(petStore.entries());
    userEntries := Iter.toArray(userStore.entries());
  };

  system func postupgrade() {
    petStore := HashMap.fromIter<Text, Pet>(
      petEntries.vals(),
      petEntries.size(),
      Text.equal,
      Text.hash
    );
    userStore := HashMap.fromIter<Text, User>(
      userEntries.vals(),
      userEntries.size(),
      Text.equal,
      Text.hash
    );
    petEntries := [];  // Clear after restoration
    userEntries := [];  // Clear after restoration
  };

  // Function to generate a new unique ID
  private func generateId() : Text {
    let id = Int.toText(nextId);
    nextId += 1;
    return id;
  };

  // User authentication functions
  public shared(msg) func registerUser(username: Text, passwordHash: Text, email: Text) : async Result<Text, Text> {
    // Check if username already exists
    switch (userStore.get(username)) {
      case (?_) { return #err("Username already exists"); };
      case (null) {
        let user: User = {
          username = username;
          passwordHash = passwordHash; // In production, client should hash password before sending
          email = email;
        };
        userStore.put(username, user);
        return #ok("User registered successfully");
      };
    };
  };

  public shared(msg) func loginUser(username: Text, passwordHash: Text) : async Result<Text, Text> {
    switch (userStore.get(username)) {
      case (null) { return #err("User not found"); };
      case (?user) {
        if (user.passwordHash == passwordHash) {
          return #ok("Login successful");
        } else {
          return #err("Incorrect password");
        };
      };
    };
  };

  // Helper function to get the caller's principal
  private func getCallerPrincipal(msg: {caller: Principal}) : Principal {
    return msg.caller;
  };

  // Modified function to add a new pet entry with owner information
  public shared(msg) func addPet(petInput: {
    name: Text;
    petType: Text;
    breed: Text;
    color: Text;
    height: Text;
    location: Text;
    category: Text;
    date: Text;
    area: Text;
    imageData: ?[Blob];
  }) : async Text {
    let id = generateId();
    let owner = getCallerPrincipal(msg);
    
    let pet: Pet = {
      id = id;
      name = petInput.name;
      petType = petInput.petType;
      breed = petInput.breed;
      color = petInput.color;
      height = petInput.height;
      location = petInput.location;
      category = petInput.category;
      date = petInput.date;
      area = petInput.area;
      imageData = petInput.imageData;
      owner = owner;
    };
    
    petStore.put(id, pet);
    return id;
  };

  // Function to update a pet's images
  public shared(msg) func updatePetImages(id: Text, imageData: [Blob]) : async Result<Bool, Text> {
    let caller = getCallerPrincipal(msg);
    
    switch (petStore.get(id)) {
      case (null) { return #err("Pet not found"); };
      case (?pet) {
        // Check if caller is the owner
        if (pet.owner != caller) {
          return #err("Not authorized - only the owner can update this pet");
        };
        
        let updatedPet: Pet = {
          id = pet.id;
          name = pet.name;
          petType = pet.petType;
          breed = pet.breed;
          color = pet.color;
          height = pet.height;
          location = pet.location;
          category = pet.category;
          date = pet.date;
          area = pet.area;
          imageData = ?imageData;
          owner = pet.owner;
        };
        petStore.put(id, updatedPet);
        return #ok(true);
      };
    };
  };

  // Function to get a pet by ID
  public shared query(msg) func getPet(id : Text) : async ?Pet {
    petStore.get(id);
  };

  // Function to get all pets
  public query func getAllPets() : async [(Text, Pet)] {
    Iter.toArray(petStore.entries());
  };

  // Modified function to delete a pet entry with ownership check
  public shared(msg) func deletePet(id : Text) : async Result<Text, Text> {
    let caller = getCallerPrincipal(msg);
    
    switch (petStore.get(id)) {
      case (null) { return #err("Pet not found"); };
      case (?pet) {
        // Check if caller is the owner of the pet
        if (pet.owner != caller) {
          return #err("Not authorized - only the owner can delete this pet");
        };
        
        petStore.delete(id);
        return #ok("Pet deleted successfully");
      };
    };
  };

  // Function to check if a pet ID exists
  public shared query(msg) func petExists(id : Text) : async Bool {
    Option.isSome(petStore.get(id));
  };
  
  // Function to get all pets by category (Lost or Found)
  public query func getPetsByCategory(category: Text) : async [Pet] {
    let pets = Iter.toArray(petStore.vals());
    Array.filter<Pet>(pets, func(pet) { pet.category == category });
  };
  
  // Function to get pets in a specific area
  public query func getPetsByArea(area: Text) : async [Pet] {
    let pets = Iter.toArray(petStore.vals());
    Array.filter<Pet>(pets, func(pet) { pet.area == area });
  };
  
  // Function to get pets by owner
  public shared query(msg) func getMyPets() : async [Pet] {
    let caller = getCallerPrincipal(msg);
    let pets = Iter.toArray(petStore.vals());
    Array.filter<Pet>(pets, func(pet) { pet.owner == caller });
  };

  // Define Result type for better error handling
  public type Result<T, E> = {
    #ok: T;
    #err: E;
  };
}