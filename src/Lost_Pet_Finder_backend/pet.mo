import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

module Pet {
  public type Pet = {
    id: Text;
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
    owner: Principal;
  };

  public type PetInput = {
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
  };

  public func createPet(id: Text, owner: Principal, input: PetInput) : Pet {
    {
      id; owner;
      name = input.name;
      petType = input.petType;
      breed = input.breed;
      color = input.color;
      height = input.height;
      location = input.location;
      category = input.category;
      date = input.date;
      area = input.area;
      imageData = input.imageData;
    }
  };

  public func deletePet(id: Text, caller: Principal, petStore: HashMap.HashMap<Text, Pet>) : Result.Result<Text, Text> {
    switch (petStore.get(id)) {
      case null #err("Pet not found");
      case (?pet) {
        if (pet.owner != caller) #err("Unauthorized")
        else {
          petStore.delete(id);
          #ok("Pet deleted");
        };
      };
    };
  };
};