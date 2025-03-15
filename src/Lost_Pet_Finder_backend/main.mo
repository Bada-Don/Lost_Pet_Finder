import User "user";
import Pet "pet";
import Message "message"; // Import the new Message module
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

actor {
  stable var petEntries : [(Text, Pet.Pet)] = [];
  stable var userEntries : [(Text, User.User)] = [];
  stable var messageEntries : [(Text, Message.Message)] = [];
  stable var nextId : Nat = 1;
  stable var nextMessageId : Nat = 1;

  let petStore = HashMap.fromIter<Text, Pet.Pet>(petEntries.vals(), 10, Text.equal, Text.hash);
  let userStore = HashMap.fromIter<Text, User.User>(userEntries.vals(), 10, Text.equal, Text.hash);
  let messageStore = HashMap.fromIter<Text, Message.Message>(messageEntries.vals(), 10, Text.equal, Text.hash);

  system func preupgrade() {
    petEntries := Iter.toArray(petStore.entries());
    userEntries := Iter.toArray(userStore.entries());
    messageEntries := Iter.toArray(messageStore.entries());
  };

  public shared (msg) func registerUser(username : Text, passwordHash : Text, email : Text) : async Result.Result<Text, Text> {
    User.registerUser(username, passwordHash, email, userStore);
  };

  public shared (msg) func addPet(petInput : Pet.PetInput) : async Text {
    let id = Nat.toText(nextId);
    nextId += 1;
    let owner = msg.caller;
    let pet = Pet.createPet(id, owner, petInput);
    petStore.put(id, pet);
    id;
  };

  public shared (msg) func deletePet(id : Text) : async Result.Result<Text, Text> {
    Pet.deletePet(id, msg.caller, petStore);
  };

  public shared (msg) func loginUser(username : Text, passwordHash : Text) : async Result.Result<Text, Text> {
    User.loginUser(username, passwordHash, userStore);
  };

  public shared func getAllPets() : async [(Text, Pet.Pet)] {
    Iter.toArray(petStore.entries());
  };

  public shared func getPetsByCategory(category : Text) : async [(Text, Pet.Pet)] {
    let filteredPets = Array.filter<(Text, Pet.Pet)>(
      Iter.toArray(petStore.entries()),
      func(entry : (Text, Pet.Pet)) : Bool {
        let pet = entry.1;
        pet.category == category;
      },
    );
    return filteredPets;
  };

  public shared func getPet(id : Text) : async ?Pet.Pet {
    petStore.get(id);
  };

  // New messaging functions
  public shared (msg) func sendMessage(messageInput : Message.MessageInput) : async Result.Result<Text, Text> {
    // Check if the pet exists
    switch (petStore.get(messageInput.petId)) {
      case null return #err("Pet not found");
      case (?pet) {
        let id = Nat.toText(nextMessageId);
        nextMessageId += 1;

        let newMessage : Message.Message = {
          id = id;
          fromUser = msg.caller;
          toUser = messageInput.toUser;
          petId = messageInput.petId;
          content = messageInput.content;
          timestamp = Time.now();
          isRead = false;
        };

        messageStore.put(id, newMessage);
        #ok(id);
      };
    };
  };

  public shared (msg) func getUserMessages() : async [Message.Message] {
    let myMessages = Array.filter<(Text, Message.Message)>(
      Iter.toArray(messageStore.entries()),
      func(entry : (Text, Message.Message)) : Bool {
        let message = entry.1;
        Principal.equal(message.toUser, msg.caller) or Principal.equal(message.fromUser, msg.caller);
      },
    );

    Array.map<(Text, Message.Message), Message.Message>(
      myMessages,
      func(entry : (Text, Message.Message)) : Message.Message {
        entry.1;
      },
    );
  };

  public shared (msg) func getMessagesForPet(petId : Text) : async [Message.Message] {
    let petMessages = Array.filter<(Text, Message.Message)>(
      Iter.toArray(messageStore.entries()),
      func(entry : (Text, Message.Message)) : Bool {
        let message = entry.1;
        message.petId == petId and (Principal.equal(message.toUser, msg.caller) or Principal.equal(message.fromUser, msg.caller));
      },
    );

    Array.map<(Text, Message.Message), Message.Message>(
      petMessages,
      func(entry : (Text, Message.Message)) : Message.Message {
        entry.1;
      },
    );
  };

  public shared (msg) func markMessageAsRead(messageId : Text) : async Result.Result<Text, Text> {
    switch (messageStore.get(messageId)) {
      case null #err("Message not found");
      case (?message) {
        if (Principal.equal(message.toUser, msg.caller)) {
          let updatedMessage = {
            id = message.id;
            fromUser = message.fromUser;
            toUser = message.toUser;
            petId = message.petId;
            content = message.content;
            timestamp = message.timestamp;
            isRead = true;
          };
          messageStore.put(messageId, updatedMessage);
          #ok("Message marked as read");
        } else {
          #err("Unauthorized");
        };
      };
    };
  };

  public shared (msg) func getOwnPrincipal() : async Principal {
    return msg.caller;
  };
};
