
//GRPC SERVER>>>

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import  { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';

//load the proto buff file and parse the proto buff file
const packageDefinition = protoLoader.loadSync(path.join(__dirname , './a.proto'));

//we put it into a grpc function
const personProto = grpc.loadPackageDefinition(packageDefinition);

//in memory object --(irl database used)
const PERSONS = [
    {
        name : "srinjoy",
        age : 45
    },
    {
        name : "shakir",
        age : "45"
    },
];

//functions in grpc server has two things one is a call parameter another one is a callback parameter
//call is all the details of the function call
//callback is something we call with the response 

//call -> req , callback --> res
//@ts-ignore
function addPerson(call  , callback ){

    console.log(call);
    let person =  {
        name : call.request.name,
        age : call.request.age
    }
    PERSONS.push(person);
    callback(null , person); //two arguments first one is the error , and seocnd one is the object we wznt to send 

}

//@ts-ignore
function getPersonByName(call , callback) {
    console.log(call);
    //this func in the proto file finds the name of the person with the name as an input
    const name = call.request.name;
    const person = PERSONS.find(x => x.name === name); //find if the person is there or not na then return the name 
    callback(null , person);
}

const server = new grpc.Server();

//we are adding a service to the server and telling the addPerson service will be handled by the above addPErson funciton
//@ts-ignore
server.addService(personProto.AddressBookService.service , {
    addPerson : addPerson,
    getPersonByName : getPersonByName,
});

//it is like app.listen
server.bindAsync('0.0.0.0:50051' , grpc.ServerCredentials.createInsecure() , () => {
    server.start();
});
