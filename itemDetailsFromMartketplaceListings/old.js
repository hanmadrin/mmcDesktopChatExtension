()=>{
    const jsonScripts = document.querySelectorAll('script[type="application/json"]');
    let jsonData = null;
    let jsonDatas = [];
    for(let i=0;i<jsonScripts.length;i++){
        const fullText = jsonScripts[i].textContent;
        // find "marketplace_product_details_page"
        if(fullText.includes('marketplace_product_details_page')){
            jsonDatas.push(JSON.parse(fullText));
            // break;
        }
    }
    if(jsonDatas.length>0){ 
        jsonDatas.length>1?jsonData = jsonDatas[1]:jsonData = jsonDatas[0];
        const findNestedKeyValue = (obj, targetKey)=>{
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (key === targetKey) {
                  return value;
                } else if (typeof value === 'object') {
                  const result = findNestedKeyValue(value, targetKey);
                  if (result !== undefined) {
                    return result;
                  }
                }
              }
            }
            return undefined;
        }
        
        const stateConverter = (shortState)=>{
            // var shortStates = ['WI','IL','TN','MS','AL','FL','GA','SC','NC','KY','VA','IN','MI','OH','PA','NY','ME','NH','VT','MA','RI','CT','NJ','DE','MD','WV'];
            var shortStates = ['WI','IL','TN','FL','GA','SC','NC','KY','VA','IN','MI','OH','PA','NY','ME','NH','VT','MA','RI','CT','NJ','DE','MD','WV','MN',"IA","MO","AR","TX","OK",'KS','ND'];
            var states = ['Wisconsin','Illinois','Tennessee','Florida','Georgia','South Carolina','North Carolina','Kentucky','Virginia','Indiana','Michigan','Ohio','Pennsylvania','New York','Maine','New Hampshire','Vermont','Massachusetts','Rhode Island','Connecticut','New Jersey','Delaware','Maryland','West Virginia','Minnesota','Iowa','Missouri','Arkansas','Texas','Oklahoma','Kansas','North Dakota'];
            // var states = ['Wisconsin','Illinois','Tennessee','Mississippi','Alabama','Florida','Georgia','South Carolina','North Carolina','Kentucky','Virginia','Indiana','Michigan','Ohio','Pennsylvania','New York','Maine','New Hampshire','Vermont','Massachusetts','Rhode Island','Connecticut','New Jersey','Delaware','Maryland','West Virginia'];
            // var states = ['Minnesota','Iowa','Missouri','Arkansas','Texas'];
            return shortStates.indexOf(shortState)==-1?shortState:states[shortStates.indexOf(shortState)];
        };
        const timeStampConverter = (timeStamp)=>{
            return (new Date(timeStamp)).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short',
                hour12: false,
              });
        };
        const marketplaceProductDetailsPage = findNestedKeyValue(jsonData, 'marketplace_product_details_page');
        if(marketplaceProductDetailsPage) {
            try{
                const item = marketplaceProductDetailsPage.target;
                const messageThread = item.seller_message_thread?.thread_key?.thread_fbid || null;
                console.log(item);
                return {
                    sold: item.is_sold,
                    messageThread: messageThread,
                }
            }catch(e){
                return null;
            }
        }else{
            console.log('script not found')
            return null;
        }
    }
}