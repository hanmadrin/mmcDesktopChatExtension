let defaultMessagedata = {
    timeStamp: `${(new Date()).getTime()}`,
    fb_id: accountInfo.id,
    status: 'done'
};
const textMessageElements = singleMessage.querySelectorAll('div:not(:has(*)):not(:empty)');
let sentByElements = singleMessage.querySelectorAll('h4 > span:not(:has(*)):not(:empty)');
if(textMessageElements.length>1 && sentByElements.length>1){
    contentScripts.showDataOnConsole('Multiple messages slot found in single message');
    contentScripts.showConsoleError();
    throw new Error('Multiple messages slot found in single message');
}
if(textMessageElements.length==0 && sentByElements.length==0){
    console.log(singleMessage)
    contentScripts.showDataOnConsole('Facebook generated Message found');
    //continue;
}
if(sentByElements.length==0){
    sentByElements = singleMessage.querySelectorAll('div > span:not(:has(*)):not(:empty)');
    if(sentByElements.length==0){
        console.log(singleMessage)
        contentScripts.showDataOnConsole('There supposed to be a sender');
        contentScripts.showConsoleError();
        throw new Error('There supposed to be a sender');
    }if(sentByElements.length>1){
        contentScripts.showDataOnConsole('Multiple senders found');
        contentScripts.showConsoleError();
        throw new Error('Multiple senders found');
    }
}
if(textMessageElements.length==1 && sentByElements.length==1){
    const singleMessagedata = {
        ...defaultMessagedata,
        type: 'text',
        sent_from: getSender(sentByElements[0]),
        message: textMessageElements[0].innerText,
    };
    messageData.push(singleMessagedata);
    //continue;
}

// these messages are only
defaultMessagedata.sent_from = getSender(sentByElements[0]);

const videoElements = singleMessage.querySelectorAll('video');
if(videoElements.length!=0){
    defaultMessagedata.type = 'video';
    for(let j=0;j<videoElements.length;j++){
        const singleMessagedata = {
            ...defaultMessagedata,
            message: videoElements[j].src,
        };
        messageData.push(singleMessagedata);
    }
    //continue;
}

const gifImages = singleMessage.querySelectorAll('a[href^="/messenger_photo/"] img[src^="https://cdn.fbsbx.com"]');
if(gifImages.length!=0){
    defaultMessagedata.type = 'image';
    for(let j=0;j<gifImages.length;j++){
        const singleMessagedata = {
            ...defaultMessagedata,
            message: gifImages[j].src,
        };
        messageData.push(singleMessagedata);
    }
    //continue;
}

const imageViewerElements = singleMessage.querySelectorAll('a[aria-label="Open photo"],img[alt="Open photo"]');
if(imageViewerElements.length!=0){
    defaultMessagedata.type = 'image';
    for(let j=0;j<imageViewerElements.length;j++){
        const singleMessagedata = {
            ...defaultMessagedata,
            message: await retrieveImage(imageViewerElements[j]),
        };
        messageData.push(singleMessagedata);
    }
    //continue;
}



const imageElements = singleMessage.querySelectorAll('img[src^="https://static"]');
if(imageElements.length!=0){
    defaultMessagedata.type = 'image';
    for(let j=0;j<imageElements.length;j++){
        const singleMessagedata = {
            ...defaultMessagedata,
            message: imageElements[j].src,
        };
        messageData.push(singleMessagedata);
    }
    //continue;
}

const svgElements = singleMessage.querySelectorAll('svg');
if(svgElements.length==1){
    defaultMessagedata.type = 'text';
    const svgElement = svgElements[0];
    const svgElementText = `::${svgElement.textContent}::`;
    const singleMessagedata = {
        ...defaultMessagedata,
        message: svgElementText,
    };
    messageData.push(singleMessagedata);
    //continue;
}

