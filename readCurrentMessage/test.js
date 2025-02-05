(async ()=>{
    const fixedData = {
        workingSelectors:{
            readMessage:{
                messageBox: '[role="navigation"] + div  [aria-label^="Conversation "][role="main"]',
                SingleMessages: '[role="row"] > div > [data-scope="messages_table"][role="gridcell"]',
            }
        },
    };
    const essentials = {
        sleep: (ms)=>{return new Promise((resolve)=>{setTimeout(resolve,ms)})},
    }
    const contentScripts = {
        accountInfo: async ()=>{
            return {
                id: '100090636455079',
                name: 'Mike Ritter'
            };
        },
        showDataOnConsoleDynamic: (data)=>{
            // console.log(data);
        },
        showDataOnConsole: (data)=>{
            // const standard = document.getElementById(fixedData.workingSelectors.content.console  +'standard');
            // const content = document.createElement('div');
            // content.classList.add('font-sub');
            // content.innerText = data;
            // standard.appendChild(content);
            // console.log(data);
        },
        getElementBySelector: async ({parent,data, instant, maxTimeOut=1, required,name,debug=true}) => {
            const {type, isMonoExpected, selector, innerText, value, validator} = data;
            let count = 0;
            let result = null;
            do{
                count++;
                if(count<=maxTimeOut){
                    if(!instant){
                        await essentials.sleep(1000);
                    }
                    if(debug){
                        contentScripts.showDataOnConsoleDynamic(`${count} Seconds Waiting for element : ${name || selector}`)
                    }
                }else{
                    break;
                }
                let elements = null;
                if(parent){
                    elements = parent[type](selector);
                }else{
                    elements = document[type](selector);
                }
    
                if(isMonoExpected){
                    if(elements.length==1){  
                        if(validator){
                            if(validator(elements[0])){
                                result = elements[0];
                                break;
                            }
                        }else if(innerText){
                            if(elements[0].innerText.includes(innerText)){
                                result = elements[0];
                                break;
                            }
                        }else if(value){
                            if(elements[0].value.includes(value)){
                                result = elements[0];
                                break;
                            }
                        }else{
                            result = elements[0];
                            break;
                        }
                    }else if(elements.length>1){
                        if(validator){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                if(validator(elements[i])){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length===1){
                                result = filteredElements[0];
                                break;
                            }
                        }else if(innerText){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                // console.log(elements[i].innerText,innerText)
                                if(elements[i].innerText.includes(innerText)){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length===1){
                                result = filteredElements[0];
                                break;
                            }
                        }else if(value){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                if(elements[i].value.includes(value)){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length===1){
                                result = filteredElements[0];
                                break;
                            }
                        }
                    }
                }else{
                    if(elements.length>0){
                        if(validator){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                if(validator(elements[i])){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length>0){
                                result = filteredElements;
                                break;
                            }
                        }else if(innerText){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                if(elements[i].innerText.includes(innerText)){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length>0){
                                result = filteredElements;
                                break;
                            }
                        }else if(value){
                            const filteredElements = [];
                            for(let i=0;i<elements.length;i++){
                                if(elements[i].value.includes(value)){
                                    filteredElements.push(elements[i]);
                                }
                            }
                            if(filteredElements.length>0){
                                result = filteredElements;
                                break;
                            }
                        }else{
                            result = elements;
                            break;
                        }
                    }
                }
            }while(!instant);
            if(required && !result){
                contentScripts.showDataOnConsoleDynamic(`Element not found and required: ${name ||selector}`);
                contentScripts.showConsoleError();
                throw new Error({parent,data, instant, maxTimeOut, required,name});
            }else{
                if(!result){
                    contentScripts.showDataOnConsoleDynamic(`Element not found: ${name ||selector}`);
                    return null;
                }else{
                    if(debug){
                        contentScripts.showDataOnConsoleDynamic(``)
                    }
                    return result;
                }
            }
        },
        showConsoleError: ()=>{},
    }
    contentScripts.showDataOnConsole('Reading current message');
    const accountInfo = await contentScripts.accountInfo();
    let messagesData = [];
    const messageBox = await contentScripts.getElementBySelector({
        data:{
            selector: fixedData.workingSelectors.readMessage.messageBox,
            type: 'querySelectorAll',
            isMonoExpected: true,
        },
        instant: true,
        required: true,

    });
    const messages = messageBox.querySelectorAll(fixedData.workingSelectors.readMessage.SingleMessages);
    if(messages.length==0){
        contentScripts.showDataOnConsole('No messages found');
        contentScripts.showConsoleError();
        throw new Error('No messages found');
    }
    const getSender = (senderElement)=>{
        const senderElementText = senderElement.innerText;
        if(senderElementText == 'You sent' || senderElementText.includes('You replied to')){
            return 'me';
        }else{
            return 'seller';
        }
    };
    const retrieveImage = async (imageElement)=>{
        const initialTime = new Date().getTime();
        const isTimeOverSpent = ()=>{
            const timeLimit = 60*1*1000;
            const timeNow = new Date().getTime();
            if(timeNow-initialTime>=timeLimit){
                return true;
            }else{
                return false;
            }
        };
        const timeStatusGenerator = ()=>{
            const timeLimit = 60*1*1000;
            const timeNow = new Date().getTime();
            return `${Math.floor((timeNow-initialTime)/1000)}/${Math.floor(timeLimit/1000)} seconds used searching for messages`;
        };
        imageElement.click();
        const imageViewer = await contentScripts.getElementBySelector({
            data:{
                selector: '[aria-label="Media viewer"] img:not([referrerpolicy])',
                type: 'querySelectorAll',
                isMonoExpected: true,
            },
            instant: false,
            maxTimeOut: 10,
            required: true,
            name: 'Image Viewer'
        });
        const imageUrl = imageViewer.src;
        const closeButton = await contentScripts.getElementBySelector({
            data:{
                selector: '[aria-label="Media viewer"] [aria-label="Close"]',
                type: 'querySelectorAll',
                isMonoExpected: true,
            },
            instant: false,
            maxTimeOut: 10,
            required: true,
            name: 'Close Button'
        });
        closeButton.click();
        while(true){
            contentScripts.showDataOnConsoleDynamic(timeStatusGenerator());
            if(isTimeOverSpent()){
                contentScripts.showDataOnConsole('Image not loaded');
                contentScripts.showConsoleError();
                throw new Error('Image not loaded');
            }
            const imageViewer = document.querySelector('[aria-label="Media viewer"]');
            if(!imageViewer){
                break;
            }
            await essentials.sleep(1000);
        }
        return imageUrl;
    };
    const singleMessageReader = async (sender,holder)=>{
        // const sender = getSender(singleMessage.firstElementChild);
        let defaultdata = {
            sent_from: sender,
            timestamp: `${(new Date()).getTime()}`,
            fb_id: accountInfo.id,
            status: 'done',
        };

        // audio elements
        const audioElements = holder.querySelectorAll('[aria-label="Audio scrubber"]');
        if(audioElements.length!=0){
            const datas = [];
            for(let i=0;i<audioElements.length;i++){
                const audio = audioElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'audio',
                    type: 'text',
                    message: "ERROR:: SELLER SENT A AUDIO CLIP AND AUTOMATION PROGRAM WAS UNABLE TO READ"
                }
                datas.push(data);
            }
            return datas;
        }
        // gif elements
        const gifElements = holder.querySelectorAll('a[href^="/messenger_photo/"] img[alt]');
        if(gifElements.length!=0){
            const datas = [];
            for(let i=0;i<gifElements.length;i++){  
                const gif = gifElements[i];
                // console.log(gif);
                const data = {
                    ...defaultdata,
                    raw_type: 'gif',
                    type: 'image',
                    message: gif.src
                }
                datas.push(data);
            }
            return datas;
        }
        // file elements
        const fileElements = holder.querySelectorAll('a[download]');
        if(fileElements.length!=0){
            const datas = [];
            for(let i=0;i<fileElements.length;i++){
                const file = fileElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'file',
                    type: 'file',
                    message: file.href
                }
                datas.push(data);
            }
            return datas;
        }
        // video elements
        const videoElements = holder.querySelectorAll('video');
        if(videoElements.length!=0){
            const datas = [];
            for(let i=0;i<videoElements.length;i++){
                const video = videoElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'video',
                    type: 'video',
                    message: video.getAttribute('src')
                }
                datas.push(data);
            }
            return datas;
        }

        // image elements
        const imageElements = holder.querySelectorAll('[href^="/messenger_media/"] img');
        if(imageElements.length!=0){
            const datas = [];
            for(let i=0;i<imageElements.length;i++){
                const image = imageElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'image',
                    type: 'image',
                    message: await retrieveImage(image)
                }
                datas.push(data);
            }
            return datas;
        }

        // like elements
        const likeElements = holder.querySelectorAll('svg title');
        if(likeElements.length!=0){
            const datas = [];
            for(let i=0;i<likeElements.length;i++){
                const like = likeElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'svg',
                    type: 'text',
                    message: `::${like.textContent}::`
                }
                datas.push(data);
            }
            return datas;
        }

        // text elements
        const textElements = holder.querySelectorAll('div:not(:has(*)):not(:empty)');
        if(textElements.length!=0){
            const datas = [];
            for(let i=0;i<textElements.length;i++){
                const text = textElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'text',
                    type: 'text',
                    message: text.innerText
                }
                datas.push(data);
            }
            return datas;
        }

        // icon elements
        const iconElements = holder.querySelectorAll('img:not([src*="data:image"])');
        if(iconElements.length!=0){
            const datas = [];
            for(let i=0;i<iconElements.length;i++){
                const icon = iconElements[i];
                const data = {
                    ...defaultdata,
                    raw_type: 'icon',
                    type: 'image',
                    message: icon.src
                }
                datas.push(data);
            }
            return datas;
        }

        // unread image
        const unreadImage = holder.querySelector('img[alt="Open photo"]');
        if(unreadImage){
            const data = {
                ...defaultdata,
                raw_type: 'unread_image',
                type: 'text',
                message: "ERROR:: SELLER SENT A IMAGE AND AUTOMATION PROGRAM WAS UNABLE TO GET"
            }
            return [data];
        }

        console.log(holder)
    }
    for(let i=0;i<messages.length;i++){
        const singleMessage = messages[i];
        // console.log(`singleMessage`,singleMessage);
        const messageHolder = await contentScripts.getElementBySelector({
            data:{
                selector: ':scope > div:has(:nth-child(3))',
                type: 'querySelectorAll',
                isMonoExpected: true,
                validator: (element)=>{
                    if(element.childElementCount>=3){
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            parent: singleMessage,
            instant: true,
            required: false,
            name: 'Message Data Holder',
            debug: false
        });
        console.log(`messageHolder`,messageHolder);
        if(messageHolder!=null){
            // midle child
            let messageDataHolder = messageHolder.children[1].firstChild;
            // messageDataHolder = messageDataHolder.querySelector(":scope > :not(:empty)");
            const messageSender = getSender(singleMessage.firstElementChild);
            // console.log(`messageSender`,messageSender);
            const messageData = await singleMessageReader(messageSender,messageDataHolder);
            if(messageData!=null){
                messagesData = [...messagesData,...messageData];
            }
        }else{  
            console.log('Not a Message Section');
        }
        continue;
        
    }
    // console.log(`Message Reader Completed`,messagesData);
    console.table(messagesData)
    // console.log(`Message Reader Completed`,messagesData);
    return messagesData;
})()