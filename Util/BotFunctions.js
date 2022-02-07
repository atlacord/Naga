const fs = require('fs');



function msgCollection(message, lastMsg, writeMsg) {
    let overflowToggle = true; 

    // Note: Works Chronogically, grabbing recent messages and then going back! 
    message.channel.getMessages({ limit: 100, before: lastMsg })
    .then(messages => {
        messages.forEach((message, index)=>{  //  Funnels the last 100 Messages into an Array
            writeMsg.push(`${message.author.username.toString()}: ${message.content}`);  //  Writes the Message Author and Content to an Array

            //  Checks if a Text Channel has more than 100 Messages and Recursively Readies the Second Block of 100 Messages
            if (index == 99) {
                lastMsg = message.id;
                overflowToggle = false;  //  Toggle to Make Sure All Messages are Collected in The Array Prior to being Written to a File.
                msgCollection(message, lastMsg, writeMsg)
            }
        })
        writeToFile(message, writeMsg, overflowToggle);  //  Sends the Array to be Written to a File
    })
    .catch(console.error);  //  Catches Promise Errors
}





function writeToFile(message, writeMsg, overflowToggle) {
    console.log('Block Saved!');
    if (overflowToggle == true) {

        let d = new Date();
        let fileName = message.channel.name + "-" + d.getTime().toString() + '.txt';

        for (i=writeMsg.length-1; i>=0; i--) {
            fs.appendFile(fileName, `${writeMsg[i]} \n`, (err) => {
                if (err) throw err;
            })
        }

    }

}

















module.exports = {
msgCollection, 
writeToFile
}