const linkTextElement = singleMessage.querySelector('div:not(empty) > span[role="gridcell"] > a');
if(linkTextElement){
    const linkTextElementParent = linkTextElement.parentElement.parentElement;
    const linkTextNodes = linkTextElementParent.childNodes;
    for(let j=0;j<linkTextNodes.length;j++){
        const linkTextNode = linkTextNodes[j];
        if(linkTextNode.nodeType==3){
            // text
            const singleMessagedata = {
                ...defaultMessagedata,
                type: 'text',
                message: linkTextNode.textContent,

            };
            messageData.push(singleMessagedata);
        }else if(linkTextNode.nodeType==1){
            // element
            const linkElement = linkTextNode.querySelector('a');
            if(linkElement){
                const singleMessagedata = {
                    ...defaultMessagedata,
                    type: 'link',
                    message: linkElement.textContent,
                };
                messageData.push(singleMessagedata);
            }else{
                contentScripts.showDataOnConsole('There supposed to be a link');
                contentScripts.showConsoleError();
                throw new Error('There supposed to be a link');
            }
        }else{
            contentScripts.showDataOnConsole('Only text or element nodes are expected');
            contentScripts.showConsoleError();
            throw new Error('Only text or element nodes are expected');
        }
    }
    
}



console.log('new type of message found');
console.log(singleMessage);
console.log(getSender(sentByElements[0]));


contentScripts.showDataOnConsole('New type of message found');
contentScripts.showConsoleError();
throw new Error('New type of message found');


messages = document.querySelectorAll(fixedData.workingSelectors.readMessage.SingleMessages);
while(true){
    if(messages[i]){
        break;
    }
    await essentials.sleep(1000);
    messages = document.querySelectorAll(fixedData.workingSelectors.readMessage.SingleMessages);
}
let message = messages[i];
const messageInfo = JSON.parse(message.getAttribute('data-store'));
const timestamp = messageInfo.timestamp;
const sent_from = (messageInfo.author==accountInfo.id || messageInfo.author==accountInfo.name)?'me':'seller';
const text = message.querySelector(':scope > span');
let attachment = message.querySelector(':scope > div');
if(text.children.length!=0){
    // filter non ascii characters
    // max length 1000 char
    let messagetext = text.innerText;
    messagetext = messagetext.replace(/[^\x00-\x7F]/g, "");
    messagetext = messagetext.substring(0,999);
    const textData = {
        type: 'text',
        sent_from,
        message: messagetext,
        timestamp,
        fb_id: accountInfo.id,
        status: 'done'
    }
    messageData.push(textData);
}
if(attachment.children.length !=0){
    messages = document.querySelectorAll(fixedData.workingSelectors.readMessage.SingleMessages);
    message = messages[i];
    attachment = message.querySelector(':scope > div');
    let images = attachment.querySelectorAll('img,i');
    for(let j=0;j<images.length;j++){
        await essentials.sleep(1000);
        messages = document.querySelectorAll(fixedData.workingSelectors.readMessage.SingleMessages);
        message = messages[i];
        attachment = message.querySelector(':scope > div');
        images = attachment.querySelectorAll('img,i');
        const image = images[j];
        const tagName = image.tagName.toLowerCase();
        let imageSrc = '';
        if(tagName=='img'){
            imageSrc = image.src;
        }else{
            imageSrc = image.style.backgroundImage.replace('url(','').replace(')','').replace(/\"/gi, "");
        }
        console.log(image);
        const attachmentLink = image.closest('.msg').querySelector('a');
        let url = '';
        let fileType = '';
        if(attachmentLink){
            console.log('has attachment');
            const onpageUrl = attachmentLink.getAttribute('href');
            if(onpageUrl.includes("https://") && !onpageUrl.includes("https://facebook.com")){
                console.log('has external link');
                url = onpageUrl;
                fileType = 'link';
            }else{
                console.log('has internal link');
                console.log(onpageUrl);
                url = await contentScripts.retrieveAttachementUrl(document.querySelector(`[href="${onpageUrl}"]`));
                fileType = contentScripts.getFileTypeFromUrl(url);
            }
        }else{
            console.log('no attachment');
            url = imageSrc;
            fileType = contentScripts.getFileTypeFromUrl(url);
        }
        
        console.log(imageSrc)
        const imageData = {
            type: fileType,
            sent_from,
            message: url,
            timestamp,
            fb_id: accountInfo.id,
            status: 'done'
        }
        messageData.push(imageData);

        // const imageData = {
        //     type: 'image',
        //     sent_from,
        //     message: imageSrc,
        //     timestamp,
        //     fb_id: accountInfo.id,
        //     status: 'done'
        // }
        // messageData.push(imageData);
    }
}