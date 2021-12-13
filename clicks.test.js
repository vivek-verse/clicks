import { Clicks } from "./app.js";
import { readFile } from "fs";

test('Function and file have same output subset data', () => {
	const clicks = new Clicks();
	clicks.setIpCounts();
	clicks.setIpHourlyMaxAmounts();
	const outputSubset = clicks.getOutputSubset();

	readFile("./result-set.json", "utf-8", function(error, data){
		const outputSubsetFromFile = JSON.parse(data);
		expect(outputSubset).toEqual(outputSubsetFromFile);	
	})

})