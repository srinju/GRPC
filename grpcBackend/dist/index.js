"use strict";
//GRPC SERVER>>>
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
//load the proto buff file and parse the proto buff file
const packageDefinition = protoLoader.loadSync(path_1.default.join(__dirname, '../src/a.proto'));
//we put it into a grpc function
const personProto = grpc.loadPackageDefinition(packageDefinition);
//in memory object --(irl database used)
const PERSONS = [
    {
        name: "srinjoy",
        age: 45
    },
    {
        name: "shakir",
        age: "45"
    },
];
//functions in grpc server has two things one is a call parameter another one is a callback parameter
//call is all the details of the function call
//callback is something we call with the response 
//call -> req , callback --> res
//@ts-ignore
function addPerson(call, callback) {
    console.log(call);
    let person = {
        name: call.request.name,
        age: call.request.age
    };
    PERSONS.push(person);
    callback(null, person); //two arguments first one is the error , and seocnd one is the object we wznt to send 
}
//@ts-ignore
function getPersonByName(call, callback) {
    console.log(call);
    //this func in the proto file finds the name of the person with the name as an input
    const name = call.request.name;
    const person = PERSONS.find(x => x.name === name); //find if the person is there or not na then return the name 
    callback(null, person);
}
const server = new grpc.Server(); //init a new grpc server
//we are adding a service to the server and telling the addPerson service will be handled by the above addPErson funciton
//@ts-ignore
server.addService(personProto.AddressBookService.service, {
    addPerson: addPerson,
    getPersonByName: getPersonByName,
});
//it is like app.listen to -<  grpc://localhost:50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
