const readline = require('readline');
const axios = require('axios');
let searchString='';
let srchType;
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const URI = 'http://www.omdbapi.com/?apikey=94dda6e6';
const menu = async()=>{
console.log('Enter your choice:');
console.log(`1. Search movie by title.
2. Search by valid IMDB id.
3. Exit`);

rl.question('>',(ans)=>{
    switch(ans){
        case '1':
            rl.question('Enter movie name:', async(movName)=>{
                rl.question('Enter year of release if known(press enter to leave blank):',async (movYear)=>{
                    if(movYear==='')
                    {
                        searchString = `${URI}&s=${movName}`;
                    }
                    else
                    {
                        searchString = `${URI}&s=${movName}&y=${movYear}`;
                    }
                    const reply = await axios.get(`${searchString}`);
                if(reply.data.Response==='False'){
                    console.log('No/too many results. Please try again.');
                    menu();
                }
                else{
                reply.data.Search.forEach(result=>{
                    delete result.Poster;
                })
                
                // console.log(reply.data.Search[0]);
                console.log('Your search returned the following results:');
                console.table(reply.data.Search);
                rl.question(`Enter index to see details or "x" to exit:`,async(movIndex)=>{
                    if(movIndex==='x')
                    {
                        rl.close();
                    } 
                    else{
                    srchType = reply.data.Search[parseInt(movIndex)].Type;
                    const title = reply.data.Search[parseInt(movIndex)].Title;
                    const yearOfRelease = reply.data.Search[parseInt(movIndex)].Year;
                    console.log(`You chose ${title}`);
                    const movDets = await axios.get(`${URI}&t=${title}&y=${yearOfRelease}`);
                    // console.log(movDets.data);
                    console.log(`${movDets.data.Title} is a ${srchType} of ${movDets.data.Genre} genre directed by ${movDets.data.Director} and written by ${movDets.data.Writer}. The ${srchType} starred ${movDets.data.Actors} in lead roles and released on ${movDets.data.Released}. `);
                    if(movDets.data.Plot != 'N/A'){
                        console.log(`The ${srchType} has the following plot: ${movDets.data.Plot}`)
                    }
                    if(movDets.data.Awards != 'N/A'){
                        console.log(`The ${srchType} has ${movDets.data.Awards}.`)
                    }
                    if(movDets.data.Ratings.length>0){
                        console.log(`The ${srchType} has the following ratings:`);
                        movDets.data.Ratings.forEach(rating=>{
                            console.log(`${rating.Value} by ${rating.Source}.`);
                        })
                    }

                    menu();
                }
                })
            }
                })
                })
            break;

        case '2':
            rl.question('Enter valid imdb id:',async(imdbId)=>{
                searchString = `${URI}&i=${imdbId}`;
                const movieDetails = await axios.get(`${searchString}`);
                console.log(`${movieDetails.data.Title} is a ${movieDetails.data.Type} of ${movieDetails.data.Genre} genre directed by ${movieDetails.data.Director} and written by ${movieDetails.data.Writer}. The ${movieDetails.data.Type} starred ${movieDetails.data.Actors} in lead roles and released on ${movieDetails.data.Released}. `);
                    if(movieDetails.data.Plot != 'N/A'){
                        console.log(`The ${movieDetails.data.Type} has the following plot: ${movieDetails.data.Plot}`)
                    }
                    if(movieDetails.data.Awards != 'N/A'){
                        console.log(`The ${movieDetails.data.Type} has ${movieDetails.data.Awards}.`)
                    }
                    if(movieDetails.data.Ratings.length>0){
                        console.log(`The ${movieDetails.data.Type} has the following rating(s):`);
                        movieDetails.data.Ratings.forEach(rating=>{
                            console.log(`${rating.Value} by ${rating.Source}.`);
                        })
                    }
                menu();
            })
            break;
        case '3':
            rl.close();
            break;
        default:
            console.log('Invalid choice. Please try again.');
            menu();
    }
})
}

menu();