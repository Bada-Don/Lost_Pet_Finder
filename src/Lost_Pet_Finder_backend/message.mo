import Principal "mo:base/Principal";
import Time "mo:base/Time";

module Message {
  public type Message = {
    id: Text;
    fromUser: Principal;
    toUser: Principal;
    petId: Text;
    content: Text;
    timestamp: Int;
    isRead: Bool;
  };

  public type MessageInput = {
    petId: Text;
    toUser: Principal;
    content: Text;
  };
}
