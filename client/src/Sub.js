import React, {useState, useEffect} from 'react';
var { default: srtParser2 } = require("srt-parser-2")
var parser = new srtParser2()

export default function Sub() {

    const [newData, setNewData] = useState([]); 
    const [allResult, setAllResult] = useState([]); 
    
    useEffect(() => {
        if(newData.length > 0) {
            let data = newData;
            setNewData([]);

            let result = allResult;

            data.forEach(el => {
                        
                el.text.split(' ').forEach(word => {
                    word = word.replace('.', '').replace(',', '');
                    let lowerWord = word.toLowerCase();
                    let find = result.findIndex(obj => obj.text.toLowerCase() === lowerWord);

                    if(find >= 0){
                        result[find].times = result[find].times+1;
                    }else {

                        result.push({
                            times: 1,
                            text: word
                        });

                    }
                
                })

            })

            setAllResult(result.sort((a, b) => b.times-a.times));

        }
    }, [newData, allResult])



    const upload = async (e) => {
        
        // Convert the FileList into an array and iterate
        let files = Array.from(e.target.files).map(file => {
            
            // Define a new file reader
            let reader = new FileReader();
            
            // Create a new promise
            return new Promise(resolve => {
                
                // Resolve the promise after reading file
                reader.onload = (e) => {
                    let text = (e.target.result);
                    let result = parser.fromSrt(text);
                    setNewData(result);
                };
                
                // Reade the file as a text
                reader.readAsText(file);
                
            });
            
        });
        
        // At this point you'll have an array of results
        let res = await Promise.all(files);
        
    }


    return (
        <div className="more-inf sub">
            <div>
                <input type="file" multiple="multiple" onChange={(e) => upload(e)} />
            </div>
            <div className="details">
                {(allResult.length === 0) ? '' :
                    allResult.map((el, key) => {
                        return <div key={key}>
                            <div className="word-det">
                                {el.text}
                            </div>
                            <div>
                                {el.times}
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
