

# grpc server >

to create a grpc server we have to first define a proto file
which will have all the messages and our rpc methods that our backend will support

given a proto file we can wrie our backend in whattever language we wan
and the proto file will give us auto generated clients for it

# proto file schema >.


syntax = "proto3";

//define a message type representing a person >

message person {
    string name = 1;
    int32 age = 2;
}

//services that out backend will have that can be used throughout the application


service AddressBookService {

    //add a person to the address book >
    //it is like a http end point to make a appointment for the person
    rpc addPerson(person) returns (person);

    //IT IS LIKE a http end point where we get the name of a person by their firstname / lastname
    //get a person from their name >>
    rpc GetPersonByName(GetPersonByNameRequest) returns (person);

}

message GetPersonByNameRequest {
    string name = 1;
}