function randomExclude(min, max, howManyRandNums, exclude = []) {
	// ----- exclude array soch smajh ke bharna if bharna hai kabhi toh -----
	let numArr = [];
	let number;
	let infiniteLoopCheck = 0;
	while(numArr.length < howManyRandNums){
		do{
	    	number = Math.floor(Math.random() * (max+1));

	    	infiniteLoopCheck++;
	    	if(infiniteLoopCheck>100000){
	    		return "infiniteloop";
	    		console.log(`Infinite Loop found.`);
	    		break;
	    	}
		}while(numArr.includes(number) || exclude.includes(number) || number<min);

		numArr.push(number);
	}

	// console.log(infiniteLoopCheck);
	return numArr; // this array contains inclusive of min & max
}

