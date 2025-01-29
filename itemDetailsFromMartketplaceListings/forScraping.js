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
            const item = marketplaceProductDetailsPage.target;
            const yearName = (item.custom_title || item.marketplace_listing_title).replace(/(^SUV )|(^CAR )/g,'');
            const year = yearName.match(/^\d{4}/).toString();
            const name = yearName.replace(/^\d{4}/, '').trim();
            const price = item.listing_price.amount.replace('.00', '');
            const cityState = item.location_text.text;
            const city = (cityState.split(',').length==1?"":cityState.split(',')[0]).trim();
            const state = stateConverter(cityState.split(',').length==1?cityState.split(',')[0].trim():cityState.split(',')[1].trim());
            const mileage = item.vehicle_odometer_data.value.toString();
            const seller = item.marketplace_listing_seller.name;
            const seller_id = item.marketplace_listing_seller.id;
            const number = item.id;
            const data = {
                year: year.replace(/,/g, ""),
                name: name.replace(/,/g, ""),
                price: price.replace(/,/g, ""),
                city: city.replace(/,/g, ""),
                state: state.replace(/,/g, ""),
                mileage: mileage.replace(/,/g, ""),
                seller: seller.replace(/,/g, ""),
                time: seller_id,
                number: number,
                status:'done'
            }
            console.log(data);
            return data;
        }else{
            console.log('marketplace_product_details_page not found')
            return null;
        }
    }else{
        console.log('script not found')
        return null;
    }
    
    



};