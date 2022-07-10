const readline = require('readline');
const axios = require('axios');
const cfonts = require('cfonts');

let searchString='';
let srchType;
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const URI = 'http://www.omdbapi.com/?apikey=94dda6e6';
cfonts.say('Search movie/game info',{
    font:'shade',
    align:'center',
    lineheight:1
});
const menu = async()=>{
cfonts.say('Enter your choice:',{font:'chrome',
align:'center',
color:'cyanBright.'});
cfonts.say(`1. Search by title.
2. Search by valid IMDB id.
3. Exit`,{
    font:'chrome',
    align:'center',
    color:'cyanBright.'
});

rl.question('>',(ans)=>{
    switch(ans){
        case '1':
            cfonts.say('Enter movie name:',{font:'chrome',
            align:'center',})
            rl.question('>', async(movName)=>{
                cfonts.say('Enter year of release if known(press enter to leave blank):',{font:'chrome',
                align:'center',})
                rl.question('>',async (movYear)=>{
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
                cfonts.say('Your search returned the following results:',{font:'chrome',
                align:'center',
                color:'cyanBright.'});
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
                    cfonts.say(`You chose ${title}`,{font:'chrome',
                    align:'center',
                    color:'cyanBright.'});
                    const movDets = await axios.get(encodeURI(`${URI}&t=${title}&y=${yearOfRelease}`));
                    // console.log(movDets.data);
                    cfonts.say(`${movDets.data.Title} is a ${srchType} of ${movDets.data.Genre} genre directed by ${movDets.data.Director} and written by ${movDets.data.Writer}. The ${srchType} starred ${movDets.data.Actors} in lead roles and released on ${movDets.data.Released}. `,{font:'chrome',
                    align:'center',
                    color:'cyanBright.'});
                    if(movDets.data.Plot != 'N/A'){
                        cfonts.say(`The ${srchType} has the following plot: ${movDets.data.Plot}`,{font:'chrome',
                        align:'center',
                        color:'cyanBright.'})
                    }
                    if(movDets.data.Awards != 'N/A'){
                        cfonts.say(`The ${srchType} has ${movDets.data.Awards}.`, {font:'chrome',
                        align:'center',
                        color:'cyanBright.'})
                    }
                    if(movDets.data.Ratings.length>0){
                        cfonts.say(`The ${srchType} has the following ratings:`,{font:'chrome',
                        align:'center',
                        color:'cyanBright.'});
                        movDets.data.Ratings.forEach(rating=>{
                            cfonts.say(`${rating.Value} by ${rating.Source}.`,{font:'chrome',
                            align:'center',
                            color:'cyanBright.'});
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
            cfonts.say('Enter valid imdb id:', {font:'chrome',
            align:'center',
            color:'cyanBright'})
            rl.question('>',async(imdbId)=>{
                searchString = `${URI}&i=${imdbId}`;
                const movieDetails = await axios.get(`${searchString}`);
                cfonts.say(`${movieDetails.data.Title} is a ${movieDetails.data.Type} of ${movieDetails.data.Genre} genre directed by ${movieDetails.data.Director} and written by ${movieDetails.data.Writer}. The ${movieDetails.data.Type} starred ${movieDetails.data.Actors} in lead roles and released on ${movieDetails.data.Released}. `,{font:'chrome',
                align:'center',
                color:'cyanBright.'});
                    if(movieDetails.data.Plot != 'N/A'){
                        cfonts.say(`The ${movieDetails.data.Type} has the following plot: ${movieDetails.data.Plot}`, {font:'chrome',
                        align:'center',
                        color:'cyanBright.'})
                    }
                    if(movieDetails.data.Awards != 'N/A'){
                        cfonts.say(`The ${movieDetails.data.Type} has ${movieDetails.data.Awards}.`,{font:'chrome',
                        align:'center',
                        color:'cyanBright.'})
                    }
                    if(movieDetails.data.Ratings.length>0){
                        cfonts.say(`The ${movieDetails.data.Type} has the following rating(s):`,{font:'chrome',
                        align:'center',
                        color:'cyanBright.'});
                        movieDetails.data.Ratings.forEach(rating=>{
                            cfonts.say(`${rating.Value} by ${rating.Source}.`, {font:'chrome',
                            align:'center',
                            color:'cyanBright.'});
                        })
                    }
                menu();
            })
            break;
        case '3':
            rl.close();
            break;
        default:
            cfonts.say('Invalid choice. Please try again.',{font:'chrome',
            align:'center',
            color:'cyanBright.'});
            menu();
    }
})
}

menu();