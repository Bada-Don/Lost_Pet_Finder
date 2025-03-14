import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module User {
  public type User = {
    username: Text;
    passwordHash: Text;
    email: Text;
  };

  public func registerUser(username: Text, passwordHash: Text, email: Text, userStore: HashMap.HashMap<Text, User>) : Result.Result<Text, Text> {
    if (Text.size(username) == 0) return #err("Username required");
    switch (userStore.get(username)) {
      case (?_) #err("Username exists");
      case null {
        let user : User = {username; passwordHash; email};
        userStore.put(username, user);
        #ok("User registered");
      };
    };
  };

  public func loginUser(username: Text, passwordHash: Text, userStore: HashMap.HashMap<Text, User>) : Result.Result<Text, Text> {
    switch (userStore.get(username)) {
      case null #err("User not found");
      case (?user) {
        if (user.passwordHash == passwordHash) #ok("Login success")
        else #err("Incorrect password");
      };
    };
  };
};