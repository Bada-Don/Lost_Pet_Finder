import User "user";
import Pet "pet";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Array "mo:base/Array"; // Import Array module
import Option "mo:base/Option";

actor {
  stable var petEntries : [(Text, Pet.Pet)] = [];
  stable var userEntries : [(Text, User.User)] = [];
  stable var nextId : Nat = 1;

  let petStore = HashMap.fromIter<Text, Pet.Pet>(petEntries.vals(), 10, Text.equal, Text.hash);
  let userStore = HashMap.fromIter<Text, User.User>(userEntries.vals(), 10, Text.equal, Text.hash);

  system func preupgrade() {
    petEntries := Iter.toArray(petStore.entries());
    userEntries := Iter.toArray(userStore.entries());
  };

  public shared(msg) func registerUser(username: Text, passwordHash: Text, email: Text) : async Result.Result<Text, Text> {
    User.registerUser(username, passwordHash, email, userStore);
  };

  public shared(msg) func addPet(petInput: Pet.PetInput) : async Text {
    let id = Nat.toText(nextId);
    nextId += 1;
    let owner = msg.caller;
    let pet = Pet.createPet(id, owner, petInput);
    petStore.put(id, pet);
    id
  };

  public shared(msg) func deletePet(id: Text) : async Result.Result<Text, Text> {
    Pet.deletePet(id, msg.caller, petStore);
  };

  public shared(msg) func loginUser(username: Text, passwordHash: Text) : async Result.Result<Text, Text> {
    User.loginUser(username, passwordHash, userStore)
  };

  public shared func getAllPets() : async [(Text, Pet.Pet)] {
    Iter.toArray(petStore.entries());
  };

  public shared func getPetsByCategory(category: Text) : async [(Text, Pet.Pet)] {
    let filteredPets = Array.filter<(Text, Pet.Pet)>(Iter.toArray(petStore.entries()), func(entry: (Text, Pet.Pet)): Bool {
      let pet = entry.1;
      pet.category == category
    });
    return filteredPets;
  };

  public shared func getPet(id: Text) : async ?Pet.Pet {
    petStore.get(id);
  };
};
