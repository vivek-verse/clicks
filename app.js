import clicksData from "./clicks.js";

export class Clicks {
    constructor() {
        this.clicksData = clicksData;

        /* 
           to store 
           ip : count of ip in data
           to check > 10
        */

        this.ipCountHashMap = {};

        /* 
            to store intermediate data in 
            ip-hour = timestamp-amount
        */

        this.ipMaxAmountHashMap = {};
    }

    // set count of each ip to check > 10 condition
    setIpCounts(){
        for(const click of this.clicksData){
            const { ip } = click;
            if(!this.ipCountHashMap[ip]){
                this.ipCountHashMap[ip] = 0;
            }
            ++this.ipCountHashMap[ip];
        }
    }

    // to get hour from timestamp
    getHourFromTimeStamp(timestamp){
        return new Date(timestamp).getHours();
    }

    // to use when amount are equal in same hour
    compareTimeStamps(tmp1, tmp2){
        if(new Date(tmp1).getTime() > new Date(tmp2).getTime()){
            return true;
        }
        return false;
    }

    setIpHourlyMaxAmounts(){
      for(const click of this.clicksData){
        const { ip, timestamp, amount } = click;
        if(this.ipCountHashMap[ip] > 10){
            continue;
        }
        const hour = this.getHourFromTimeStamp(timestamp);
        const key = `${ip}-${hour}`;
        const value = `${timestamp}-${amount}`;

        if(!this.ipMaxAmountHashMap[key]){

            /* 
                11.11.11.11-2 = 3/11/2020 02:12:32-6.5
                ip - hour = timestamp - amount
            */

            this.ipMaxAmountHashMap[key] = value;
        }else{

            const [previousMaxTimeStampInHourForIp, previousAmount] = this.ipMaxAmountHashMap[key].split("-");

            if(+previousAmount === +amount &&
                this.compareTimeStamps(timestamp, previousMaxTimeStampInHourForIp)){
                this.ipMaxAmountHashMap[key] = value;
            }

            // + is shorthand to convert string in number
            if(+amount > +previousAmount){
                this.ipMaxAmountHashMap[key] = value;
            }
        }
      }  

    }

    // to generate output subset from ipMaxAmountHashMap
    getOutputSubset(){
        const outputSubset = [];
        for(const ipKey in this.ipMaxAmountHashMap){
            const ip = ipKey.split("-")[0];
            const [timestamp, amount] = this.ipMaxAmountHashMap[ipKey].split("-");
            outputSubset.push({ip, timestamp, amount});
        }

        return outputSubset;
    }

}

// const clicks = new Clicks();
// clicks.setIpCounts();
// clicks.setIpHourlyMaxAmounts();
// const outputSubset = clicks.getOutputSubset();
// console.log("outputSubset", outputSubset);