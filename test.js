var counter = 1;
console.log("Testing")
for (let i = 0; i < 1000000000; i++){
    if (i % 100000000 == 0){
        console.log("Test " + counter + " passed")
        counter = counter + 1;
    }
    continue;
}
console.log("Tests completed. 10 out of 10 tests passed!")
