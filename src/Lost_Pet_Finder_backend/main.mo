import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor {
  // Define the Pet type
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
  };

  // Use stable variables to persist state
  stable var petEntries : [(Text, Pet)] = [];

  // Create a new HashMap and initialize it with the stable entries
  var petStore = HashMap.HashMap<Text, Pet>(
    10,  // Initial capacity
    Text.equal,
    Text.hash
  );

  // System functions to manage stable storage
  system func preupgrade() {
    petEntries := Iter.toArray(petStore.entries());
  };

  system func postupgrade() {
    petStore := HashMap.fromIter<Text, Pet>(
      petEntries.vals(),
      petEntries.size(),
      Text.equal,
      Text.hash
    );
    petEntries := [];  // Clear after restoration
  };

  // Function to add a new pet entry
  public shared(msg) func addPet(pet: Pet) : async () {
    petStore.put(pet.id, pet);
  };

  // Function to get a pet by ID
  public shared(msg) func getPet(id : Text) : async ?Pet {
    petStore.get(id);
  };

  // Function to get all pets
  public query func getAllPets() : async [(Text, Pet)] {
    Iter.toArray(petStore.entries());
  };

  // Function to delete a pet entry
  public shared(msg) func deletePet(id : Text) : async () {
    petStore.delete(id);
  };

  // Function to check if a pet ID exists
  public shared(msg) func petExists(id : Text) : async Bool {
    Option.isSome(petStore.get(id));
  };
  
  // Function to get all pets by category (Lost or Found)
  public query func getPetsByCategory(category: Text) : async [Pet] {
    let pets = Iter.toArray(petStore.vals());
    Array.filter<Pet>(pets, func(pet) { pet.category == category });
  };
  
  // Function to get all pets in a specific area
  public query func getPetsByArea(area: Text) : async [Pet] {
    let pets = Iter.toArray(petStore.vals());
    Array.filter<Pet>(pets, func(pet) { pet.area == area });
  };
};