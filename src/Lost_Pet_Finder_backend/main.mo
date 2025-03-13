import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor {
  // Use stable variables to persist state
  stable var entries : [(Text, Text)] = [];

  // Create a new HashMap and initialize it with the stable entries
  var store = HashMap.HashMap<Text, Text>(
    10,  // Initial capacity
    Text.equal,
    Text.hash
  );

  // System functions to manage stable storage
  system func preupgrade() {
    entries := Iter.toArray(store.entries());
  };

  system func postupgrade() {
    store := HashMap.fromIter<Text, Text>(
      entries.vals(),
      entries.size(),
      Text.equal,
      Text.hash
    );
    entries := [];  // Clear after restoration
  };

  // Function to set a key-value pair
  public shared(msg) func set(key : Text, value : Text) : async () {
    store.put(key, value);
  };

  // Function to get a value by key
  public shared(msg) func get(key : Text) : async ?Text {
    store.get(key);
  };

  // Function to get all key-value pairs
  public query func getAll() : async [(Text, Text)] {
    Iter.toArray(store.entries());
  };

  // Function to delete a key-value pair
  public shared(msg) func delete(key : Text) : async () {
    store.delete(key);
  };

  // Function to check if a key exists
  public shared(msg) func containsKey(key : Text) : async Bool {
    Option.isSome(store.get(key));
  };
};