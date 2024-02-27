export const getSender = (loggedUser, users)=>{
    // console.log("Get Sender getting called");
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}